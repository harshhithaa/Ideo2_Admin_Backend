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

  // Get current day and time
  const now = moment().utc().tz("Asia/Kolkata");
  const today = now.format('dddd').toLowerCase();
  const currentTime = now.format('HH:mm:ss');

  logger.logInfo(`processScheduleDetails() :: Today: ${today}, Current Time: ${currentTime}`);

  const DAY_NAME_TO_CODE = {
    'sunday': '7',
    'monday': '1',
    'tuesday': '2',
    'wednesday': '3',
    'thursday': '4',
    'friday': '5',
    'saturday': '6'
  };

  let scheduleDetails = null;
  let scheduledPlaylist = null;
  let defaultPlaylist = null;

  const validResults = resolvedResult.filter(
    (item) => Array.isArray(item) && item.length > 0
  );

  logger.logInfo(`processScheduleDetails() :: Valid result sets: ${validResults.length}`);

  for (let i = 0; i < validResults.length; i++) {
    const currentSet = validResults[i];

    if (currentSet[0] && currentSet[0].hasOwnProperty("ScheduleRef")) {
      scheduleDetails = currentSet[0];
      scheduleDetailsObj = scheduleDetails;
      logger.logInfo(`processScheduleDetails() :: Found schedule at index ${i}`);
      logger.logInfo(`processScheduleDetails() :: Schedule Details: ${JSON.stringify(scheduleDetails)}`);

      if (i > 0) {
        scheduledPlaylist = validResults[i - 1];
      }

      defaultPlaylist = validResults[validResults.length - 1];
      scheduleRef = scheduleDetails.ScheduleRef || scheduleDetails.ScheduleRef;
      logger.logInfo(`processScheduleDetails() :: Default playlist has ${defaultPlaylist.length} items`);
      break;
    }
  }

  if (!defaultPlaylist && validResults.length > 0) {
    defaultPlaylist = validResults[validResults.length - 1];
    logger.logInfo(`processScheduleDetails() :: No schedule found, using last result set with ${defaultPlaylist.length} items`);
  }

  // ✅ FIXED: Fetch default playlist name using PlaylistRef (varchar UUID)
  let defaultPlaylistName = 'Default';
  try {
    const monitorInfo = resolvedResult[0] && resolvedResult[0][0] ? resolvedResult[0][0] : null;
    if (monitorInfo && (monitorInfo.DefaultPlaylistRef || monitorInfo.DefaultPlaylist)) {
      const db = require("../database/database");
      const ref = monitorInfo.DefaultPlaylistRef || monitorInfo.DefaultPlaylist;
      logger.logInfo(`processScheduleDetails() :: Fetching playlist for PlaylistRef: ${ref}`);

      // Query by PlaylistRef (varchar UUID) — use exact table/column present in your schema
      let nameResult = await db.knex.raw("SELECT Name FROM playlists WHERE PlaylistRef = ? LIMIT 1", [ref]);
      if (!nameResult || !nameResult[0] || !nameResult[0][0]) {
        // fallback table name variation (case/tablename differences)
        nameResult = await db.knex.raw("SELECT Name FROM Playlist WHERE PlaylistRef = ? LIMIT 1", [ref]);
      }
      if (nameResult && nameResult[0] && nameResult[0][0] && nameResult[0][0].Name) {
        defaultPlaylistName = nameResult[0][0].Name;
        logger.logInfo(`processScheduleDetails() :: ✅ Found playlist: ${defaultPlaylistName}`);
      } else {
        logger.logInfo(`processScheduleDetails() :: ⚠️ No playlist found for PlaylistRef: ${ref} - result: ${JSON.stringify(nameResult)}`);
      }
    } else {
      logger.logInfo(`processScheduleDetails() :: No DefaultPlaylistRef found in monitor info`);
    }
  } catch (errFetchName) {
    logger.logInfo(`processScheduleDetails() :: Error while fetching playlist name: ${errFetchName}`);
  }

  // Decide playlist selection with same logic
  if (scheduleDetails && scheduleDetails.Days) {
    let daysArr = [];
    try {
      daysArr = JSON.parse(scheduleDetails.Days);
      logger.logInfo(`processScheduleDetails() :: Schedule days (raw): ${JSON.stringify(daysArr)}`);
    } catch (e) {
      logger.logInfo(`processScheduleDetails() :: Days parse error ${e}`);
    }

    const todayCode = DAY_NAME_TO_CODE[today];
    logger.logInfo(`processScheduleDetails() :: Today code: ${todayCode}`);

    const isScheduledDay = Array.isArray(daysArr) && daysArr.includes(todayCode);

    let isWithinTimeRange = false;
    if (scheduleDetails.StartTime && scheduleDetails.EndTime) {
      const startTime = scheduleDetails.StartTime.substring(0, 8); // HH:mm:ss
      const endTime = scheduleDetails.EndTime.substring(0, 8);
      logger.logInfo(`processScheduleDetails() :: Schedule Time Range: ${startTime} - ${endTime}`);
      isWithinTimeRange = currentTime >= startTime && currentTime <= endTime;
      logger.logInfo(`processScheduleDetails() :: Is within time range: ${isWithinTimeRange}`);
    }

    let isWithinDateRange = true;
    if (scheduleDetails.StartDate && scheduleDetails.EndDate) {
      const currentDate = now.format('YYYY-MM-DD');
      const startDate = moment(scheduleDetails.StartDate).format('YYYY-MM-DD');
      const endDate = moment(scheduleDetails.EndDate).format('YYYY-MM-DD');
      logger.logInfo(`processScheduleDetails() :: Schedule Date Range: ${startDate} - ${endDate}`);
      isWithinDateRange = currentDate >= startDate && currentDate <= endDate;
      logger.logInfo(`processScheduleDetails() :: Is within date range: ${isWithinDateRange}`);
    }

    if (isScheduledDay && isWithinTimeRange && isWithinDateRange) {
      if (scheduledPlaylist && scheduledPlaylist.length) {
        finalPlaylist = scheduledPlaylist;
        playlistType = 'Scheduled';
        scheduleRef = scheduleDetails?.ScheduleRef || scheduleRef;
        // determine name from schedule or scheduledPlaylist metadata
        if (scheduleDetails && (scheduleDetails.Title || scheduleDetails.PlaylistName)) {
          playlistName = scheduleDetails.Title || scheduleDetails.PlaylistName;
        } else if (scheduledPlaylist[0] && (scheduledPlaylist[0].PlaylistName || scheduledPlaylist[0].Name)) {
          playlistName = scheduledPlaylist[0].PlaylistName || scheduledPlaylist[0].Name;
        } else {
          playlistName = 'Scheduled';
        }
        logger.logInfo(`processScheduleDetails() :: ✅ Using scheduled playlist (${finalPlaylist.length} items) name=${playlistName}`);
      } else {
        // scheduled playlist empty — fall back to default and use DB name if available
        finalPlaylist = defaultPlaylist || [];
        playlistType = 'Default';
        scheduleRef = null;
        if (defaultPlaylist && defaultPlaylist[0] && (defaultPlaylist[0].PlaylistName || defaultPlaylist[0].Name)) {
          playlistName = defaultPlaylist[0].PlaylistName || defaultPlaylist[0].Name;
        } else {
          playlistName = defaultPlaylistName;
        }
        logger.logInfo(`processScheduleDetails() :: Scheduled playlist empty — falling back to default (${finalPlaylist.length} items) name=${playlistName}`);
      }
    } else {
      finalPlaylist = defaultPlaylist || [];
      playlistType = 'Default';
      if (defaultPlaylist && defaultPlaylist[0] && (defaultPlaylist[0].PlaylistName || defaultPlaylist[0].Name)) {
        playlistName = defaultPlaylist[0].PlaylistName || defaultPlaylist[0].Name;
      } else {
        playlistName = defaultPlaylistName;
      }
      scheduleRef = null;
      logger.logInfo(`processScheduleDetails() :: Using default playlist (${finalPlaylist.length} items) name=${playlistName}`);
    }
  } else {
    finalPlaylist = defaultPlaylist || [];
    playlistType = 'Default';
    if (defaultPlaylist && defaultPlaylist[0] && (defaultPlaylist[0].PlaylistName || defaultPlaylist[0].Name)) {
      playlistName = defaultPlaylist[0].PlaylistName || defaultPlaylist[0].Name;
    } else {
      playlistName = defaultPlaylistName;
    }
    scheduleRef = null;
    logger.logInfo(`processScheduleDetails() :: No schedule, using default playlist (${finalPlaylist.length} items) name=${playlistName}`);
  }

  // Normalize Duration (existing logic)
  try {
    finalPlaylist = finalPlaylist.map((item) => {
      let duration;
      if (item.Duration !== undefined && item.Duration !== null) {
        duration = item.Duration;
      } else if (item.MediaType === 'video') {
        duration = null;
      } else {
        duration = 10;
      }
      return {
        ...item,
        Duration: duration,
      };
    });

    logger.logInfo(`processScheduleDetails() :: Normalized ${finalPlaylist.length} items`);
  } catch (e) {
    logger.logInfo(`processScheduleDetails() :: normalization error ${e}`);
    finalPlaylist = [];
  }

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
  logger.logInfo(`UpdateMonitorStatus() :: Request Object : ${JSON.stringify(updateStatusRequest)}`);

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
    // Store status in cache/database with timestamp
    await databaseHelper.updateMonitorStatus(
      functionContext,
      updateStatusRequest
    );

    logger.logInfo(`UpdateMonitorStatus() :: Status updated for monitor: ${updateStatusRequest.MonitorRef}`);
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
      constant.ErrorMessage.ApplicationError,
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
    
    // ✅ Keep 30 second threshold - if monitor sends updates every 10s, this is reasonable
    const isOnline = secondsSinceUpdate <= 30;
    
    logger.logInfo(`GetMonitorStatus :: Last update: ${lastUpdate}, Now: ${now}, Seconds: ${secondsSinceUpdate}, Online: ${isOnline}`);
    
    response.Error = null;
    response.Details = {
      MonitorRef: resolvedResult.monitorRef,
      MonitorName: resolvedResult.monitorName,
      Status: isOnline ? 'online' : 'offline',
      CurrentMedia: resolvedResult.currentMedia,
      CurrentPlaylist: resolvedResult.currentPlaylist,
      PlaylistType: resolvedResult.playlistType,
      MediaIndex: resolvedResult.mediaIndex,
      TotalMedia: resolvedResult.totalMedia,
      LastUpdate: resolvedResult.receivedAt || lastUpdate.toISOString(),
      SecondsSinceUpdate: secondsSinceUpdate,
      screenState: resolvedResult.screenState,
      errors: resolvedResult.errors,
      healthStatus: resolvedResult.healthStatus
    };
  } else {
    response.Error = null;
    response.Details = {
      Status: 'unknown',
      Message: 'No status data available'
    };
  }

  appLib.SendHttpResponse(functionContext, response);
  logger.logInfo(`getMonitorStatusResponse :: ${JSON.stringify(response)}`);
  logger.logInfo("getMonitorStatusResponse completed");
};
// End of file