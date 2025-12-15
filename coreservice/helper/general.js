var polyline = require("polyline");
var settings = require("../common/settings").Settings;
var Razorpay = require("razorpay");
var multer = require("multer");
var constant = require("../common/constant");
var momentTimezone = require("moment-timezone");
var databaseHelper = require("../helper/databasehelper");
var fileConfiguration = require("../common/settings").FileConfiguration;
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
var ffmpeg = require("fluent-ffmpeg");
var path = require("path");

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
    filename: async function (req, file, cb) {
      // Better filename to avoid conflicts
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Log file details for debugging
    console.log('Uploaded file details:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      encoding: file.encoding
    });

    // Allowed MIME types
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/bmp',
      'image/gif',
      'image/webp',
      'image/avif',  // ✅ Add AVIF support
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo'
    ];

    // Allowed extensions
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp', '.gif', '.webp', '.avif', '.mp4', '.mov', '.avi'];  // ✅ Add .avif
    
    // Get file extension
    const fileExt = path.extname(file.originalname).toLowerCase();

    // Check both MIME type and extension
    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
      cb(null, true);
    } else {
      console.error('File rejected:', {
        mimetype: file.mimetype,
        extension: fileExt,
        originalname: file.originalname
      });
      cb(new Error(`Invalid File: Only images (png, jpg, jpeg, bmp, gif, webp, avif) and videos (mp4, mov, avi) are allowed. Received: ${file.mimetype}`), false);
    }
  },
  limits: {
    fileSize: parseInt(fileConfiguration.FileSize || 10) * 1024 * 1024, // Default 10MB if not set
  },
});