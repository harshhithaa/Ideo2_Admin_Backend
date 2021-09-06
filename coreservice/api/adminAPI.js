var databaseHelper = require("../helper/databasehelper");
var coreRequestModel = require("../models/coreserviceModel");
var constant = require("../common/constant");
var requestType = constant.RequestType;
var appLib = require("applib");
var bcrypt = require("bcryptjs");
var settings = require("../common/settings").Settings;
var joiValidationModel = require("../models/validationModel");
var FTPSettings = require("../common/settings").FTPSettings;
var fileConfiguration = require("../common/settings").FileConfiguration;
var ftp = require("basic-ftp");


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


  var requestContext={
    fileUploadDetails:[],
    userRef:functionContext.userRef,
    file:{
      fileName:null,
      fileMimetype:null,
      srcPath:null,
      destPath:null,
      fileUrl:null,
    }
  }


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
        constant.ErrorCode.ApplicationError,
        
      );
    }else {
      logger.logInfo(`SaveMedia() :: Error :: ${errSaveMedia}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        errSaveMedia.ErrorMessage ,
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
  
    logger.logInfo(
      `savePlaylist() :: Request Object : ${savePlaylistRequest}`
    );
  
    var validateRequest = joiValidationModel.savePlaylistRequest(
      savePlaylistRequest
    );
  
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


  var requestContext={
    fileUploadDetails:[],
    userRef:functionContext.userRef,
    file:{
      fileName:null,
      fileMimetype:null,
      srcPath:null,
      destPath:null,
      fileUrl:null,
    }
  }


  try {
  
    var savePlaylistInDBResponse = await databaseHelper.savePlaylistDB(
      functionContext,
      requestContext
    );
    savePlaylistResponse(functionContext, requestContext);
  } catch (errSavePlaylist) {
    if (!errSavePlaylist.ErrorMessage && !errSavePlaylist.ErrorCode) {
      logger.logInfo(`SavePlaylist() :: Error :: ${errSavePlaylist}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        
      );
    }else {
      logger.logInfo(`SavePlaylist() :: Error :: ${errSavePlaylist}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        errSavePlaylist.ErrorMessage ,
        errSavePlaylist.ErrorCode,
        errSavePlaylist.ErrorDescription
        
      );

    }
    logger.logInfo(`SavePlaylist() :: Error :: ${JSON.stringify(errSavePlaylist)}`);
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
  
    logger.logInfo(
      `saveSchedule() :: Request Object : ${saveScheduleRequest}`
    );
  
    var validateRequest = joiValidationModel.saveScheduleRequest(
      saveScheduleRequest
    );
  
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


  var requestContext={
    userRef:functionContext.userRef,
    ...saveScheduleRequest
  }


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
        constant.ErrorCode.ApplicationError,
        
      );
    }else {
      logger.logInfo(`SaveSchedule() :: Error :: ${errSaveSchedule}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        errSaveSchedule.ErrorMessage ,
        errSaveSchedule.ErrorCode,
        errSaveSchedule.ErrorDescription
        
      );

    }
    logger.logInfo(`SaveSchedule() :: Error :: ${JSON.stringify(errSaveSchedule)}`);
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
  
    logger.logInfo(
      `saveMonitor() :: Request Object : ${saveMonitorRequest}`
    );
  
    var validateRequest = joiValidationModel.saveMonitorRequest(
      saveMonitorRequest
    );
  
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


  var requestContext={
    userRef:functionContext.userRef,
    ...saveMonitorRequest
  }


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
        constant.ErrorCode.ApplicationError,
        
      );
    }else {
      logger.logInfo(`SaveMonitor() :: Error :: ${errSaveMonitor}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        errSaveMonitor.ErrorMessage ,
        errSaveMonitor.ErrorCode,
        errSaveMonitor.ErrorDescription
        
      );

    }
    logger.logInfo(`SaveMonitor() :: Error :: ${JSON.stringify(errSaveMonitor)}`);
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

  var getAdminComponentsRequest = new coreRequestModel.GetAdminComponentRequest(req);
  
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
  

    await getAdminComponentsResponse(functionContext, adminComponentsResult);
  } catch (errValidatePlaceDelivery) {
    if (
      !errValidatePlaceDelivery.ErrorMessage &&
      !errValidatePlaceDelivery.ErrorCode
    ) {
      logger.logInfo(
        `errPlaceDelivery() :: Error :: ${errValidatePlaceDelivery}`
      );
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errValidatePlaceDelivery)
      );
    }
    logger.logInfo(
      `ValidatePlaceDelivery() :: Error :: ${JSON.stringify(
        errValidatePlaceDelivery
      )}`
    );
    getAdminComponentsResponse(functionContext, null);
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

var processMedia=async (functionContext,req,requestContext)=>{
  
  var logger = functionContext.logger;
  
  logger.logInfo(`processMedia() invoked`);
  
  var canUploadFile=true;
  if (canUploadFile) {
    if (req.hasOwnProperty("files")) {

      for (let count = 0; count < req.files.length; count++) {
        var file =  req.files[count];

        if (file.hasOwnProperty("filename")||file.hasOwnProperty("fileName")) {
          if (file.filename) {
            requestContext.file.fileName = file.filename?file.filename:file.fileName;
            requestContext.file.fileMimetype = file.mimetype;
            requestContext.file.srcPath = fileConfiguration.LocalStorage+file.filename;
            requestContext.file.destPath = fileConfiguration.RemoteStorage +file.filename;
            requestContext.file.fileUrl = fileConfiguration.FileUrl +file.filename;

            var uploadFile = await fileUpload(functionContext, requestContext.file);
          }

        }        
        requestContext.fileUploadDetails.push({fileName:file.filename,fileMimetype:file.mimetype,fileUrl:requestContext.file.fileUrl})
      }   
    }  
  }
  
  return;
  
}
var saveMediaResponse = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`saveMediaResponse() invoked`);

  var saveMediaResponse = new coreRequestModel.SaveMediaResponse();

  saveMediaResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    saveMediaResponse.Error = functionContext.error;
    saveMediaResponse.Details = null;
  } else {
    var documents = [];
    if(resolvedResult.fileUploadDetails && resolvedResult.fileUploadDetails.length){
      for (let count = 0; count < resolvedResult.fileUploadDetails.length; count++) {
        var fileDocument = resolvedResult.fileUploadDetails[count];
        var fileName  = fileDocument.fileName;
        var fileKey  = fileDocument.fileKey;
        var preSignedUrl = await awsHelper.getPreSignedUrl(functionContext,"Media/",fileName)
        documents.push({
          DocumentUrl:preSignedUrl,
          DocumentKey: fileKey
          
        })
      }
    }
    saveMediaResponse.Error = null;
    saveMediaResponse.Details.Documents =documents;
  }
  appLib.SendHttpResponse(functionContext, saveMediaResponse);

  logger.logInfo(
    `saveMediaResponse  Response :: ${JSON.stringify(saveMediaResponse)}`
  );
  logger.logInfo(`saveMediaResponse completed`);
};

async function fileUpload(functionContext, resolvedResult) {
  var logger = functionContext.logger;

  logger.logInfo(`fileUpload() Invoked()`);

  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access(FTPSettings);
    await client.uploadFrom(resolvedResult.srcPath, resolvedResult.destPath);
   
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

  var getAdminComponentsResponse = new coreRequestModel.GetAdminComponentRequest();

  getAdminComponentsResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    getAdminComponentsResponse.Error = functionContext.error;
    getAdminComponentsResponse.Details = null;
  } else {
   
      let componentList=[]
  
      resolvedResult.forEach(element => {
        componentList.push(element)
      });
  
    
     
      getAdminComponentsResponse.Error = null;
      getAdminComponentsResponse.Details.ComponentList =componentList;

  }
  appLib.SendHttpResponse(functionContext, getAdminComponentsResponse);

  logger.logInfo(
    `getAdminComponentsResponse  Response :: ${JSON.stringify(getAdminComponentsResponse)}`
  );
  logger.logInfo(`getAdminComponentsResponse completed`);
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
    var documents = [];
    if(resolvedResult.fileUploadDetails && resolvedResult.fileUploadDetails.length){
      for (let count = 0; count < resolvedResult.fileUploadDetails.length; count++) {
        var fileDocument = resolvedResult.fileUploadDetails[count];
        var fileName  = fileDocument.fileName;
        var fileKey  = fileDocument.fileKey;
        var preSignedUrl = await awsHelper.getPreSignedUrl(functionContext,"Playlist/",fileName)
        documents.push({
          DocumentUrl:preSignedUrl,
          DocumentKey: fileKey
          
        })
      }
    }
    savePlaylistResponse.Error = null;
    savePlaylistResponse.Details.Documents =documents;
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
    saveScheduleResponse.Details.ScheduleRef =resolvedResult.ScheduleRef;
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
    saveMonitorResponse.Details.MonitorRef =resolvedResult.MonitorRef;
  }
  appLib.SendHttpResponse(functionContext, saveMonitorResponse);

  logger.logInfo(
    `saveMonitorResponse  Response :: ${JSON.stringify(saveMonitorResponse)}`
  );
  logger.logInfo(`saveMonitorResponse completed`);
};