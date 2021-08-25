var polyline = require("polyline");
var settings = require("../common/settings").Settings;
var Razorpay = require("razorpay");
var multer = require("multer");
var constant = require("../common/constant");
var momentTimezone = require("moment-timezone");
var databaseHelper = require("../helper/databasehelper");
var fileConfiguration = require("../common/settings").FileConfiguration;

exports.getValue = function (requestArray, key) {
  var requestArrayLength = requestArray ? requestArray.length : 0;

  for (
    var requestArrayCount = 0;
    requestArrayCount < requestArrayLength;
    requestArrayCount++
  ) {
    if (requestArray[requestArrayCount].key === key) {
      return requestArray[requestArrayCount].value;
    }
  }
  return null;
};


exports.getFileUploadConfig = multer({
  storage: multer.diskStorage({
    destination: fileConfiguration.LocalStorage,
    filename: function (req, file, cb) {
      cb(null, new Date().toDateString() + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
   
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/bmp"||
      file.mimetype === "video/mp4"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid File"), false);
    }
  },
  // limits: {
  //   fileSize: parseInt(fileConfiguration.FileSize) * 1024 * 1024,
  // },
});
