var databaseHelper = require("../helper/databasehelper");
var coreRequestModel = require("../models/coreServiceModel");
var constant = require("../common/constant");
var requestType = constant.RequestType;
var appLib = require("applib");
var bcrypt = require("bcryptjs");
var settings = require("../common/settings").Settings;
var joiValidationModel = require("../models/validationModel");
const mailSettings = require("../common/settings").MailSettings;
var mailer = new appLib.Mailer(mailSettings);
var moment = require("moment-timezone");

module.exports.MonitorLogin = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`MonitorLogin invoked()!!`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.MONITORLOGIN,
    null,
    res,
    logger
  );

  var monitorLoginRequest = new coreRequestModel.MonitorLoginRequest(req);
  logger.logInfo(`MonitorLogin() :: Request Object : ${monitorLoginRequest}`);

  var validateRequest =
    joiValidationModel.monitorLoginRequest(monitorLoginRequest);

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `MonitorLogin() Error:: Invalid Request :: ${JSON.stringify(
        monitorLoginRequest
      )}`
    );
    saveMonitorLoginResponse(functionContext, null);
    return;
  }

  var requestContext = {
    ...monitorLoginRequest,
  };

  try {
    var MonitorLoginDBResult = await databaseHelper.monitorLoginDB(
      functionContext,
      requestContext
    );

    saveMonitorLoginResponse(functionContext, MonitorLoginDBResult);
  } catch (errMonitorLogin) {
    if (!errMonitorLogin.ErrorMessage && !errMonitorLogin.ErrorCode) {
      logger.logInfo(`MonitorLogin() :: Error :: ${errMonitorLogin}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `MonitorLogin() :: Error :: ${JSON.stringify(errMonitorLogin)}`
    );
    saveMonitorLoginResponse(functionContext, null);
  }
};

module.exports.FetchMonitorDetails = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`FetchMonitorDetails invoked()!!`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.FETCHMONITORDETAILS,
    null,
    res,
    logger
  );

  var fetchMonitorDetailsRequest = new coreRequestModel.MonitorDetailsRequest(
    req
  );
  logger.logInfo(
    `MonitorLogin() :: Request Object : ${fetchMonitorDetailsRequest}`
  );

  var validateRequest = joiValidationModel.monitorDetailsRequest(
    fetchMonitorDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `MonitorLogin() Error:: Invalid Request :: ${JSON.stringify(
        fetchMonitorDetailsRequest
      )}`
    );
    fetchMonitorDetailsResponse(functionContext, null);
    return;
  }

  var requestContext = {
    ...fetchMonitorDetailsRequest,
  };

  try {
    let fetchMonitorDetailsResult =
      await databaseHelper.fetchMonitorDetailsRequest(
        functionContext,
        requestContext
      );

    let processScheduleDetailsResult = await processScheduleDetails(
      functionContext,
      fetchMonitorDetailsResult
    );

    let orientation = await getOrientation(
      functionContext,
      fetchMonitorDetailsResult
    );

    fetchMonitorDetailsResponse(
      functionContext,
      processScheduleDetailsResult,
      orientation
    );
  } catch (errMonitorDetails) {
    if (!errMonitorDetails.ErrorMessage && !errMonitorDetails.ErrorCode) {
      logger.logInfo(
        `fetchMonitorDetailsResponse() :: Error :: ${errMonitorDetails}`
      );
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchMonitorDetailsResponse() :: Error :: ${JSON.stringify(
        errMonitorDetails
      )}`
    );
    fetchMonitorDetailsResponse(functionContext, null, null);
  }
};

module.exports.FetchMedia = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`FetchMedia invoked()!!`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.FETCHMEDIA,
    null,
    res,
    logger
  );

  var fetchMediaRequest = new coreRequestModel.FetchMediaRequest(req);
  logger.logInfo(`MonitorLogin() :: Request Object : ${fetchMediaRequest}`);

  var validateRequest = joiValidationModel.fetchMediaRequest(fetchMediaRequest);

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `MonitorLogin() Error:: Invalid Request :: ${JSON.stringify(
        fetchMediaRequest
      )}`
    );
    fetchMediaResponse(functionContext, null);
    return;
  }

  try {
    let fetchMediaFromDb = await databaseHelper.fetchMediaFromDB(
      functionContext,
      fetchMediaRequest
    );

    fetchMediaResponse(functionContext, fetchMediaFromDb);
  } catch (errFetchMedia) {
    if (!errFetchMedia.ErrorMessage && !errFetchMedia.ErrorCode) {
      logger.logInfo(
        `fetchMonitorDetailsResponse() :: Error :: ${errFetchMedia}`
      );
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchMonitorDetailsResponse() :: Error :: ${JSON.stringify(
        errFetchMedia
      )}`
    );
    fetchMediaResponse(functionContext, null, null);
  }
};

var fetchMediaResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`fetchMediaResponse() invoked`);

  var fetchMediaResponse = new coreRequestModel.FetchMediaResponse();

  fetchMediaResponse.RequestID = functionContext.requestID;

  if (functionContext.error) {
    fetchMediaResponse.Error = functionContext.error;
    fetchMediaResponse.Details = null;
  } else {
    fetchMediaResponse.Error = null;
    fetchMediaResponse.Details = resolvedResult;
  }

  appLib.SendHttpResponse(functionContext, fetchMediaResponse);

  logger.logInfo(`fetchMediaResponse :: ${JSON.stringify(fetchMediaResponse)}`);

  logger.logInfo(`fetchMediaResponse completed`);
};

var saveMonitorLoginResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`saveMonitorLoginResponse() invoked`);

  var MonitorLoginResponse = new coreRequestModel.MonitorLoginResponse();

  MonitorLoginResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    MonitorLoginResponse.Error = functionContext.error;
    MonitorLoginResponse.Details = null;
  } else {
    MonitorLoginResponse.Error = null;

    MonitorLoginResponse.Details.AuthToken = resolvedResult.Token;
    MonitorLoginResponse.Details.MonitorRef = resolvedResult.MonitorRef;
    MonitorLoginResponse.Details.MonitorName = resolvedResult.MonitorName;
  }
  appLib.SendHttpResponse(functionContext, MonitorLoginResponse);
  logger.logInfo(
    `saveMonitorLoginResponse  Response :: ${JSON.stringify(
      MonitorLoginResponse
    )}`
  );
  logger.logInfo(`saveMonitorLoginResponse completed`);
};

var fetchMonitorDetailsResponse = (
  functionContext,
  resolvedResult,
  orientation
) => {
  var logger = functionContext.logger;

  logger.logInfo(`fetchMonitorDetailsResponse() invoked`);

  var MonitorDetailsResponse = new coreRequestModel.MonitorDetailsResponse();

  MonitorDetailsResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    MonitorDetailsResponse.Error = functionContext.error;
    MonitorDetailsResponse.Details = null;
  } else {
    MonitorDetailsResponse.Error = null;
    MonitorDetailsResponse.Details = {};
    MonitorDetailsResponse.Details.Orientation = orientation;
    // resolvedResult is now an object with playlist + metadata
    MonitorDetailsResponse.Details.MediaList = Array.isArray(resolvedResult.playlist) ? resolvedResult.playlist : [];
    MonitorDetailsResponse.Details.CurrentPlaylistName = resolvedResult.playlistName || 'Default';
    MonitorDetailsResponse.Details.PlaylistType = resolvedResult.playlistType || 'Default';
    MonitorDetailsResponse.Details.ScheduleRef = resolvedResult.scheduleRef || null;
    MonitorDetailsResponse.Details.ScheduleDetails = resolvedResult.scheduleDetails || null;
  }
  appLib.SendHttpResponse(functionContext, MonitorDetailsResponse);
  logger.logInfo(
    `fetchMonitorDetailsResponse  Response :: ${JSON.stringify(
      MonitorDetailsResponse
    )}`
  );
  logger.logInfo(`fetchMonitorDetailsResponse completed`);
};

var processScheduleDetails = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo(`processScheduleDetails() invoked`);

  let finalPlaylist = [];
  let playlistName = null;
  let playlistType = 'Default';
  let scheduleRef = null;
  let scheduleDetailsObj = null;

  const now = moment().utc().tz("Asia/Kolkata");
  const today = now.format('dddd').toLowerCase();
  const currentTime = now.format('HH:mm:ss');

  logger.logInfo(`processScheduleDetails() :: Today: ${today}, Current Time: ${currentTime}`);

  const DAY_NAME_TO_CODE = {
    'sunday': '7','monday': '1','tuesday': '2','wednesday': '3',
    'thursday': '4','friday': '5','saturday': '6'
  };

  // Collect only non-empty result sets
  const resultSets = Array.isArray(resolvedResult) ? resolvedResult.filter(rs => Array.isArray(rs) && rs.length > 0) : [];
  logger.logInfo(`processScheduleDetails() :: total result sets: ${resultSets.length}`);

  // Helper to normalize durations
  const normalizePlaylist = (list) => {
    return (list || []).map(item => {
      let duration;
      if (item.Duration !== undefined && item.Duration !== null) {
        duration = item.Duration;
      } else if (item.MediaType === 'video') {
        duration = null;
      } else {
        duration = 10;
      }
      return {...item, Duration: duration};
    });
  };

  // find default playlist name (from monitor info row if available)
  let defaultPlaylistName = 'Default';
  try {
    const monitorInfo = resolvedResult[0] && resolvedResult[0][0] ? resolvedResult[0][0] : null;
    if (monitorInfo && (monitorInfo.DefaultPlaylistRef || monitorInfo.DefaultPlaylist)) {
      const db = require("../database/database");
      const ref = monitorInfo.DefaultPlaylistRef || monitorInfo.DefaultPlaylist;
      logger.logInfo(`processScheduleDetails() :: Fetching playlist name for ref: ${ref}`);
      let nameResult = await db.knex.raw("SELECT Name FROM playlists WHERE PlaylistRef = ? LIMIT 1", [ref]);
      if (!nameResult || !nameResult[0] || !nameResult[0][0]) {
        nameResult = await db.knex.raw("SELECT Name FROM Playlist WHERE PlaylistRef = ? LIMIT 1", [ref]);
      }
      if (nameResult && nameResult[0] && nameResult[0][0] && nameResult[0][0].Name) {
        defaultPlaylistName = nameResult[0][0].Name;
        logger.logInfo(`processScheduleDetails() :: Found default playlist name: ${defaultPlaylistName}`);
      }
    }
  } catch (e) {
    logger.logInfo(`processScheduleDetails() :: error fetching default playlist name: ${e}`);
  }

  // Identify sets that are playlist arrays vs schedule-detail single-row sets
  // Stored proc pattern: playlist rows, then a schedule-details row (has ScheduleRef), then default playlist (playlist rows)
  for (let idx = 0; idx < resultSets.length; idx++) {
    const set = resultSets[idx];
    // schedule detail row(s) typically include ScheduleRef property
    if (set[0] && set[0].hasOwnProperty("ScheduleRef")) {
      // scheduled playlist should be the previous result-set (if present)
      const scheduledPlaylistSet = (idx - 1) >= 0 ? resultSets[idx - 1] : null;
      const scheduleDetails = set[0];
      logger.logInfo(`processScheduleDetails() :: Found schedule at resultSet index ${idx} scheduleRef=${scheduleDetails.ScheduleRef}`);

      // parse days safely
      let daysArr = [];
      try { daysArr = scheduleDetails.Days ? JSON.parse(scheduleDetails.Days) : []; } catch (e) { logger.logInfo(`Days parse error: ${e}`); }

      const todayCode = DAY_NAME_TO_CODE[today];
      const isScheduledDay = Array.isArray(daysArr) && daysArr.includes(todayCode);
      logger.logInfo(`processScheduleDetails() :: scheduleDays=${JSON.stringify(daysArr)} todayCode=${todayCode} isDay=${isScheduledDay}`);

      // time/date checks
      let isWithinTimeRange = true;
      if (scheduleDetails.StartTime && scheduleDetails.EndTime) {
        const startTime = scheduleDetails.StartTime.substring(0,8);
        const endTime = scheduleDetails.EndTime.substring(0,8);
        isWithinTimeRange = currentTime >= startTime && currentTime <= endTime;
      }
      let isWithinDateRange = true;
      if (scheduleDetails.StartDate && scheduleDetails.EndDate) {
        const currentDate = now.format('YYYY-MM-DD');
        const startDate = moment(scheduleDetails.StartDate).format('YYYY-MM-DD');
        const endDate = moment(scheduleDetails.EndDate).format('YYYY-MM-DD');
        isWithinDateRange = currentDate >= startDate && currentDate <= endDate;
      }

      logger.logInfo(`processScheduleDetails() :: timeRange=${isWithinTimeRange} dateRange=${isWithinDateRange}`);

      if (isScheduledDay && isWithinTimeRange && isWithinDateRange && scheduledPlaylistSet && scheduledPlaylistSet.length) {
        finalPlaylist = normalizePlaylist(scheduledPlaylistSet);
        playlistType = 'Scheduled';
        scheduleRef = scheduleDetails.ScheduleRef;
        scheduleDetailsObj = scheduleDetails;
        playlistName = scheduleDetails.Title || scheduleDetails.PlaylistName || (scheduledPlaylistSet[0] && (scheduledPlaylistSet[0].PlaylistName || scheduledPlaylistSet[0].Name)) || defaultPlaylistName;
        logger.logInfo(`processScheduleDetails() :: Selected scheduled playlistRef=${scheduleRef} items=${finalPlaylist.length} name=${playlistName}`);
        break; // choose first matching schedule (if multiple active, choose the first)
      }
    }
  }

  // if no scheduled match found, fall back to last playlist-like result set
  if (!finalPlaylist.length) {
    // try last resultSet that looks like a playlist (no ScheduleRef and contains MediaName/MediaPath)
    for (let i = resultSets.length - 1; i >= 0; i--) {
      const s = resultSets[i];
      if (s && s.length && !(s[0] && s[0].hasOwnProperty("ScheduleRef"))) {
        finalPlaylist = normalizePlaylist(s);
        playlistType = 'Default';
        playlistName = (s[0] && (s[0].PlaylistName || s[0].Name)) || defaultPlaylistName;
        scheduleRef = null;
        logger.logInfo(`processScheduleDetails() :: Falling back to default playlist items=${finalPlaylist.length} name=${playlistName}`);
        break;
      }
    }
  }

  // ensure final normalization and safe return
  finalPlaylist = Array.isArray(finalPlaylist) ? finalPlaylist : [];
  logger.logInfo(`processScheduleDetails() :: Returning ${finalPlaylist.length} items, name=${playlistName}, type=${playlistType}, scheduleRef=${scheduleRef}`);
  return {
    playlist: finalPlaylist,
    playlistName: playlistName,
    playlistType: playlistType,
    scheduleRef: scheduleRef,
    scheduleDetails: scheduleDetailsObj
  };
};

var getOrientation = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`getOrientation() invoked`);

  return resolvedResult[0][0].Orientation;
};

module.exports.UpdateMonitorStatus = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`UpdateMonitorStatus invoked()!!`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.UPDATEMONITORSTATUS,
    null,
    res,
    logger
  );

  var updateStatusRequest = new coreRequestModel.UpdateMonitorStatusRequest(req);
  logger.logInfo(`UpdateMonitorStatus() :: Request Object : ${JSON.stringify({
    MonitorRef: updateStatusRequest.MonitorRef,
    CurrentPlaylist: updateStatusRequest.CurrentPlaylist,
    TotalMedia: updateStatusRequest.TotalMedia,
    Status: updateStatusRequest.Status
  })}`); 

  var validateRequest = joiValidationModel.updateMonitorStatusRequest(updateStatusRequest);

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `UpdateMonitorStatus() Error:: Invalid Request :: ${JSON.stringify(updateStatusRequest)}`
    );
    updateMonitorStatusResponse(functionContext, null);
    return;
  }

  try {
    // ✅ CRITICAL FIX: Validate data completeness before caching
    const hasValidPlaylist = updateStatusRequest.CurrentPlaylist && 
                            updateStatusRequest.CurrentPlaylist !== 'null' && 
                            updateStatusRequest.CurrentPlaylist !== 'Unknown Playlist';
    const hasValidMedia = updateStatusRequest.TotalMedia > 0;

    // ✅ Only update cache if we have complete, valid data
    if (updateStatusRequest && updateStatusRequest.MonitorRef && hasValidPlaylist && hasValidMedia) {
      const ref = updateStatusRequest.MonitorRef;
      const prev = global.monitorStatusCache[ref] || null;
      
      global.monitorStatusCache[ref] = {
        monitorRef: ref,
        monitorName: updateStatusRequest.MonitorName || (prev && prev.monitorName) || null,
        Status: updateStatusRequest.Status || (prev && prev.Status) || null,
        currentMedia: updateStatusRequest.CurrentMedia || (prev && prev.currentMedia) || null,
        currentPlaylist: updateStatusRequest.CurrentPlaylist || (prev && prev.currentPlaylist) || null,
        playlistType: updateStatusRequest.PlaylistType || (prev && prev.playlistType) || 'Default',
        scheduleRef: updateStatusRequest.ScheduleRef || (prev && prev.scheduleRef) || null,
        mediaIndex: updateStatusRequest.MediaIndex !== undefined ? updateStatusRequest.MediaIndex : (prev && prev.mediaIndex) || 0,
        totalMedia: updateStatusRequest.TotalMedia || (prev && prev.totalMedia) || 0,
        screenState: updateStatusRequest.ScreenState || (prev && prev.screenState) || 'active',
        errors: updateStatusRequest.Errors || (prev && prev.errors) || [],
        healthStatus: updateStatusRequest.HealthStatus || (prev && prev.healthStatus) || 'unknown',
        lastUpdated: new Date(),
        receivedAt: new Date().toISOString()
      };
      
      logger.logInfo(`UpdateMonitorStatus() :: ✅ Cached VALID status for ${ref} - Playlist: ${updateStatusRequest.CurrentPlaylist}, Media: ${updateStatusRequest.TotalMedia}`);
    } else {
      // ✅ Log but DON'T cache incomplete data
      logger.logInfo(`UpdateMonitorStatus() :: ⚠️ REJECTED incomplete data for ${updateStatusRequest.MonitorRef} - Playlist: ${updateStatusRequest.CurrentPlaylist}, Media: ${updateStatusRequest.TotalMedia}`);
    }

    updateMonitorStatusResponse(functionContext, { success: true });
  } catch (errUpdateStatus) {
    if (!errUpdateStatus.ErrorMessage && !errUpdateStatus.ErrorCode) {
      logger.logInfo(`UpdateMonitorStatus() :: Error :: ${errUpdateStatus}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(`UpdateMonitorStatus() :: Error :: ${JSON.stringify(errUpdateStatus)}`);
    updateMonitorStatusResponse(functionContext, null);
  }
};

var updateMonitorStatusResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`updateMonitorStatusResponse() invoked`);

  var UpdateStatusResponse = new coreRequestModel.UpdateMonitorStatusResponse();

  UpdateStatusResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    UpdateStatusResponse.Error = functionContext.error;
    UpdateStatusResponse.Details = null;
  } else {
    UpdateStatusResponse.Error = null;
    UpdateStatusResponse.Details = resolvedResult;
  }

  appLib.SendHttpResponse(functionContext, UpdateStatusResponse);

  logger.logInfo(`updateMonitorStatusResponse :: ${JSON.stringify(UpdateStatusResponse)}`);
  logger.logInfo(`updateMonitorStatusResponse completed`);
};

module.exports.GetMonitorStatus = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);
  logger.logInfo("GetMonitorStatus invoked()!!");

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.GETMONITORSTATUS,
    null,
    res,
    logger
  );

  var getMonitorStatusRequest = new coreRequestModel.GetMonitorStatusRequest(req);
  logger.logInfo(`GetMonitorStatus() :: Request: ${JSON.stringify(getMonitorStatusRequest)}`);

  var validateRequest = joiValidationModel.getMonitorStatusRequest(getMonitorStatusRequest);
  if (validateRequest.error) {
    logger.logInfo(`GetMonitorStatus() :: Validation Error: ${validateRequest.error}`);
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.InvalidDetails,
      constant.ErrorCode.InvalidDetails,
      validateRequest.error
    );
    getMonitorStatusResponse(functionContext, null);
    return;
  }

  try {
    // Get the Socket.IO instance from the app
    const io = req.app.get('io');
    
    // Get cached status from memory (you're already storing this via Socket.IO)
    const monitorStatus = global.monitorStatusCache 
      ? global.monitorStatusCache[getMonitorStatusRequest.MonitorRef] 
      : null;

    logger.logInfo(`GetMonitorStatus() :: Status from cache: ${JSON.stringify(monitorStatus)}`);

    getMonitorStatusResponse(functionContext, monitorStatus);
  } catch (error) {
    logger.logInfo(`GetMonitorStatus() :: Error: ${JSON.stringify(error)}`);
    functionContext.error = new coreRequestModel.ErrorModel(
      'No Internet Connection',  // ✅ CHANGE THIS LINE from constant.ErrorMessage.ApplicationError
      constant.ErrorCode.ApplicationError,
      error
    );
    getMonitorStatusResponse(functionContext, null);
  }
};

var getMonitorStatusResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("getMonitorStatusResponse() invoked");

  const response = new coreRequestModel.GetMonitorStatusResponse();
  response.RequestID = functionContext.requestID;
  
  if (functionContext.error) {
    response.Error = functionContext.error;
    response.Details = null;
  } else if (resolvedResult) {
    // ✅ Use the server time when we received the update, not monitor's timestamp
    const lastUpdate = new Date(resolvedResult.lastUpdated || resolvedResult.receivedAt);
    const now = new Date();
    const secondsSinceUpdate = Math.floor((now - lastUpdate) / 1000);
    
    // ✅ Stricter threshold: 20 seconds (since heartbeat is every 5-10s)
    const isOnline = secondsSinceUpdate <= 20;
    
    // ✅ Additional validation: Check if data is complete
    const hasValidData = resolvedResult.currentPlaylist && 
                        resolvedResult.currentPlaylist !== 'null' && 
                        resolvedResult.totalMedia > 0;
    
    logger.logInfo(`GetMonitorStatus :: Last update: ${lastUpdate}, Now: ${now}, Seconds: ${secondsSinceUpdate}, Online: ${isOnline}, ValidData: ${hasValidData}`);
    
    // ✅ Override status if offline OR data is invalid
    const finalStatus = (isOnline && hasValidData) ? 'online' : 'offline';
    const finalHealthStatus = (isOnline && hasValidData) ? resolvedResult.healthStatus : 'error';
    
    response.Error = null;
    response.Details = {
      MonitorRef: resolvedResult.monitorRef,
      MonitorName: resolvedResult.monitorName,
      Status: finalStatus,
      CurrentMedia: resolvedResult.currentMedia,
      CurrentPlaylist: resolvedResult.currentPlaylist,
      PlaylistType: resolvedResult.playlistType,
      MediaIndex: resolvedResult.mediaIndex,
      TotalMedia: resolvedResult.totalMedia,
      LastUpdate: resolvedResult.receivedAt || lastUpdate.toISOString(),
      SecondsSinceUpdate: secondsSinceUpdate,
      screenState: resolvedResult.screenState,
      errors: !isOnline ? [
        ...(resolvedResult.errors || []),
        {
          type: 'connection_lost',
          message: 'No Internet Connection',
          severity: 'error',
          timestamp: now.toISOString()
        }
      ] : (resolvedResult.errors || []),
      healthStatus: finalHealthStatus
    };
  } else {
    // ✅ No cached data at all = definitely offline
    response.Error = null;
    response.Details = {
      Status: 'offline',
      healthStatus: 'error',
      Message: 'No status data available - Monitor may be offline',
      errors: [{
        type: 'no_data',
        message: 'Monitor has never sent status updates',
        severity: 'error'
      }]
    };
  }

  appLib.SendHttpResponse(functionContext, response);
  logger.logInfo(`getMonitorStatusResponse :: ${JSON.stringify(response)}`);
  logger.logInfo("getMonitorStatusResponse completed");
};
// End of file..