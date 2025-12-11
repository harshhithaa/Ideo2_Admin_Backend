require("dotenv").config({ path: __dirname + "/.envconfig" });
var settings = require("./common/settings").Settings;
var databaseModule = require("./database/database");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var appLib = require("applib");
var upload = require("./helper/general").getFileUploadConfig;
var cors = require("cors");
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
// Initialize global cache for monitor status
global.monitorStatusCache = {};

io.on("connection", (socket) => {
  logger.logInfo(`[Socket] Connected: ${socket.id}`);

  // ✅ FIX: Listen for 'register_monitor' (matches TV app)
  socket.on("register_monitor", (data) => {
    const { monitorRef, monitorName } = data || {};
    logger.logInfo(`[Socket] register_monitor received: ${JSON.stringify(data)}`);
    
    if (monitorRef) {
      global.monitorSockets.set(monitorRef, socket);
      logger.logInfo(`[Socket] Monitor registered: ${monitorRef} (${monitorName})`);
      socket.emit("registration_confirmed", { 
        success: true, 
        monitorRef,
        monitorName 
      });
    } else {
      logger.logInfo(`[Socket] Registration failed: No monitorRef provided`);
    }
  });

  // ✅ KEEP: Handle status updates from TV app
  socket.on("status_response", (data) => {
    logger.logInfo(`[Socket] status_response from ${data?.monitorRef}`);
    
    if (data && data.monitorRef) {
      // ✅ Store ALL data from TV app (including health fields)
      global.monitorStatusCache[data.monitorRef] = {
        ...data, // This includes: currentPlaylist, currentMedia, screenState, errors, healthStatus, etc.
        socketId: socket.id,
        lastUpdated: new Date(),
        receivedAt: new Date().toISOString()
      };
      
      logger.logInfo(`[Socket] Status cached for ${data.monitorRef}: ${JSON.stringify({
        currentPlaylist: data.currentPlaylist,
        currentMedia: data.currentMedia,
        healthStatus: data.healthStatus,
        screenState: data.screenState,
        errorsCount: data.errors?.length || 0
      })}`);
    } else {
      logger.logInfo(`[Socket] Invalid status_response: ${JSON.stringify(data)}`);
    }
  });

  // ✅ Handle admin requesting status
  socket.on("request_status", (data) => {
    const { monitorRef } = data || {};
    logger.logInfo(`[Socket] Admin requesting status for: ${monitorRef}`);
    
    if (monitorRef && global.monitorSockets.has(monitorRef)) {
      const monitorSocket = global.monitorSockets.get(monitorRef);
      monitorSocket.emit("request_status");
      logger.logInfo(`[Socket] Status request sent to monitor: ${monitorRef}`);
    } else {
      logger.logInfo(`[Socket] Monitor not connected: ${monitorRef}`);
    }
  });

  // ✅ FIX: Don't delete cache on disconnect (keep for offline detection)
  socket.on("disconnect", () => {
    logger.logInfo(`[Socket] Disconnected: ${socket.id}`);
    
    // Remove from active sockets
    for (let [mRef, s] of global.monitorSockets.entries()) {
      if (s.id === socket.id) {
        global.monitorSockets.delete(mRef);
        logger.logInfo(`[Socket] Monitor socket removed: ${mRef}`);
        
        // ✅ DON'T delete cache - keep last known state for offline detection
        // The cache will show 'offline' status based on lastUpdated timestamp
        logger.logInfo(`[Socket] Keeping status cache for offline detection: ${mRef}`);
        break;
      }
    }
  });
});

// Make io available to routes (for admin to request status)
app.set('io', io);
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