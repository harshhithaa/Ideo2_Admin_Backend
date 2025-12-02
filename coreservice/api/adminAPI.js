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
const AWS = require("aws-sdk");
const { getVideoDurationInSeconds } = require("get-video-duration");

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

module.exports.UpdateAllMonitors = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`UpdateAllMonitors()`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.UPDATEALLMONITORS,
    null,
    res,
    logger
  );

  var updateAllMonitorsRequest = new coreRequestModel.UpdateAllMonitorsRequest(
    req
  );

  logger.logInfo(
    `UpdateAllMonitors() :: Request Object : ${updateAllMonitorsRequest}`
  );

  var validateRequest = joiValidationModel.updateAllMonitorsRequest(
    updateAllMonitorsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `DeleteAdminComponents() Error:: Invalid Request :: ${JSON.stringify(
        updateAllMonitorsRequest
      )}`
    );
    updateAllMonitorsResponse(functionContext, null);
    return;
  }

  try {
    var updateAllMonitorsResult = await databaseHelper.updateAllMonitorInDB(
      functionContext,
      updateAllMonitorsRequest
    );

    await updateAllMonitorsResponse(functionContext, updateAllMonitorsResult);
  } catch (errUpdateAllMonitors) {
    if (!errUpdateAllMonitors.ErrorMessage && !errUpdateAllMonitors.ErrorCode) {
      logger.logInfo(
        `errUpdateAllMonitorsResponse() :: Error :: ${errUpdateAllMonitors}`
      );
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errUpdateAllMonitors)
      );
    }
    logger.logInfo(
      `DeleteAdminComponents() :: Error :: ${JSON.stringify(
        errUpdateAllMonitors
      )}`
    );
    updateAllMonitorsResponse(functionContext, null);
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
        const toBeUploaded = fs.readFileSync(req.files[count].path);
        var file = req.files[count];
        const stream = fs.createReadStream(req.files[count].path);

        let duration = 0;
        if (file.mimetype === "video/mp4") {
          duration = await getVideoDurationInSeconds(stream);
        }
        // console.log(duration);
        logger.logInfo(
          `Media Files() invoked ${JSON.stringify(req.files[count])}`
        );
        // if (file.mimetype === "video/mp4") {
        //   await processVideo(file);
        // }
        if (
          file.hasOwnProperty("filename") ||
          file.hasOwnProperty("fileName")
        ) {
          if (file.filename) {
            console.log(file.filename.split(" ").join("%20"));
            // if (file.mimetype === "video/mp4") {
            //   console.log("file path", `./uploads/${file.filename}`);
            //   fs.unlink(`./uploads/${file.filename}`, () => {
            //     console.log("File Removed");
            //   });
            //   requestContext.file.fileName = file.originalname
            //     ? file.originalname
            //     : file.originalname;
            //   requestContext.file.fileMimetype = file.mimetype;
            //   requestContext.file.srcPath =
            //     fileConfiguration.LocalStorage + file.originalname;
            //   requestContext.file.destPath =
            //     fileConfiguration.RemoteStorage +
            //     new Date().toDateString() +
            //     file.originalname;
            //   requestContext.file.fileUrl =
            //     fileConfiguration.FileUrl +
            //     new Date().toDateString() +
            //     file.originalname;
            // } else {
            requestContext.file.fileName = file.originalname
              ? file.originalname
              : file.originalname;
            requestContext.file.fileMimetype = file.mimetype;
            requestContext.file.srcPath =
              fileConfiguration.LocalStorage + file.filename;
            requestContext.file.destPath =
              fileConfiguration.RemoteStorage + file.filename;
            requestContext.file.fileUrl =
              fileConfiguration.DO_SPACES_URL +
              file.filename.split(" ").join("%20");
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
          fileDuration: duration,
        });

        var fileUrl = await fileUpload(
          functionContext,
          requestContext.file.srcPath,
          toBeUploaded
        );

        console.log(fileUrl);

        requestContext.file.fileUrl = fileUrl;

        // filesUrls.push(fileUrl);
      }
      // var uploadFile = await fileUpload(
      //   functionContext,
      //   requestContext.serverUploadDetails
      // );
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

async function fileUpload(functionContext, filePath, file) {
  var logger = functionContext.logger;

  logger.logInfo(`fileUpload() Invoked()`);

  const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);

  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  });

  // const client = new ftp.Client();
  // client.ftp.verbose = true;
  // await client.access(FTPSettings);

  // const element = fileDetails[file];

  const params = {
    Bucket: process.env.DO_SPACES_NAME,
    Key: `ideogram/${filePath.split("/")[1]}`,
    Body: file,
    ACL: "public-read",
  };

  try {
    const stored = await s3.upload(params).promise();
    console.log(stored);
    return stored.Location;
  } catch (err) {
    logger.logInfo(`fileUpload() :: Error :: ${JSON.stringify(err)}`);
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,

      constant.ErrorCode.ApplicationError
    );
    throw functionContext.error;
  }

  // s3.upload(
  //   {
  //     Bucket: process.env.DO_SPACES_NAME,
  //     Key: `ideogram/${fileDetails[0].srcPath.split("/")[1]}`,
  //     Body: file,
  //     ACL: "public-read",
  //   },
  //   (err, data) => {
  //     return new Promise((resolve, reject) => {
  //       if (err) {
  //         logger.logInfo(`fileUpload() :: Error :: ${JSON.stringify(err)}`);
  //         functionContext.error = new coreRequestModel.ErrorModel(
  //           constant.ErrorMessage.ApplicationError,

  //           constant.ErrorCode.ApplicationError
  //         );
  //         reject(err);
  //       } else {
  //         resolve(data.Location);
  //       }
  //     });
  // if (err) {
  //   logger.logInfo(`fileUpload() :: Error :: ${JSON.stringify(err)}`);
  //   functionContext.error = new coreRequestModel.ErrorModel(
  //     constant.ErrorMessage.ApplicationError,

  //     constant.ErrorCode.ApplicationError
  //   );
  //   throw functionContext.error;
  // } else {
  //   console.log("Your file has been uploaded successfully!", data);
  //   return new Promise((resolve, reject) => {
  //     resolve(data.Location);
  //   });
  // }

  // await client.uploadFrom(element.srcPath, element.destPath);
  // client.close();
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
    
    // Check if deletion was actually successful
    if (resolvedResult && resolvedResult.success) {
      deleteAdminComponentsResponse.Details = {
        IsDeleted: true,
        DeletedCount: resolvedResult.affectedRows || 0,
        ProcessedCount: resolvedResult.processedCount || 0
      };
    } else {
      // If no success flag, return false
      deleteAdminComponentsResponse.Details = {
        IsDeleted: false,
        Error: "Deletion failed - no confirmation from database"
      };
    }
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
      // normalize single media item
      resolvedData.Media = resolvedResult[0][0];
      if (resolvedData.Media) {
        resolvedData.Media.Duration =
          resolvedData.Media.MediaDuration !== undefined
            ? resolvedData.Media.MediaDuration
            : resolvedData.Media.Duration !== undefined
            ? resolvedData.Media.Duration
            : null;
      }
      details = {
        ...resolvedData,
      };
    } else if (requestDetails.componentType == constant.COMPONENTS.Playlist) {
      resolvedData.Playlist = resolvedResult[0][0];
      // resolvedResult[1] is media list for playlist — normalize durations
      resolvedData.Media = (resolvedResult[1] || []).map((m) => ({
        ...m,
        Duration:
          m.MediaDuration !== undefined
            ? m.MediaDuration
            : m.Duration !== undefined
            ? m.Duration
            : null,
      }));
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
      // Monitor details: resolvedResult[0][0] is monitor, resolvedResult[1] is schedules
      resolvedData.Monitor = resolvedResult[0][0];
      resolvedData.Schedules = resolvedResult[1] || [];
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

var updateAllMonitorsResponse = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`updateAllMonitorsResponse() invoked`);

  var updateAllMonitorsResponse =
    new coreRequestModel.UpdateAllMonitorsResponse();

  updateAllMonitorsResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    updateAllMonitorsResponse.Error = functionContext.error;
    updateAllMonitorsResponse.Details = null;
  } else {
    updateAllMonitorsResponse.Error = null;
    updateAllMonitorsResponse.Details = "Monitors Updated Successfully";
  }
  appLib.SendHttpResponse(functionContext, updateAllMonitorsResponse);

  logger.logInfo(
    `updateAllMonitorsResponse  Response :: ${JSON.stringify(
      updateAllMonitorsResponse
    )}`
  );
  logger.logInfo(`updateAllMonitorsResponse completed`);
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
  var Schedules = [];

  if (resolvedResult) {
    if (requestDetails.componentType == constant.COMPONENTS.Media) {
      // normalize media list durations
      resolvedData.ComponentList = (resolvedResult[0] || []).map((m) => ({
        ...m,
        Duration: m.MediaDuration !== undefined ? m.MediaDuration : m.Duration !== undefined ? m.Duration : null,
      }));
      details = {
        ...resolvedData,
      };
    } else if (requestDetails.componentType == constant.COMPONENTS.Playlist) {
      resolvedData.ComponentList = resolvedResult[0];
      // normalize media list for playlists
      resolvedData.Media = (resolvedResult[1] || []).map((m) => ({
        ...m,
        Duration: m.MediaDuration !== undefined ? m.MediaDuration : m.Duration !== undefined ? m.Duration : null,
      }));

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
      resolvedData.Schedules = resolvedResult[1];

      resolvedData.ComponentList.forEach((item) => {
        Schedules = appLib.FilterArray(
          resolvedData.Schedules,
          item.Id,
          "MonitorId"
        );
        item.Schedules = Schedules;
      });

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

module.exports.GetAdminComponentsWithPagination = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`GetAdminComponentsWithPagination invoked()!!`);
  logger.logInfo(`Query params: ${JSON.stringify(req.query)}`);

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.GETADMINCOMPONENTSWITHPAGINATION,
    null,
    res,
    logger
  );

  try {
    var getAdminComponentWithPaginationRequest = 
      new coreRequestModel.GetAdminComponentWithPaginationRequest(req);

    logger.logInfo(
      `GetAdminComponentsWithPagination() :: Request Object : ${JSON.stringify(getAdminComponentWithPaginationRequest)}`
    );

    var validateRequest = joiValidationModel.getAdminComponentWithPaginationRequest(
      getAdminComponentWithPaginationRequest
    );

    if (validateRequest.error) {
      logger.logInfo(
        `GetAdminComponentsWithPagination() :: Validation Error: ${JSON.stringify(validateRequest.error)}`
      );

      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ValidationError,
        constant.ErrorCode.InvalidInput,
        validateRequest.error.details[0].message
      );

      return getAdminComponentsWithPaginationResponse(functionContext, null);
    }

    // **KEY CHANGE: Get userId from authenticated session**
    var requestContext = {
      ...getAdminComponentWithPaginationRequest,
      userRef: functionContext.userRef,
      // Override userId with the logged-in user's ID from session
      userId: res.apiContext.userID || null  // <-- IMPORTANT CHANGE
    };

    functionContext.requestContext = requestContext;
    
    logger.logInfo(`Request context with userId: ${JSON.stringify(requestContext)}`);

    await databaseHelper
      .getAdminComponentsWithPaginationDB(functionContext, requestContext)
      .then(async (resolvedResult) => {
        logger.logInfo(`DB resolved with ${resolvedResult?.length || 0} results`);
        await getAdminComponentsWithPaginationResponse(functionContext, resolvedResult);
      })
      .catch((rejectedResult) => {
        logger.logInfo(
          `GetAdminComponentsWithPagination() rejectedResult: ${JSON.stringify(rejectedResult)}`
        );
        functionContext.error = rejectedResult;
        return getAdminComponentsWithPaginationResponse(functionContext, null);
      });
  } catch (errGetAdminComponentsWithPagination) {
    logger.logInfo(
      `GetAdminComponentsWithPagination() :: Caught Exception: ${errGetAdminComponentsWithPagination.message}`
    );
    logger.logInfo(
      `Stack trace: ${errGetAdminComponentsWithPagination.stack}`
    );

    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
      errGetAdminComponentsWithPagination.message
    );

    return getAdminComponentsWithPaginationResponse(functionContext, null);
  }
};

var getAdminComponentsWithPaginationResponse = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("getAdminComponentsWithPaginationResponse() invoked!!");

  var response = new coreRequestModel.GetAdminComponentWithPaginationResponse();
  response.RequestID = functionContext.requestID;

  // Check for error - handle empty objects
  if (functionContext.error != null && Object.keys(functionContext.error).length > 0) {
    logger.logInfo(
      `getAdminComponentsWithPaginationResponse() :: Error: ${JSON.stringify(functionContext.error)}`
    );
    response.Error = functionContext.error;
    return functionContext.res.send(response);
  }

  logger.logInfo(`getAdminComponentsWithPaginationResponse() :: Processing results`);

  try {
    var componentListData = resolvedResult;
    
    if (!componentListData || componentListData.length === 0) {
      logger.logInfo(`getAdminComponentsWithPaginationResponse() :: No data found`);
      response.Details = {
        ComponentList: [],
        TotalRecords: 0,
        PageNumber: functionContext.requestContext?.pageNumber || 1,
        PageSize: functionContext.requestContext?.pageSize || 10,
        TotalPages: 0
      };
      return functionContext.res.send(response);
    }

    const totalRecords = componentListData[0].TotalRecords || 0;
    const pageNumber = functionContext.requestContext?.pageNumber || 1;
    const pageSize = functionContext.requestContext?.pageSize || 10;
    const totalPages = Math.ceil(totalRecords / pageSize);

    response.Details = {
      ComponentList: componentListData,
      TotalRecords: totalRecords,
      PageNumber: pageNumber,
      PageSize: pageSize,
      TotalPages: totalPages
    };

    logger.logInfo(
      `getAdminComponentsWithPaginationResponse() :: Returning ${componentListData.length} items, Total: ${totalRecords}, Page: ${pageNumber}/${totalPages}`
    );

    return functionContext.res.send(response);
  } catch (errProcessResponse) {
    logger.logInfo(
      `getAdminComponentsWithPaginationResponse() :: Error: ${errProcessResponse.message}`
    );
    logger.logInfo(
      `Stack trace: ${errProcessResponse.stack}`
    );

    response.Error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
      errProcessResponse.message
    );

    return functionContext.res.send(response);
  }
};

module.exports.DeleteComponentList = async (req, res) => {
  var apiContext = new coreRequestModel.ApiContext(
    req,
    res,
    "DeleteComponentList"
  );

  try {
    var request = req.body;
    
    // ADD THIS LOGGING
    console.log("DELETE REQUEST BODY:", JSON.stringify(request, null, 2));
    console.log("ComponentList being deleted:", request.ComponentList);
    
    var functionContext = new coreRequestModel.FunctionContext(
      apiContext,
      requestType.DeleteComponentList
    );

    // ...existing code...
  } catch (err) {
    // ...existing code...
  }
};
