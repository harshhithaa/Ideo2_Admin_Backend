var momentTimezone = require("moment-timezone");

class functionContext {
  constructor(requestType, error, res, logger) {
    this.requestType = requestType;
    this.requestID = res.apiContext.requestID;
    this.userRef = res.apiContext.userRef;
    this.userType = res.apiContext.userType;
    this.userFirebaseAuth = res.apiContext.userFirebaseAuth;
    this.error = null;
    this.res = res;
    this.logger = logger;
    this.requestContext = null; // Add this line
    this.currentTs = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss");
  }
}

class apiContext {
  constructor(requestID, mailer) {
    (this.requestID = requestID),
      (this.userRef = null),
      (this.userType = null),
      (this.userID = null),
      (this.currentTs = momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss"));
  }
}

class errorModel {
  constructor(errorMessage, errorCode, errorDescription) {
    this.ErrorCode = errorCode;
    this.ErrorMessage = errorMessage;
    this.ErrorDescription = errorDescription;
  }
}

class validateRequest {
  constructor(req) {
    (this.apiUri = req.path),
      (this.authToken = req.headers.authtoken),
      (this.authorization = req.headers.authorization),
      (this.appVersion = req.headers.appversion);
  }
}

class validateResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class isAdminPresentRequest {
  constructor(req) {
    this.phone = req.body.Phone ? req.body.Phone : null;
    this.email = req.body.Email ? req.body.Email : null;
    this.loginType = req.body.LoginType ? req.body.LoginType : null;
    this.currentTimestamp = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}

class isAdminPresentResponse {
  constructor() {
    this.Details = {
      CustomerRef: null,
      VerificationStatus: null,
      AuthToken: null,
    };
    (this.RequestID = null), (this.Error = null);
  }
}

class adminLoginRequest {
  constructor(req) {
    this.email = req.body.Email ? req.body.Email : null;
    this.password = req.body.Password ? req.body.Password : null;
  }
}

class adminLoginResponse {
  constructor() {
    (this.Error = {}),
      (this.Details = {
        AuthToken: null,
        UserRef: null,
        UserType: null,
      }),
      (this.RequestID = null);
  }
}

class adminLogoutResponse {
  constructor() {
    (this.Error = {}),
      (this.Details = {
        UserRef: null,
      }),
      (this.RequestID = null);
  }
}

class saveSystemUserRequest {
  constructor(req) {
    this.adminRef = req.body.AdminRef ? req.body.AdminRef : null;
    this.userName = req.body.UserName ? req.body.UserName : null;
    this.email = req.body.Email ? req.body.Email : null;
    this.phone = req.body.Phone ? req.body.Phone : null;
    this.password = req.body.Password ? req.body.Password : null;
    this.isActive = req.body.IsActive ? req.body.IsActive : 0;
  }
}

class saveSystemUserResponse {
  constructor() {
    (this.Error = null), (this.Details = {}), (this.RequestID = null);
  }
}

class getAdminComponentRequest {
  constructor(req) {
    this.componentType = req.query.componenttype
      ? req.query.componenttype
      : null;
  }
}

class getAdminComponentResponse {
  constructor() {
    (this.Error = null), (this.Details = {}), (this.RequestID = null);
  }
}

class getAdminComponentDetailsRequest {
  constructor(req) {
    this.componentType = req.body.ComponentType ? req.body.ComponentType : null;
    this.componentRef = req.body.ComponentRef ? req.body.ComponentRef : null;
  }
}

class getAdminComponentDetailsResponse {
  constructor() {
    (this.Error = null), (this.Details = {}), (this.RequestID = null);
  }
}

class saveMediaRequest {
  constructor(req) {
    this.userReference = req.body.UserReference ? req.body.UserReference : null;
    this.currentTs = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}

class saveMediaResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        Media: [],
      }),
      (this.RequestID = null);
  }
}

class saveMonitorRequest {
  constructor(req) {
    this.monitorRef = req.body.MonitorRef ? req.body.MonitorRef : null;
    this.monitorName = req.body.MonitorName ? req.body.MonitorName : null;
    this.description = req.body.Description ? req.body.Description : null;
    this.defaultPlaylistRef = req.body.DefaultPlaylistRef
      ? req.body.DefaultPlaylistRef
      : null;
    this.schedules = req.body.Schedules ? req.body.Schedules : null;
    this.isActive = req.body.IsActive ? req.body.IsActive : null;
    this.orientation = req.body.Orientation ? req.body.Orientation : null;
    this.slideTime = req.body.SlideTime ? req.body.SlideTime : null;
    this.currentTs = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}

class saveMonitorResponse {
  constructor() {
    (this.Error = null), (this.Details = {}), (this.RequestID = null);
  }
}

class savePlaylistRequest {
  constructor(req) {
    // Changed to read lowercase body keys (matches frontend and usp_save_playlist expectations)
    this.playlistRef = req.body.playlistRef ? req.body.playlistRef : null;
    this.playlistName = req.body.playlistName ? req.body.playlistName : null;
    this.description = req.body.description ? req.body.description : null;
    this.playlist = req.body.playlist ? req.body.playlist : null;
    this.isActive = req.body.isActive ? req.body.isActive : null;
    this.currentTs = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}

class savePlaylistResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        PlaylistReference: null,
      }),
      (this.RequestID = null);
  }
}

class saveScheduleRequest {
  constructor(req) {
    this.scheduleRef = req.body.ScheduleRef ? req.body.ScheduleRef : null;
    this.scheduleTitle = req.body.ScheduleTitle ? req.body.ScheduleTitle : null;
    this.description = req.body.Description ? req.body.Description : null;
    this.playlistRef = req.body.PlaylistRef ? req.body.PlaylistRef : null;
    this.monitorRef = req.body.MonitorRef ? req.body.MonitorRef : null;
    this.schedule = req.body.Schedule ? req.body.Schedule : null;
    this.fixedTimePlayback = req.body.FixedTimePlayback
      ? req.body.FixedTimePlayback
      : 0;
    this.isActive = req.body.IsActive ? req.body.IsActive : null;
    this.currentTs = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}
class saveScheduleResponse {
  constructor() {
    (this.Error = null), (this.Details = {}), (this.RequestID = null);
  }
}

class deleteAdminComponentsRequest {
  constructor(req) {
    this.componentType = req.body.ComponentType ? req.body.ComponentType : null;
    this.componentList = req.body.ComponentList ? req.body.ComponentList : null;
    this.currentTs = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}

class deleteAdminComponentsResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        IsDeleted: false,
      }),
      (this.RequestID = null);
  }
}

class validateDeleteAdminComponentsRequest {
  constructor(req) {
    this.componentType = req.body.ComponentType ? req.body.ComponentType : null;
    this.componentList = req.body.ComponentList ? req.body.ComponentList : null;
    this.currentTs = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}

class validateDeleteAdminComponentsResponse {
  constructor() {
    (this.Error = null), (this.Details = {}), (this.RequestID = null);
  }
}

class monitorDetailsRequest {
  constructor(req) {
    this.monitorRef = req.body.MonitorRef ? req.body.MonitorRef : null;
  }
}

class monitorDetailsResponse {
  constructor() {
    (this.Error = null), (this.Details = {}), (this.RequestID = null);
  }
}

class monitorLoginRequest {
  constructor(req) {
    this.monitorUser = req.body.MonitorUser ? req.body.MonitorUser : null;
    this.password = req.body.Password ? req.body.Password : null;
  }
}

class monitorLoginResponse {
  constructor() {
    (this.Error = null), (this.Details = {}), (this.RequestID = null);
  }
}

class updateAllMonitorsRequest {
  constructor(req) {
    this.monitorList = req.body.MonitorList ? req.body.MonitorList : null;
    this.playlistRef = req.body.PlaylistRef ? req.body.PlaylistRef : null;
  }
}

class updateAllMonitorsResponse {
  constructor() {
    (this.Error = null), (this.Details = null), (this.RequestID = null);
  }
}

class fetchMediaRequest {
  constructor(req) {
    this.mediaRef = req.query.MediaRef ? req.query.MediaRef : null;
  }
}

class fetchMediaResponse {
  constructor() {
    (this.Error = null), (this.Details = null), (this.RequestID = null);
  }
}

class getAdminComponentWithPaginationRequest {
  constructor(req) {
    // Handle both componenttype and componentType (case-insensitive)
    const compType = req.query.componenttype || req.query.componentType || req.query.ComponentType;
    this.componentType = compType ? parseInt(compType) : null;
    
    // Handle searchtext variations
    this.searchText = req.query.searchtext || req.query.searchText || '';
    
    // Handle mediatype variations
    this.mediaType = req.query.mediatype || req.query.mediaType || null;
    
    // Handle isactive variations - DEFAULT TO 1 (active only)
    const activeStatus = req.query.isactive || req.query.isActive;
    this.isActive = activeStatus !== undefined ? parseInt(activeStatus) : 1;
    
    // Handle userid variations
    this.userId = req.query.userid || req.query.userId || null;
    
    // Handle pagenumber variations
    const pageNum = req.query.pagenumber || req.query.pageNumber;
    this.pageNumber = pageNum ? parseInt(pageNum) : 1;
    
    // Handle pagesize variations - DEFAULT TO 12
    const pageSz = req.query.pagesize || req.query.pageSize;
    this.pageSize = pageSz ? parseInt(pageSz) : 12;
  }
}

class getAdminComponentWithPaginationResponse {
  constructor() {
    this.Error = null;
    this.Details = {
      ComponentList: [],
      TotalRecords: 0,
      PageNumber: 1,
      PageSize: 10,
      TotalPages: 0
    };
    this.RequestID = null;
  }
}

module.exports.ErrorModel = errorModel;
module.exports.AdminLoginRequest = adminLoginRequest;
module.exports.AdminLoginResponse = adminLoginResponse;
module.exports.ValidateRequest = validateRequest;
module.exports.ValidateResponse = validateResponse;
module.exports.FunctionContext = functionContext;
module.exports.ApiContext = apiContext;
module.exports.IsAdminPresentRequest = isAdminPresentRequest;
module.exports.IsAdminPresentResponse = isAdminPresentResponse;
module.exports.SaveSystemUserRequest = saveSystemUserRequest;
module.exports.SaveSystemUserResponse = saveSystemUserResponse;
module.exports.SaveMediaRequest = saveMediaRequest;
module.exports.SaveMediaResponse = saveMediaResponse;
module.exports.GetAdminComponentRequest = getAdminComponentRequest;
module.exports.GetAdminComponentResponse = getAdminComponentResponse;
module.exports.GetAdminComponentDetailsRequest =
  getAdminComponentDetailsRequest;
module.exports.GetAdminComponentDetailsResponse =
  getAdminComponentDetailsResponse;
module.exports.SavePlaylistRequest = savePlaylistRequest;
module.exports.SavePlaylistResponse = savePlaylistResponse;
module.exports.SaveScheduleRequest = saveScheduleRequest;
module.exports.SaveScheduleResponse = saveScheduleResponse;
module.exports.SaveMonitorRequest = saveMonitorRequest;
module.exports.SaveMonitorResponse = saveMonitorResponse;
module.exports.DeleteAdminComponentsRequest = deleteAdminComponentsRequest;
module.exports.DeleteAdminComponentsResponse = deleteAdminComponentsResponse;
module.exports.ValidateDeleteAdminComponentsRequest =
  validateDeleteAdminComponentsRequest;
module.exports.ValidateDeleteAdminComponentsResponse =
  validateDeleteAdminComponentsResponse;
module.exports.AdminLogoutResponse = adminLogoutResponse;
module.exports.MonitorDetailsRequest = monitorDetailsRequest;
module.exports.MonitorDetailsResponse = monitorDetailsResponse;
module.exports.MonitorLoginRequest = monitorLoginRequest;
module.exports.MonitorLoginResponse = monitorLoginResponse;
module.exports.UpdateAllMonitorsRequest = updateAllMonitorsRequest;
module.exports.UpdateAllMonitorsResponse = updateAllMonitorsResponse;
module.exports.FetchMediaRequest = fetchMediaRequest;
module.exports.FetchMediaResponse = fetchMediaResponse;
module.exports.GetAdminComponentWithPaginationRequest = getAdminComponentWithPaginationRequest;
module.exports.GetAdminComponentWithPaginationResponse = getAdminComponentWithPaginationResponse;
