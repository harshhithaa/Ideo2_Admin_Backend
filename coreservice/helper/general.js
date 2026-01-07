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
const fs = require('fs');

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
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB max file size
    files: 10 // max 10 files per request
  },
});

// Periodic cleanup: delete files older than threshold from local upload folder.
// Configure via env vars:
// LOCALSTORAGE_CLEANUP_MINUTES (default 10) - file age threshold
// LOCALSTORAGE_CLEANUP_INTERVAL_MINUTES (default 30) - run interval
(function startLocalStorageCleanup() {
  const storagePath = fileConfiguration && fileConfiguration.LocalStorage;
  if (!storagePath) {
    console.log('LocalStorage cleanup: no LocalStorage configured, skipping cleanup.');
    return;
  }

  const thresholdMinutes = parseInt(process.env.LOCALSTORAGE_CLEANUP_MINUTES || '10', 10);
  const intervalMinutes = parseInt(process.env.LOCALSTORAGE_CLEANUP_INTERVAL_MINUTES || '30', 10);
  const thresholdMs = Math.max(0, thresholdMinutes) * 60 * 1000;
  const intervalMs = Math.max(1, intervalMinutes) * 60 * 1000;

  async function runCleanupOnce() {
    try {
      const files = await fs.promises.readdir(storagePath);
      for (const f of files) {
        try {
          const full = path.join(storagePath, f);
          const st = await fs.promises.stat(full);
          if (!st.isFile()) continue;
          const age = Date.now() - st.mtimeMs;
          if (age > thresholdMs) {
            await fs.promises.unlink(full);
            console.log(`LocalStorage cleanup: deleted ${full}`);
          }
        } catch (fileErr) {
          console.log(`LocalStorage cleanup: error handling file ${f}: ${fileErr && fileErr.message}`);
        }
      }
    } catch (err) {
      console.log(`LocalStorage cleanup: error reading directory ${storagePath}: ${err && err.message}`);
    }
  }

  // initial run and schedule
  runCleanupOnce().catch((e) => console.log('LocalStorage cleanup initial run error:', e && e.message));
  const timer = setInterval(() => {
    runCleanupOnce().catch((e) => console.log('LocalStorage cleanup scheduled run error:', e && e.message));
  }, intervalMs);

  // expose stop for tests/debug if needed
  module.exports._stopLocalStorageCleanup = () => clearInterval(timer);

  console.log(`LocalStorage cleanup started: path=${storagePath}, thresholdMinutes=${thresholdMinutes}, intervalMinutes=${intervalMinutes}`);
})();