var express = require("express");
var router = express.Router();

var authenticationApi = require("../api/authenticationAPI");


router.post("/login", authenticationApi.AdminLogin);
router.post("/logout", authenticationApi.AdminLogout);

module.exports = router;
