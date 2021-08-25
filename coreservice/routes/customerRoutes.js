var express = require("express");
var router = express.Router();


var customerApi = require("../api/customerAPI");

router.get("/packages", customerApi.GetPackageItemDetails);
router.post("/monitors", customerApi.GetMonitorItemDetails)
router.post("/savemonitors", customerApi.SaveScreens);
router.post("/updatemonitors", customerApi.SaveScreensU);
router.post("/deletemonitors", customerApi.SaveScreensUDEL);



router.post("/iscustomerpresent", customerApi.IsCustomerPresent);
router.post("/login", customerApi.CustomerLogin);
router.post("/loginapp", customerApi.CustomerLoginApp);
router.post("/getplaylistapp", customerApi.GetCustomerPlaylist);
router.post("/upload", customerApi.CustomerUpload);

router.post("/playlist", customerApi.CustomerPlaylist);
router.post("/schedule", customerApi.CustomerSchedule);

router.patch("/updatecustomerdetails", customerApi.UpdateCustomerDetails);


module.exports = router;
