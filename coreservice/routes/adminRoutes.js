var express = require("express");
var router = express.Router();

var adminApi = require("../api/adminAPI");


router.post("/savesystemuser", adminApi.SaveSystemUser);
router.post("/savemedia", adminApi.SaveMedia);
router.post("/saveplaylist", adminApi.SavePlaylist);
router.post("/saveschedule", adminApi.SaveSchedule);
router.post("/savemonitor", adminApi.SaveMonitor);
router.get("/componentlist", adminApi.GetAdminComponents);

module.exports = router;

