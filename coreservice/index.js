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

// Config: cleanup interval, stale threshold and cache cap
const CACHE_CLEAN_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes
const MONITOR_STALE_MS = 2 * 60 * 1000; // 2 minutes stale threshold
const MAX_MONITORS_IN_CACHE = 500;

// Periodic cache cleanup (summary logging only)
setInterval(() => {
  try {
    const now = Date.now();
    const keys = Object.keys(global.monitorStatusCache);
    let removed = 0;

    keys.forEach((monitorRef) => {
      const entry = global.monitorStatusCache[monitorRef];
      const last = new Date(entry?.lastUpdated || entry?.receivedAt || 0).getTime();
      if (now - last > MONITOR_STALE_MS) {
        delete global.monitorStatusCache[monitorRef];
        removed++;
      }
    });

    if (removed > 0) {
      logger.logInfo(`[CacheCleanup] Removed ${removed} stale monitor entries from cache`);
    }
  } catch (e) {
    logger.logInfo(`[CacheCleanup] Error: ${e && e.message}`);
  }
}, CACHE_CLEAN_INTERVAL_MS);

io.on("connection", (socket) => {
  logger.logInfo(`[Socket] Connected: ${socket.id}`);

  socket.on("register_monitor", (data) => {
    const { monitorRef, monitorName } = data || {};
    logger.logInfo(`[Socket] register_monitor received: ${monitorRef || 'unknown'}`);
    
    if (monitorRef) {
      global.monitorSockets.set(monitorRef, socket);
      logger.logInfo(`[Socket] Monitor registered: ${monitorRef} (${monitorName || 'unnamed'})`);
      socket.emit("registration_confirmed", { success: true, monitorRef, monitorName });
    } else {
      logger.logInfo(`[Socket] Registration failed: No monitorRef provided`);
    }
  });

  // Handle status updates from TV app — DO NOT log every heartbeat
  socket.on("status_response", (data) => {
    if (!data || !data.monitorRef) {
      // Log invalid payloads (rare)
      logger.logInfo(`[Socket] Invalid status_response received (missing monitorRef)`);
      return;
    }

    const monitorRef = data.monitorRef;
    const prev = global.monitorStatusCache[monitorRef];

    // Enforce cache size limit: don't add new monitors if cap reached
    const currentCacheSize = Object.keys(global.monitorStatusCache).length;
    if (!prev && currentCacheSize >= MAX_MONITORS_IN_CACHE) {
      logger.logInfo(`[Socket] Cache capacity reached (${MAX_MONITORS_IN_CACHE}). Ignoring new monitor ${monitorRef}`);
      return;
    }

    // Update lastUpdated/receivedAt and store full payload fields for admin UI
    global.monitorStatusCache[monitorRef] = {
      monitorRef,
      monitorName: data.monitorName || (prev && prev.monitorName) || null,

      // Full payload fields for admin display
      currentPlaylist: data.currentPlaylist || (prev && prev.currentPlaylist) || null,
      playlistType: data.playlistType || (prev && prev.playlistType) || null,
      scheduleRef: data.scheduleRef || (prev && prev.scheduleRef) || null,
      currentMedia: data.currentMedia || (prev && prev.currentMedia) || null,
      mediaIndex: typeof data.mediaIndex !== "undefined" ? data.mediaIndex : (prev && prev.mediaIndex) || 0,
      totalMedia: typeof data.totalMedia !== "undefined" ? data.totalMedia : (prev && prev.totalMedia) || 0,
      screenState: data.screenState || (prev && prev.screenState) || null,
      errors: Array.isArray(data.errors) ? data.errors : (prev && prev.errors) || [],
      healthStatus: data.healthStatus || (prev && prev.healthStatus) || null,
      isProgressing: typeof data.isProgressing !== "undefined" ? data.isProgressing : (prev && prev.isProgressing) || false,
      playbackPosition: typeof data.playbackPosition !== "undefined" ? data.playbackPosition : (prev && prev.playbackPosition) || null,

      // summary/counts for quick checks
      errorsCount: Array.isArray(data.errors) ? data.errors.length : (prev && prev.errorsCount) || 0,

      // Metadata
      socketId: socket.id,
      lastUpdated: new Date(),
      receivedAt: new Date().toISOString()
    };

    // Logging policy: only log first-seen, health status changes, or presence of errors
    if (!prev) {
      logger.logInfo(`[Socket] First heartbeat cached for ${monitorRef} at ${global.monitorStatusCache[monitorRef].receivedAt}`);
    } else {
      const prevHealth = prev.healthStatus || null;
      const newHealth = data.healthStatus || null;
      const errorsCount = global.monitorStatusCache[monitorRef].errorsCount || 0;
      if (newHealth && newHealth !== prevHealth) {
        logger.logInfo(`[Socket] Health change ${monitorRef}: ${prevHealth} -> ${newHealth} @ ${global.monitorStatusCache[monitorRef].receivedAt}`);
      } else if (errorsCount > 0 && errorsCount !== (prev.errorsCount || 0)) {
        // log presence of errors only (summary)
        logger.logInfo(`[Socket] Errors reported by ${monitorRef}: count=${errorsCount} @ ${global.monitorStatusCache[monitorRef].receivedAt}`);
      }
    }
  });

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

  socket.on("disconnect", () => {
    logger.logInfo(`[Socket] Disconnected: ${socket.id}`);
    
    for (let [mRef, s] of global.monitorSockets.entries()) {
      if (s.id === socket.id) {
        global.monitorSockets.delete(mRef);
        logger.logInfo(`[Socket] Monitor socket removed: ${mRef}`);
        // Keep last known cache (cleanup job will remove stale entries)
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