var express = require("express");
var router = express.Router();

var adminApi = require("../api/adminApi");


router.post("/savesystemuser", adminApi.SaveSystemUser);
router.post("/savemedia", adminApi.SaveMedia);
router.post("/saveplaylist", adminApi.SavePlaylist);

module.exports = router;

