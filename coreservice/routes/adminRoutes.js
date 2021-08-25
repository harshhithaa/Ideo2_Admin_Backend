var express = require("express");
var router = express.Router();

var adminApi = require("../api/adminApi");


router.post("/savesystemuser", adminApi.SaveSystemUser);

module.exports = router;

