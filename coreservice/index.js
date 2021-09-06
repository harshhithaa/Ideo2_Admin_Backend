require("dotenv").config({ path: __dirname + "/.envconfig" });
var settings = require("./common/settings").Settings;
var databaseModule = require("./database/database");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var appLib = require("applib");
var upload = require("./helper/general").getFileUploadConfig;
var cors = require("cors");

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
startServerProcess(logger);

var middleware = require("./middleware/authenticator");
app.use(middleware.AuthenticateRequest);

var authenticationRoute = require("./routes/authenticationRoutes");
app.use("/api/authentication", authenticationRoute);

var adminRoute = require("./routes/adminRoutes");
app.use("/api/admin", adminRoute);

var deviceRoute = require("./routes/deviceRoutes");
app.use("/api/device", deviceRoute);

// Fetch Primary Setings From Database Residing in applib
async function startServerProcess(logger) {
  try {
  
    logger.logInfo(`StartServerProcess Invoked()`);
    await appLib.fetchDBSettings(
      logger,
      settings,
      databaseModule
    );
 
    app.listen(process.env.NODE_PORT, () => {
      
      logger.logInfo("server running on port " + process.env.NODE_PORT);
      console.log("server running on port " + process.env.NODE_PORT);
    
    });
  } catch (errFetchDBSettings) {
    logger.logInfo(
      "Error occured in starting node services. Need immediate check."
    );
  }
}
