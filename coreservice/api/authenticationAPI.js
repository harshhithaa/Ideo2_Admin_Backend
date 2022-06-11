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


module.exports.AdminLogin = async (req, res) => {
    var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);
  
    logger.logInfo(`AdminLogin invoked()!!`);
  
    var functionContext = new coreRequestModel.FunctionContext(
      requestType.ADMINLOGIN,
      null,
      res,
      logger
    );
  
    var adminLoginRequest = new coreRequestModel.AdminLoginRequest(req);
    logger.logInfo(`AdminLogin() :: Request Object : ${adminLoginRequest}`);
  
    var validateRequest = joiValidationModel.adminLoginRequest(adminLoginRequest);
  
    if (validateRequest.error) {
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.Invalid_Request,
        constant.ErrorCode.Invalid_Request,
        validateRequest.error.details
      );
      logger.logInfo(
        `AdminLogin() Error:: Invalid Request :: ${JSON.stringify(
          adminLoginRequest
        )}`
      );
      saveAdminLoginResponse(functionContext, null);
      return;
    }
  
    var requestContext = {
      ...adminLoginRequest,
      passwordHash: null,
    };
  
    try {
      let fetchAdminLoginDetailsResult = await databaseHelper.fetchAdminLoginDetailsDB(
        functionContext,
        requestContext
      );
  
     await passwordAuthentication(
        functionContext,
        requestContext,
        fetchAdminLoginDetailsResult
      );    
     
  
      var adminLoginDBResult = await databaseHelper.adminLoginDB(
        functionContext,
        requestContext
      );
  
  
      saveAdminLoginResponse(functionContext, adminLoginDBResult,fetchAdminLoginDetailsResult);
    } catch (errAdminLogin) {
      if (!errAdminLogin.ErrorMessage && !errAdminLogin.ErrorCode) {
        logger.logInfo(`AdminLogin() :: Error :: ${errAdminLogin}`);
        functionContext.error = new coreRequestModel.ErrorModel(
          constant.ErrorMessage.ApplicationError,
          constant.ErrorCode.ApplicationError
        );
      }
      logger.logInfo(`AdminLogin() :: Error :: ${JSON.stringify(errAdminLogin)}`);
      saveAdminLoginResponse(functionContext, null);
    }
  };
  
module.exports.AdminLogout = async (req, res) => {
    var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);
  
    logger.logInfo(`AdminLogout invoked()!!`);
  
    var functionContext = new coreRequestModel.FunctionContext(
      requestType.ADMINLOGOUT,
      null,
      res,
      logger
    );
   
   
    try {
      let userLogoutInDBResult = await databaseHelper.adminLogoutInDB(
        functionContext,
        null
      );
      adminLogoutResponse(functionContext, userLogoutInDBResult);
    } catch (errUserLogout) {
      if (!errUserLogout.ErrorMessage && !errUserLogout.ErrorCode) {
        logger.logInfo(`userLogout() :: Error :: ${errUserLogout}`);
        functionContext.error = new coreRequestModel.ErrorModel(
          constant.ErrorMessage.ApplicationError,
          constant.ErrorCode.ApplicationError
        );
      }
      logger.logInfo(`userLogout() :: Error :: ${JSON.stringify(errUserLogout)}`);
      adminLogoutResponse(functionContext, null);
    }
  };

  var saveAdminLoginResponse = (functionContext, resolvedResult,adminDetails) => {
    var logger = functionContext.logger;
  
    logger.logInfo(`saveadminLoginResponse() invoked`);
  
    var adminLoginResponse = new coreRequestModel.AdminLoginResponse();
  
    adminLoginResponse.RequestID = functionContext.requestID;
    if (functionContext.error) {
      adminLoginResponse.Error = functionContext.error;
      adminLoginResponse.Details = null;
    } else {
      adminLoginResponse.Error = null;
  
  
      adminLoginResponse.Details.AuthToken = resolvedResult.AuthToken;
      adminLoginResponse.Details.UserRef = resolvedResult.UserReference;
      adminLoginResponse.Details.UserType = resolvedResult.UserType;      
      
    }
    appLib.SendHttpResponse(functionContext, adminLoginResponse);
    logger.logInfo(
      `saveadminLoginResponse  Response :: ${JSON.stringify(adminLoginResponse)}`
    );
    logger.logInfo(`saveadminLoginResponse completed`);
  };
  
  var adminLogoutResponse = (functionContext, resolvedResult) => {
    var logger = functionContext.logger;
  
    logger.logInfo(`adminLogoutResponse() invoked`);
  
    var adminLogoutResponseModel = new coreRequestModel.AdminLogoutResponse();
  
    adminLogoutResponseModel.RequestID = functionContext.requestID;
    if (functionContext.error) {
      adminLogoutResponseModel.Error = functionContext.error;
      adminLogoutResponseModel.Details = null;
    } else {
      adminLogoutResponseModel.Error = null;
      adminLogoutResponseModel.Details.UserRef = functionContext.userRef;
    }
    appLib.SendHttpResponse(functionContext, adminLogoutResponseModel);
    logger.logInfo(
      `adminLogoutResponse  Response :: ${JSON.stringify(adminLogoutResponseModel)}`
    );
    logger.logInfo(`adminLogoutResponse completed`);
  };
  
  var passwordAuthentication =async (
    functionContext,
    requestContext,
    resolvedResult
  ) => {
    var logger = functionContext.logger;
  
    logger.logInfo(`passwordAuthentication() invoked`);
  
    const result = bcrypt.compareSync(
      `${requestContext.password}`,
      resolvedResult.Password
    );
  
    if (result) {  
      return;
    } else {
      logger.logInfo(`passwordAuthentication() :: Authentication Failed`);
  
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.Invalid_User_Name_Or_Password,
        constant.ErrorCode.Invalid_User_Name_Or_Password
      );
  
      throw functionContext.error;
    }
  };