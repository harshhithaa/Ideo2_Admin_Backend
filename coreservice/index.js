require("dotenv").config({ path: __dirname + "/.envconfig" });
var settings = require("./common/settings").Settings;
var databaseModule = require("./database/database");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var appLib = require("applib");
var upload = require("./helper/general").getFileUploadConfig;
var cors = require("cors");
// NEW:
var http = require("http");
var { Server } = require("socket.io");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(upload.array("Media"));

app.use(cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

var logger = new appLib.Logger(null, null);

// Create HTTP server and Socket.IO instance
var server = http.createServer(app);
var io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store connected monitors: monitorRef -> socket
global.monitorSockets = new Map();
// ✅ ADD THIS: Initialize global cache for monitor status
global.monitorStatusCache = {};

io.on("connection", (socket) => {
  logger.logInfo(`Socket connected: ${socket.id}`);

  socket.on("monitor_register", (data) => {
    const { monitorRef } = data || {};
    if (monitorRef) {
      global.monitorSockets.set(monitorRef, socket);
      logger.logInfo(`Monitor registered via socket: ${monitorRef}`);
      socket.emit("registration_confirmed", { success: true, monitorRef });
    }
  });

  // ✅ FIX: Store current server time, not the timestamp from monitor
  socket.on("status_response", (data) => {
    logger.logInfo(`status_response from ${data && data.monitorRef}: ${JSON.stringify(data)}`);
    
    if (data && data.monitorRef) {
      global.monitorStatusCache[data.monitorRef] = {
        ...data,
        socketId: socket.id,
        // ✅ Use current server time instead of monitor's timestamp
        lastUpdated: new Date(),
        receivedAt: new Date().toISOString()
      };
    }
  });

  socket.on("disconnect", () => {
    logger.logInfo(`Socket disconnected: ${socket.id}`);
    
    for (let [mRef, s] of global.monitorSockets.entries()) {
      if (s.id === socket.id) {
        global.monitorSockets.delete(mRef);
        logger.logInfo(`Monitor disconnected: ${mRef}`);
        break;
      }
    }
    
    Object.keys(global.monitorStatusCache).forEach(monitorRef => {
      if (global.monitorStatusCache[monitorRef].socketId === socket.id) {
        delete global.monitorStatusCache[monitorRef];
        logger.logInfo(`Monitor status cache cleared: ${monitorRef}`);
      }
    });
  });
});

// make io available to other modules if required
module.exports.io = io;

startServerProcess(logger);

var middleware = require("./middleware/authenticator");
app.use(middleware.AuthenticateRequest);

var authenticationRoute = require("./routes/authenticationRoutes");
app.use("/api/authentication", authenticationRoute);

var adminRoute = require("./routes/adminRoutes");
app.use("/api/admin", adminRoute);

var deviceRoute = require("./routes/deviceRoutes");
app.use("/api/device", deviceRoute);

var monitorRoute = require("./routes/monitorRoutes");
app.use("/api/monitor", monitorRoute);

// Fetch Primary Settings From Database
async function startServerProcess(logger) {
  try {
    logger.logInfo(`StartServerProcess Invoked()`);
    await appLib.fetchDBSettings(logger, settings, databaseModule);

    server.listen(process.env.NODE_PORT, () => {
      logger.logInfo("server running on port " + process.env.NODE_PORT);
      console.log("server running on port " + process.env.NODE_PORT);
    });
  } catch (errFetchDBSettings) {
    logger.logInfo("Error occured in starting node services. Need immediate check.");
  }
}