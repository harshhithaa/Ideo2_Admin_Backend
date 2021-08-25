var databaseHelper = require("../helper/databasehelper");
var coreRequestModel = require("../models/coreserviceModel");
var constant = require("../common/constant");
var requestType = constant.RequestType;
var appLib = require("applib");
var bcrypt = require("bcryptjs");
var settings = require("../common/settings").Settings;
var joiValidationModel = require("../models/validationModel");
const mailSettings = require("../common/settings").MailSettings;
var mailer = new appLib.Mailer(mailSettings);


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