var appLib = require("applib");
var uuid = appLib.UUID.prototype;
var databaseHelper = require("../helper/databasehelper");
var coreRequestModel = require("../models/coreserviceModel");
var joiValidationModel = require("../models/validationModel");
var settings = require("../common/settings").Settings;
var mailSettings = require("../common/settings").MailSettings;
var constant = require("../common/constant");
var requestType = constant.RequestType;

exports.AuthenticateRequest = async function (req, res, next) {

  var requestID = uuid.GetTimeBasedID();
  var logger = new appLib.Logger(req.originalUrl, requestID);
  var mailer = new appLib.Mailer(mailSettings);
  logger.logInfo(`AuthenticateRequest invoked()!`);

  var apiContext = new coreRequestModel.ApiContext(requestID);
  res.apiContext = apiContext;

  var functionContext = new coreRequestModel.FunctionContext(
    requestType.AUTHENTICATEREQUEST,
    null,
    res,
    logger,
    mailer
  );

  var validateRequest = new coreRequestModel.ValidateRequest(req);
  var validateResponse = new coreRequestModel.ValidateResponse(req);
  var validateAPIRequest = joiValidationModel.validateRequest(validateRequest);

  validateResponse.RequestID = requestID; 

  if (validateAPIRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `AuthenticateRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );

    validateResponse.Error = functionContext.error;
    appLib.SendHttpResponse(functionContext, validateResponse);
    return;
  }

  var basicAuth = new Buffer(
    settings.APP_KEY + ":" + settings.APP_SECRET
  ).toString("base64");

  if (validateRequest.authorization != basicAuth) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Authentication,
      constant.ErrorCode.Invalid_Authentication
    );
    logger.logInfo(
      `AuthenticateRequest() Error:: Invalid Authentication :: ${JSON.stringify(
        validateRequest
      )}`
    );
    validateResponse.Error = functionContext.error;
    appLib.SendHttpResponse(functionContext, validateResponse);
    return;
  }

  var authenticationResult = authentication(functionContext);

  if (validateRequest.authorization != authenticationResult.basicAuth) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Authentication,
      constant.ErrorCode.Invalid_Authentication
    );
    logger.logInfo(
      `AuthenticateRequest() Error:: Invalid Authentication :: ${JSON.stringify(
        validateRequest
      )}`
    );
    validateResponse.Error = functionContext.error;
    appLib.SendHttpResponse(functionContext, validateResponse);
    return;
  }

  try {
    let validateRequestResult = await databaseHelper.validateRequest(
      functionContext,
      validateRequest
    );
    
    apiContext.userType = validateRequestResult.UserType;
    apiContext.userRef = validateRequestResult.UserRef;
    apiContext.userID = validateRequestResult.UserID;

    res.apiContext = apiContext;
    next();
  } catch (errValidateRequest) {
    if (!errValidateRequest.ErrorMessage && !errValidateRequest.ErrorCode) {
      logger.logInfo(`AuthenticateRequest() :: Error :: ${errValidateRequest}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `AuthenticateRequest() :: Error :: ${JSON.stringify(errValidateRequest)}`
    );
    validateResponse.Error = functionContext.error;
    appLib.SendHttpResponse(functionContext, validateResponse);
  }
};


var authentication = (functionContext) => {
  var logger = functionContext.logger;

  logger.logInfo(`authentication() Invoked! `);

  var basicAuth = new Buffer.from(
    settings.APP_KEY + ":" + settings.APP_SECRET
  ).toString("base64");

  return {
    basicAuth: basicAuth,
  };
};
