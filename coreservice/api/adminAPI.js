var databaseHelper = require("../helper/databasehelper");
var coreRequestModel = require("../models/coreServiceModel");
var constant = require("../common/constant");
var requestType = constant.RequestType;
var appLib = require("applib");
var bcrypt = require("bcryptjs");
var settings = require("../common/settings").Settings;
var joiValidationModel = require("../models/validationModel");
var FTPSettings = require("../common/settings").FTPSettings;
var fileConfiguration = require("../common/settings").FileConfiguration;
var ftp = require("basic-ftp");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
var ffmpeg = require("fluent-ffmpeg");
var fs = require("fs");

module.exports.SaveSystemUser = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`SaveSystemUser invoked()!!`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.SAVESYSTEMUSER,
    null,
    res,
    logger
  );

  var saveSystemUserRequest = new coreRequestModel.SaveSystemUserRequest(req);

  logger.logInfo(
    `saveSystemUser() :: Request Object : ${saveSystemUserRequest}`
  );

  var validateRequest = joiValidationModel.saveSystemUserRequest(
    saveSystemUserRequest
  );

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `saveSystemUser() Error:: Invalid Request :: ${JSON.stringify(
        saveSystemUserRequest
      )}`
    );
    saveSystemUserResponse(functionContext, null);
    return;
  }

  var requestContext = {
    ...saveSystemUserRequest,
    passwordHash: null,
  };

  try {
    var encryptPasswordResult = await encryptPassword(
      functionContext,
      requestContext
    );
    let saveSystemUserDBResult = await databaseHelper.saveSystemUserDB(
      functionContext,
      requestContext
    );
    saveSystemUserResponse(functionContext, saveSystemUserDBResult);
  } catch (errSaveSystemUser) {
    if (!errSaveSystemUser.ErrorMessage && !errSaveSystemUser.ErrorCode) {
      logger.logInfo(`SaveSystemUser() :: Error :: ${errSaveSystemUser}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `saveSystemUser() :: Error :: ${JSON.stringify(errSaveSystemUser)}`
    );
    saveSystemUserResponse(functionContext, null);
  }
};

module.exports.SaveMedia = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`SaveMedia invoked()!!`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.SAVEMEDIA,
    null,
    res,
    logger
  );

  var requestContext = {
    fileUploadDetails: [],
    userRef: functionContext.userRef,
    file: {
      fileName: null,
      fileMimetype: null,
      srcPath: null,
      destPath: null,
      fileUrl: null,
    },
    serverUploadDetails: [],
  };

  try {
    var processMediaResponse = await processMedia(
      functionContext,
      req,
      requestContext
    );
    var saveMediaInDBResponse = await databaseHelper.saveMediaDB(
      functionContext,
      requestContext
    );
    saveMediaResponse(functionContext, requestContext);
  } catch (errSaveMedia) {
    if (!errSaveMedia.ErrorMessage && !errSaveMedia.ErrorCode) {
      logger.logInfo(`SaveMedia() :: Error :: ${errSaveMedia}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    } else {
      logger.logInfo(`SaveMedia() :: Error :: ${errSaveMedia}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        errSaveMedia.ErrorMessage,
        errSaveMedia.ErrorCode,
        errSaveMedia.ErrorDescription
      );
    }
    logger.logInfo(`SaveMedia() :: Error :: ${JSON.stringify(errSaveMedia)}`);
    saveMediaResponse(functionContext, null);
  }
};

module.exports.SavePlaylist = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`SavePlaylist invoked()!!`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.SAVEPLAYLIST,
    null,
    res,
    logger
  );

  var savePlaylistRequest = new coreRequestModel.SavePlaylistRequest(req);

  logger.logInfo(`savePlaylist() :: Request Object : ${savePlaylistRequest}`);

  var validateRequest =
    joiValidationModel.savePlaylistRequest(savePlaylistRequest);

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `savePlaylists() Error:: Invalid Request :: ${JSON.stringify(
        savePlaylistRequest
      )}`
    );
    savePlaylistResponse(functionContext, null);
    return;
  }

  var requestContext = {
    ...savePlaylistRequest,
    userRef: functionContext.userRef,
  };

  try {
    var savePlaylistInDBResponse = await databaseHelper.savePlaylistDB(
      functionContext,
      requestContext
    );
    savePlaylistResponse(functionContext, savePlaylistInDBResponse);
  } catch (errSavePlaylist) {
    if (!errSavePlaylist.ErrorMessage && !errSavePlaylist.ErrorCode) {
      logger.logInfo(`SavePlaylist() :: Error :: ${errSavePlaylist}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    } else {
      logger.logInfo(`SavePlaylist() :: Error :: ${errSavePlaylist}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        errSavePlaylist.ErrorMessage,
        errSavePlaylist.ErrorCode,
        errSavePlaylist.ErrorDescription
      );
    }
    logger.logInfo(
      `SavePlaylist() :: Error :: ${JSON.stringify(errSavePlaylist)}`
    );
    savePlaylistResponse(functionContext, null);
  }
};

module.exports.SaveSchedule = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`SaveSchedule invoked()!!`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.SAVESCHEDULE,
    null,
    res,
    logger
  );

  var saveScheduleRequest = new coreRequestModel.SaveScheduleRequest(req);

  logger.logInfo(`saveSchedule() :: Request Object : ${saveScheduleRequest}`);

  var validateRequest =
    joiValidationModel.saveScheduleRequest(saveScheduleRequest);

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `saveSchedules() Error:: Invalid Request :: ${JSON.stringify(
        saveScheduleRequest
      )}`
    );
    saveScheduleResponse(functionContext, null);
    return;
  }

  var requestContext = {
    userRef: functionContext.userRef,
    ...saveScheduleRequest,
  };

  try {
    var saveScheduleInDBResponse = await databaseHelper.saveScheduleDB(
      functionContext,
      requestContext
    );
    saveScheduleResponse(functionContext, saveScheduleInDBResponse);
  } catch (errSaveSchedule) {
    if (!errSaveSchedule.ErrorMessage && !errSaveSchedule.ErrorCode) {
      logger.logInfo(`SaveSchedule() :: Error :: ${errSaveSchedule}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    } else {
      logger.logInfo(`SaveSchedule() :: Error :: ${errSaveSchedule}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        errSaveSchedule.ErrorMessage,
        errSaveSchedule.ErrorCode,
        errSaveSchedule.ErrorDescription
      );
    }
    logger.logInfo(
      `SaveSchedule() :: Error :: ${JSON.stringify(errSaveSchedule)}`
    );
    saveScheduleResponse(functionContext, null);
  }
};

module.exports.SaveMonitor = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`SaveMonitor invoked()!!`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.SAVEMONITOR,
    null,
    res,
    logger
  );

  var saveMonitorRequest = new coreRequestModel.SaveMonitorRequest(req);

  logger.logInfo(`saveMonitor() :: Request Object : ${saveMonitorRequest}`);

  var validateRequest =
    joiValidationModel.saveMonitorRequest(saveMonitorRequest);

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `saveMonitors() Error:: Invalid Request :: ${JSON.stringify(
        saveMonitorRequest
      )}`
    );
    saveMonitorResponse(functionContext, null);
    return;
  }

  var requestContext = {
    userRef: functionContext.userRef,
    ...saveMonitorRequest,
  };

  try {
    var saveMonitorInDBResponse = await databaseHelper.saveMonitorDB(
      functionContext,
      requestContext
    );
    saveMonitorResponse(functionContext, saveMonitorInDBResponse);
  } catch (errSaveMonitor) {
    if (!errSaveMonitor.ErrorMessage && !errSaveMonitor.ErrorCode) {
      logger.logInfo(`SaveMonitor() :: Error :: ${errSaveMonitor}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    } else {
      logger.logInfo(`SaveMonitor() :: Error :: ${errSaveMonitor}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        errSaveMonitor.ErrorMessage,
        errSaveMonitor.ErrorCode,
        errSaveMonitor.ErrorDescription
      );
    }
    logger.logInfo(
      `SaveMonitor() :: Error :: ${JSON.stringify(errSaveMonitor)}`
    );
    saveMonitorResponse(functionContext, null);
  }
};

module.exports.GetAdminComponents = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`GetAdminComponents()`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.GETADMINCOMPONENTS,
    null,
    res,
    logger
  );

  var getAdminComponentsRequest = new coreRequestModel.GetAdminComponentRequest(
    req
  );

  logger.logInfo(
    `GetAdminComponents() :: Request Object : ${getAdminComponentsRequest}`
  );

  var validateRequest = joiValidationModel.getAdminCompenentRequest(
    getAdminComponentsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `GetAdminComponents() Error:: Invalid Request :: ${JSON.stringify(
        getAdminComponentsRequest
      )}`
    );
    getAdminComponentsResponse(functionContext, null);
    return;
  }

  try {
    var adminComponentsResult = await databaseHelper.getAdminComponentListInDB(
      functionContext,
      getAdminComponentsRequest
    );

    var processComponentListDataResult = await processComponentListData(
      functionContext,
      getAdminComponentsRequest,
      adminComponentsResult
    );

    await getAdminComponentsResponse(
      functionContext,
      processComponentListDataResult
    );
  } catch (errGetAdminComponents) {
    if (
      !errGetAdminComponents.ErrorMessage &&
      !errGetAdminComponents.ErrorCode
    ) {
      logger.logInfo(
        `getAdminComponentsResponse() :: Error :: ${errGetAdminComponents}`
      );
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errGetAdminComponents)
      );
    }
    logger.logInfo(
      `GetAdminComponents() :: Error :: ${JSON.stringify(
        errGetAdminComponents
      )}`
    );
    getAdminComponentsResponse(functionContext, null);
  }
};

module.exports.GetAdminComponentsDetails = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`GetAdminComponentsDetails()`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.GETADMINCOMPONENTSDETAILS,
    null,
    res,
    logger
  );

  var getAdminComponentsDetailsRequest =
    new coreRequestModel.GetAdminComponentDetailsRequest(req);

  logger.logInfo(
    `GetAdminComponentsDetails() :: Request Object : ${getAdminComponentsDetailsRequest}`
  );

  var validateRequest = joiValidationModel.getAdminComponentDetailsRequest(
    getAdminComponentsDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `GetAdminComponentsDetails() Error:: Invalid Request :: ${JSON.stringify(
        getAdminComponentsDetailsRequest
      )}`
    );
    getAdminComponentsDetailsResponse(functionContext, null);
    return;
  }

  try {
    var adminComponentsDetailsResult =
      await databaseHelper.getAdminComponentDetailsInDB(
        functionContext,
        getAdminComponentsDetailsRequest
      );

    var processComponentDetailsDataResult = await processComponentDetailsData(
      functionContext,
      adminComponentsDetailsResult,
      getAdminComponentsDetailsRequest
    );

    await getAdminComponentsDetailsResponse(
      functionContext,
      processComponentDetailsDataResult
    );
  } catch (errGetAdminComponents) {
    if (
      !errGetAdminComponents.ErrorMessage &&
      !errGetAdminComponents.ErrorCode
    ) {
      logger.logInfo(`errPlaceDelivery() :: Error :: ${errGetAdminComponents}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errGetAdminComponents)
      );
    }
    logger.logInfo(
      `GetAdminComponents() :: Error :: ${JSON.stringify(
        errGetAdminComponents
      )}`
    );
    getAdminComponentsResponse(functionContext, null);
  }
};

module.exports.ValidateDeleteAdminComponents = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`DeleteAdminComponents()`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.VALIDATEDELETEADMINCOMPONENTS,
    null,
    res,
    logger
  );

  var deleteAdminComponentsRequest =
    new coreRequestModel.DeleteAdminComponentsRequest(req);

  logger.logInfo(
    `DeleteAdminComponents() :: Request Object : ${deleteAdminComponentsRequest}`
  );

  var validateRequest = joiValidationModel.deleteAdminCompenentRequest(
    deleteAdminComponentsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `DeleteAdminComponents() Error:: Invalid Request :: ${JSON.stringify(
        deleteAdminComponentsRequest
      )}`
    );
    validateDeleteAdminComponentsResponse(functionContext, null);
    return;
  }

  try {
    var validateDeleteAdminComponentListInDB =
      await databaseHelper.ValidateDeleteAdminComponentListInDB(
        functionContext,
        deleteAdminComponentsRequest
      );

    await validateDeleteAdminComponentsResponse(
      functionContext,
      validateDeleteAdminComponentListInDB
    );
  } catch (errDeleteAdminComponenets) {
    if (
      !errDeleteAdminComponenets.ErrorMessage &&
      !errDeleteAdminComponenets.ErrorCode
    ) {
      logger.logInfo(
        `errPlaceDelivery() :: Error :: ${errDeleteAdminComponenets}`
      );
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errDeleteAdminComponenets)
      );
    }
    logger.logInfo(
      `DeleteAdminComponents() :: Error :: ${JSON.stringify(
        errDeleteAdminComponenets
      )}`
    );
    validateDeleteAdminComponentsResponse(functionContext, null);
  }
};

module.exports.DeleteAdminComponents = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`DeleteAdminComponents()`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.DELETEADMINCOMPONENTS,
    null,
    res,
    logger
  );

  var deleteAdminComponentsRequest =
    new coreRequestModel.DeleteAdminComponentsRequest(req);

  logger.logInfo(
    `DeleteAdminComponents() :: Request Object : ${deleteAdminComponentsRequest}`
  );

  var validateRequest = joiValidationModel.deleteAdminCompenentRequest(
    deleteAdminComponentsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `DeleteAdminComponents() Error:: Invalid Request :: ${JSON.stringify(
        deleteAdminComponentsRequest
      )}`
    );
    deleteAdminComponentsResponse(functionContext, null);
    return;
  }

  try {
    var deleteAdminComponentsResult =
      await databaseHelper.deleteAdminComponentListInDB(
        functionContext,
        deleteAdminComponentsRequest
      );

    await deleteAdminComponentsResponse(
      functionContext,
      deleteAdminComponentsResult
    );
  } catch (errDeleteAdminComponenets) {
    if (
      !errDeleteAdminComponenets.ErrorMessage &&
      !errDeleteAdminComponenets.ErrorCode
    ) {
      logger.logInfo(
        `deleteAdminComponentsResponse() :: Error :: ${errDeleteAdminComponenets}`
      );
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errDeleteAdminComponenets)
      );
    }
    logger.logInfo(
      `DeleteAdminComponents() :: Error :: ${JSON.stringify(
        errDeleteAdminComponenets
      )}`
    );
    deleteAdminComponentsResponse(functionContext, null);
  }
};

var saveSystemUserResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`saveSystemUserResponse() invoked`);

  var saveSystemUserResponse = new coreRequestModel.SaveSystemUserResponse();

  saveSystemUserResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    saveSystemUserResponse.Error = functionContext.error;
    saveSystemUserResponse.Details = null;
  } else {
    saveSystemUserResponse.Error = null;
    saveSystemUserResponse.Details.AdminRef = resolvedResult.AdminRef;
    saveSystemUserResponse.Details.UserName = resolvedResult.UserName;
    saveSystemUserResponse.Details.Email = resolvedResult.Email;
    saveSystemUserResponse.Details.Phone = resolvedResult.Phone;
  }
  appLib.SendHttpResponse(functionContext, saveSystemUserResponse);
  logger.logInfo(
    `saveSystemUserResponse  Response :: ${JSON.stringify(
      saveSystemUserResponse
    )}`
  );
  logger.logInfo(`saveSystemUserResponse completed`);
};

var encryptPassword = async (functionContext, requestContext) => {
  var logger = functionContext.logger;

  logger.logInfo(`encryptPassword() Invoked!`);

  const hash = await bcrypt.hashSync(
    `${requestContext.password}`,
    parseInt(settings.PAGR_SALT)
  );
  requestContext.passwordHash = hash;

  return;
};

var processMedia = async (functionContext, req, requestContext) => {
  var logger = functionContext.logger;

  logger.logInfo(`processMedia() invoked`);

  var canUploadFile = true;
  if (canUploadFile) {
    if (req.hasOwnProperty("files")) {
      for (let count = 0; count < req.files.length; count++) {
        var file = req.files[count];
        console.log(file);
        logger.logInfo(
          `Media Files() invoked ${JSON.stringify(req.files[count])}`
        );
        if (file.mimetype === "video/mp4") {
          await processVideo(file);
        }
        if (
          file.hasOwnProperty("filename") ||
          file.hasOwnProperty("fileName")
        ) {
          if (file.filename) {
            if (file.mimetype === "video/mp4") {
              console.log("file path", `./uploads/${file.filename}`);
              fs.unlink(`./uploads/${file.filename}`, () => {
                console.log("File Removed");
              });
              requestContext.file.fileName = file.originalname
                ? file.originalname
                : file.originalname;
              requestContext.file.fileMimetype = file.mimetype;
              requestContext.file.srcPath =
                fileConfiguration.LocalStorage + file.originalname;
              requestContext.file.destPath =
                fileConfiguration.RemoteStorage +
                new Date().toDateString() +
                file.originalname;
              requestContext.file.fileUrl =
                fileConfiguration.FileUrl +
                new Date().toDateString() +
                file.originalname;
            } else {
              requestContext.file.fileName = file.originalname
                ? file.originalname
                : file.originalname;
              requestContext.file.fileMimetype = file.mimetype;
              requestContext.file.srcPath =
                fileConfiguration.LocalStorage + file.filename;
              requestContext.file.destPath =
                fileConfiguration.RemoteStorage + file.filename;
              requestContext.file.fileUrl =
                fileConfiguration.FileUrl + file.filename;
            }
          }
        }
        requestContext.serverUploadDetails.push({
          srcPath: requestContext.file.srcPath,
          destPath: requestContext.file.destPath,
        });
        requestContext.fileUploadDetails.push({
          fileName: requestContext.file.fileName,
          fileMimetype: file.mimetype.split("/")[0],
          fileUrl: requestContext.file.fileUrl,
        });
      }
      var uploadFile = await fileUpload(
        functionContext,
        requestContext.serverUploadDetails
      );
    }
  }

  return;
};
var saveMediaResponse = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`saveMediaResponse() invoked`);

  var saveMediaResponse = new coreRequestModel.SaveMediaResponse();

  saveMediaResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    saveMediaResponse.Error = functionContext.error;
    saveMediaResponse.Details = null;
  } else {
    saveMediaResponse.Error = null;
    saveMediaResponse.Details.Media = resolvedResult.fileUploadDetails;
  }
  appLib.SendHttpResponse(functionContext, saveMediaResponse);

  logger.logInfo(
    `saveMediaResponse  Response :: ${JSON.stringify(saveMediaResponse)}`
  );
  logger.logInfo(`saveMediaResponse completed`);
};

async function fileUpload(functionContext, fileDetails) {
  var logger = functionContext.logger;

  logger.logInfo(`fileUpload() Invoked()`);

  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access(FTPSettings);
    for (let file = 0; file < fileDetails.length; file++) {
      const element = fileDetails[file];
      await client.uploadFrom(element.srcPath, element.destPath);
    }
  } catch (errFileUpload) {
    logger.logInfo(`fileUpload() :: Error :: ${JSON.stringify(errFileUpload)}`);
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,

      constant.ErrorCode.ApplicationError
    );
    throw functionContext.error;
  }
  client.close();

  return;
}

var getAdminComponentsResponse = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`getAdminComponentsResponse() invoked`);

  var getAdminComponentsResponse =
    new coreRequestModel.GetAdminComponentResponse();

  getAdminComponentsResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    getAdminComponentsResponse.Error = functionContext.error;
    getAdminComponentsResponse.Details = null;
  } else {
    getAdminComponentsResponse.Error = null;
    getAdminComponentsResponse.Details.ComponentList =
      resolvedResult.ComponentList;
  }
  appLib.SendHttpResponse(functionContext, getAdminComponentsResponse);

  logger.logInfo(
    `getAdminComponentsResponse  Response :: ${JSON.stringify(
      getAdminComponentsResponse
    )}`
  );
  logger.logInfo(`getAdminComponentsResponse completed`);
};

var deleteAdminComponentsResponse = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`deleteAdminComponentsResponse() invoked`);

  var deleteAdminComponentsResponse =
    new coreRequestModel.DeleteAdminComponentsResponse();

  deleteAdminComponentsResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    deleteAdminComponentsResponse.Error = functionContext.error;
    deleteAdminComponentsResponse.Details = null;
  } else {
    deleteAdminComponentsResponse.Error = null;
    deleteAdminComponentsResponse.Details.IsDeleted = true;
  }
  appLib.SendHttpResponse(functionContext, deleteAdminComponentsResponse);

  logger.logInfo(
    `deleteAdminComponentsResponse  Response :: ${JSON.stringify(
      deleteAdminComponentsResponse
    )}`
  );
  logger.logInfo(`deleteAdminComponentsResponse completed`);
};

var validateDeleteAdminComponentsResponse = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;

  logger.logInfo(`validateDeleteAdminComponentsResponse() invoked`);

  var validateDeleteAdminComponentsResponse =
    new coreRequestModel.ValidateDeleteAdminComponentsResponse();

  validateDeleteAdminComponentsResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    validateDeleteAdminComponentsResponse.Error = functionContext.error;
    validateDeleteAdminComponentsResponse.Details = null;
  } else {
    validateDeleteAdminComponentsResponse.Error = null;

    if (resolvedResult.length > 0) {
      validateDeleteAdminComponentsResponse.Details.ActiveComponents =
        resolvedResult;
      validateDeleteAdminComponentsResponse.Details.IsComponentDeletable = false;
    } else {
      validateDeleteAdminComponentsResponse.Details.ActiveComponents = [];
      validateDeleteAdminComponentsResponse.Details.IsComponentDeletable = true;
    }
  }
  appLib.SendHttpResponse(
    functionContext,
    validateDeleteAdminComponentsResponse
  );

  logger.logInfo(
    `validateDeleteAdminComponentsResponse  Response :: ${JSON.stringify(
      validateDeleteAdminComponentsResponse
    )}`
  );
  logger.logInfo(`validateDeleteAdminComponentsResponse completed`);
};

var savePlaylistResponse = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`savePlaylistResponse() invoked`);

  var savePlaylistResponse = new coreRequestModel.SavePlaylistResponse();

  savePlaylistResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    savePlaylistResponse.Error = functionContext.error;
    savePlaylistResponse.Details = null;
  } else {
    savePlaylistResponse.Details.PlaylistReference = resolvedResult.PlaylistRef;
  }
  appLib.SendHttpResponse(functionContext, savePlaylistResponse);

  logger.logInfo(
    `savePlaylistResponse  Response :: ${JSON.stringify(savePlaylistResponse)}`
  );
  logger.logInfo(`savePlaylistResponse completed`);
};

var saveScheduleResponse = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`saveScheduleResponse() invoked`);

  var saveScheduleResponse = new coreRequestModel.SaveScheduleResponse();

  saveScheduleResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    saveScheduleResponse.Error = functionContext.error;
    saveScheduleResponse.Details = null;
  } else {
    saveScheduleResponse.Details.ScheduleRef = resolvedResult.ScheduleRef;
  }
  appLib.SendHttpResponse(functionContext, saveScheduleResponse);

  logger.logInfo(
    `saveScheduleResponse  Response :: ${JSON.stringify(saveScheduleResponse)}`
  );
  logger.logInfo(`saveScheduleResponse completed`);
};

var saveMonitorResponse = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`saveMonitorResponse() invoked`);

  var saveMonitorResponse = new coreRequestModel.SaveMonitorResponse();

  saveMonitorResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    saveMonitorResponse.Error = functionContext.error;
    saveMonitorResponse.Details = null;
  } else {
    saveMonitorResponse.Details.MonitorRef = resolvedResult.MonitorRef;
  }
  appLib.SendHttpResponse(functionContext, saveMonitorResponse);

  logger.logInfo(
    `saveMonitorResponse  Response :: ${JSON.stringify(saveMonitorResponse)}`
  );
  logger.logInfo(`saveMonitorResponse completed`);
};

var processComponentDetailsData = async (
  functionContext,
  resolvedResult,
  requestDetails
) => {
  var logger = functionContext.logger;

  logger.logInfo(`processComponentDetailsData() invoked`);
  var details = {};
  var resolvedData = {};

  if (resolvedResult) {
    if (requestDetails.componentType == constant.COMPONENTS.Media) {
      resolvedData.Media = resolvedResult[0][0];
      details = {
        ...resolvedData,
      };
    } else if (requestDetails.componentType == constant.COMPONENTS.Playlist) {
      resolvedData.Playlist = resolvedResult[0][0];
      resolvedData.Media = resolvedResult[1];
      details = {
        ...resolvedData,
      };
    } else if (requestDetails.componentType == constant.COMPONENTS.Schedule) {
      resolvedData.ScheduleData = resolvedResult[0][0];
      resolvedData.MonitorData = resolvedResult[1];
      details = {
        ...resolvedData,
      };
    } else if (requestDetails.componentType == constant.COMPONENTS.Monitor) {
      resolvedData.MonitorData = resolvedResult[0][0];
      details = {
        ...resolvedData,
      };
    }
  }

  return details;
};

var getAdminComponentsDetailsResponse = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;

  logger.logInfo(`getAdminComponentsDetailsResponse() invoked`);

  var getAdminComponentsDetailsResponse =
    new coreRequestModel.GetAdminComponentDetailsResponse();

  getAdminComponentsDetailsResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    getAdminComponentsDetailsResponse.Error = functionContext.error;
    getAdminComponentsDetailsResponse.Details = null;
  } else {
    getAdminComponentsDetailsResponse.Error = null;
    getAdminComponentsDetailsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, getAdminComponentsDetailsResponse);

  logger.logInfo(
    `getAdminComponentsDetailsResponse  Response :: ${JSON.stringify(
      getAdminComponentsDetailsResponse
    )}`
  );
  logger.logInfo(`getAdminComponentsDetailsResponse completed`);
};

var processComponentListData = async (
  functionContext,
  requestDetails,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo(`processComponentListData() invoked`);

  var details = {};
  var resolvedData = {};
  var Media = [];

  if (resolvedResult) {
    if (requestDetails.componentType == constant.COMPONENTS.Media) {
      resolvedData.ComponentList = resolvedResult[0];
      details = {
        ...resolvedData,
      };
    } else if (requestDetails.componentType == constant.COMPONENTS.Playlist) {
      resolvedData.ComponentList = resolvedResult[0];
      resolvedData.Media = resolvedResult[1];

      resolvedData.ComponentList.forEach((item) => {
        Media = appLib.FilterArray(resolvedData.Media, item.Id, "PlaylistId");
        item.Media = Media;
      });
      details = {
        ...resolvedData,
      };
    } else if (requestDetails.componentType == constant.COMPONENTS.Schedule) {
      resolvedData.ComponentList = resolvedResult[0];
      for (var i = 0; i < resolvedData.ComponentList.length; i++) {
        let days = [];
        days = JSON.parse(resolvedData.ComponentList[i].Days);
        resolvedData.ComponentList[i].Days = days;
      }
      // resolvedData.ComponentList.forEach(element => {
      //   let days=[];

      //   days=JSON.parse(element.Days);
      //   element.Days=days;

      // });
      resolvedData.MonitorData = resolvedResult[1];
      details = {
        ...resolvedData,
      };
    } else if (requestDetails.componentType == constant.COMPONENTS.Monitor) {
      resolvedData.ComponentList = resolvedResult[0];
      details = {
        ...resolvedData,
      };
    }
  }

  return {
    ComponentList: details.ComponentList,
  };
};

var baseName = (str) => {
  var base = new String(str).substring(str.lastIndexOf("/") + 1);
  if (base.lastIndexOf(".") != -1) {
    base = base.substring(0, base.lastIndexOf("."));
  }
  return base;
};

var processVideo = async (video) => {
  return new Promise((resolve, reject) => {
    var basename = baseName(video.originalname);

    ffmpeg.setFfmpegPath(ffmpegPath);

    ffmpeg(video.path)
      .videoCodec("libx264")
      .withSize("40%")
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
        reject(err);
      })
      .on("progress", function (progress) {
        console.log("... frames: " + progress.frames);
      })
      .on("end", function () {
        console.log("Finished processing");
        resolve();
      })
      .save(`./uploads/${basename}.mp4`);
  });
};
