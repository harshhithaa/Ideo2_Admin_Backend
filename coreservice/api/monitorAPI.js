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
    MonitorDetailsResponse.Details.Orientation = orientation;
    MonitorDetailsResponse.Details.MediaList = resolvedResult;
    // MonitorDetailsResponse.Details.ScheduleDetails = resolvedResult[2] ? resolvedResult[2][0] :null;
  }
  appLib.SendHttpResponse(functionContext, MonitorDetailsResponse);
  logger.logInfo(
    `fetchMonitorDetailsResponse  Response :: ${JSON.stringify(
      MonitorDetailsResponse
    )}`
  );
  logger.logInfo(`fetchMonitorDetailsResponse completed`);
};

var processScheduleDetails = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo(`processScheduleDetails() invoked`);

  let finalPlaylist = [];
  
  // Get current day and time
  const now = moment().utc().tz("Asia/Kolkata");
  const today = now.format('dddd').toLowerCase();
  const currentTime = now.format('HH:mm:ss');

  logger.logInfo(`processScheduleDetails() :: Today: ${today}, Current Time: ${currentTime}`);

  // ✅ ADD: Map day names to numeric codes (matching SaveSchedule.jsx)
  const DAY_NAME_TO_CODE = {
    'sunday': '7',
    'monday': '1',
    'tuesday': '2',
    'wednesday': '3',
    'thursday': '4',
    'friday': '5',
    'saturday': '6'
  };

  // Find the schedule details result set
  let scheduleDetails = null;
  let scheduledPlaylist = null;
  let defaultPlaylist = null;

  // Filter out non-array results (like OkPacket)
  const validResults = resolvedResult.filter(
    (item) => Array.isArray(item) && item.length > 0
  );

  logger.logInfo(`processScheduleDetails() :: Valid result sets: ${validResults.length}`);

  // Find result sets by their structure
  for (let i = 0; i < validResults.length; i++) {
    const currentSet = validResults[i];

    // Schedule details result set (has ScheduleRef)
    if (currentSet[0] && currentSet[0].hasOwnProperty("ScheduleRef")) {
      scheduleDetails = currentSet[0];
      logger.logInfo(`processScheduleDetails() :: Found schedule at index ${i}`);
      logger.logInfo(`processScheduleDetails() :: Schedule Details: ${JSON.stringify(scheduleDetails)}`);

      // Scheduled playlist is the previous valid result set
      if (i > 0) {
        scheduledPlaylist = validResults[i - 1];
        logger.logInfo(`processScheduleDetails() :: Scheduled playlist has ${scheduledPlaylist.length} items`);
      }

      // Default playlist is the last valid result set
      defaultPlaylist = validResults[validResults.length - 1];
      logger.logInfo(`processScheduleDetails() :: Default playlist has ${defaultPlaylist.length} items`);
      break;
    }
  }

  // If no schedule found, use the last valid array as default playlist
  if (!defaultPlaylist && validResults.length > 0) {
    defaultPlaylist = validResults[validResults.length - 1];
    logger.logInfo(`processScheduleDetails() :: No schedule found, using last result set with ${defaultPlaylist.length} items`);
  }

  // Decide which playlist to use based on schedule
  if (scheduleDetails && scheduleDetails.Days) {
    let daysArr = [];
    try {
      daysArr = JSON.parse(scheduleDetails.Days);
      logger.logInfo(`processScheduleDetails() :: Schedule days (raw): ${JSON.stringify(daysArr)}`);
    } catch (e) {
      logger.logInfo(`processScheduleDetails() :: Days parse error ${e}`);
    }

    // ✅ FIX: Convert current day name to numeric code for comparison
    const todayCode = DAY_NAME_TO_CODE[today];
    logger.logInfo(`processScheduleDetails() :: Today code: ${todayCode}`);

    // ✅ Check if today's numeric code is in the schedule's day array
    const isScheduledDay = Array.isArray(daysArr) && daysArr.includes(todayCode);
    
    let isWithinTimeRange = false;
    if (scheduleDetails.StartTime && scheduleDetails.EndTime) {
      const startTime = scheduleDetails.StartTime.substring(0, 8); // HH:mm:ss
      const endTime = scheduleDetails.EndTime.substring(0, 8);
      
      logger.logInfo(`processScheduleDetails() :: Schedule Time Range: ${startTime} - ${endTime}`);
      
      // Check if current time is within the schedule range
      isWithinTimeRange = currentTime >= startTime && currentTime <= endTime;
      logger.logInfo(`processScheduleDetails() :: Is within time range: ${isWithinTimeRange}`);
    }

    // ✅ Also check date range
    let isWithinDateRange = true;
    if (scheduleDetails.StartDate && scheduleDetails.EndDate) {
      const currentDate = now.format('YYYY-MM-DD');
      const startDate = moment(scheduleDetails.StartDate).format('YYYY-MM-DD');
      const endDate = moment(scheduleDetails.EndDate).format('YYYY-MM-DD');
      
      logger.logInfo(`processScheduleDetails() :: Schedule Date Range: ${startDate} - ${endDate}`);
      
      isWithinDateRange = currentDate >= startDate && currentDate <= endDate;
      logger.logInfo(`processScheduleDetails() :: Is within date range: ${isWithinDateRange}`);
    }

    // Use scheduled playlist only if all conditions are met
    if (isScheduledDay && isWithinTimeRange && isWithinDateRange) {
      finalPlaylist = scheduledPlaylist || defaultPlaylist || [];
      logger.logInfo(`processScheduleDetails() :: ✅ Using scheduled playlist (${finalPlaylist.length} items)`);
    } else {
      finalPlaylist = defaultPlaylist || [];
      logger.logInfo(`processScheduleDetails() :: Using default playlist (${finalPlaylist.length} items) - Conditions not met: Day=${isScheduledDay}, Time=${isWithinTimeRange}, Date=${isWithinDateRange}`);
    }
  } else {
    finalPlaylist = defaultPlaylist || [];
    logger.logInfo(`processScheduleDetails() :: No schedule, using default playlist (${finalPlaylist.length} items)`);
  }

  // Ensure finalPlaylist is always an array
  if (!Array.isArray(finalPlaylist)) {
    logger.logInfo(`processScheduleDetails() :: finalPlaylist is not an array, converting: ${JSON.stringify(finalPlaylist)}`);
    finalPlaylist = [];
  }

  // Normalize Duration
  try {
    finalPlaylist = finalPlaylist.map((item) => {
      let duration;
      if (item.Duration !== undefined && item.Duration !== null) {
        duration = item.Duration;
      } else if (item.MediaDuration !== undefined && item.MediaDuration !== null) {
        duration = item.MediaDuration;
      } else {
        duration = item.MediaType === "video" ? null : 10;
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

  logger.logInfo(`processScheduleDetails() :: Returning ${finalPlaylist.length} items`);
  return finalPlaylist;
};

var getOrientation = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`getOrientation() invoked`);

  return resolvedResult[0][0].Orientation;
};

// slideTime is no longer returned by the backend; per-media Duration is used instead
