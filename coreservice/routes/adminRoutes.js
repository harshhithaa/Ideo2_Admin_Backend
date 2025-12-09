var express = require("express");
var router = express.Router();

var adminApi = require("../api/adminAPI");

router.post("/savesystemuser", adminApi.SaveSystemUser);
router.post("/savemedia", adminApi.SaveMedia);
router.post("/saveplaylist", adminApi.SavePlaylist);
router.post("/saveschedule", adminApi.SaveSchedule);
router.post("/savemonitor", adminApi.SaveMonitor);
router.get("/componentlist", adminApi.GetAdminComponents);
router.get("/componentlistpaginated", adminApi.GetAdminComponentsWithPagination); // New route
// Alias route for playlist UI to explicitly use paginated endpoint
router.get("/componentlistforplaylist", adminApi.GetAdminComponentsWithPagination);

// NEW: fetch single media (used by frontend polling)
router.get("/fetchmedia", adminApi.FetchMedia);

router.post("/deletecomponentlist", adminApi.DeleteAdminComponents);
router.post(
  "/validatedeletecomponentlist",
  adminApi.ValidateDeleteAdminComponents
);
router.post("/componentdetails", adminApi.GetAdminComponentsDetails);
router.post("/updateallmonitors", adminApi.UpdateAllMonitors);

// NEW: Pull-based monitor status endpoint
router.get("/monitor/:monitorRef/status", adminApi.GetMonitorStatus);

module.exports = router;