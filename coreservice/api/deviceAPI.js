var databaseHelper = require("../helper/databasehelper");
var coreRequestModel = require("../models/coreServiceModel");
var constant = require("../common/constant");
var joiValidationModel = require("../models/validationModel");
var requestType = constant.RequestType;
var appLib = require("applib");
var momentTimezone = require("moment-timezone");

module.exports.registerDeviceToken = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`registerDeviceToken invoked()!!`);

  var functionContext = {
    requestType: requestType.REGISTERDEVICETOKEN,
    requestID: res.apiContext.requestID,
    error: null,
    userType: res.apiContext.userType,
    res: res,
    logger: logger,
    userRef: res.apiContext.userRef,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  var registerDeviceTokenRequest =
    new coreRequestModel.RegisterDeviceTokenRequest(req);
  logger.logInfo(
    `registerDeviceToken() :: Request Object : ${registerDeviceTokenRequest}`
  );

  var validateRequest = joiValidationModel.registerDeviceTokenRequest(
    registerDeviceTokenRequest
  );

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `registerDeviceToken() Error:: Invalid Request :: ${JSON.stringify(
        req.body
      )}`
    );
    registerDeviceTokenResponse(functionContext, null);
    return;
  }
  try {
    let registerDeviceTokenDBResult =
      await databaseHelper.registerDeviceTokenInDB(
        functionContext,
        registerDeviceTokenRequest
      );
    registerDeviceTokenResponse(functionContext, registerDeviceTokenDBResult);
  } catch (errRegisterDeviceToken) {
    if (
      !errRegisterDeviceToken.ErrorMessage &&
      !errRegisterDeviceToken.ErrorCode
    ) {
      logger.logInfo(
        `registerDeviceToken() :: Error :: ${errRegisterDeviceToken}`
      );
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errRegisterDeviceToken)
      );
    }
    logger.logInfo(
      `registerDeviceToken() :: Error :: ${JSON.stringify(
        errRegisterDeviceToken
      )}`
    );
    registerDeviceTokenResponse(functionContext, null);
  }
};

var registerDeviceTokenResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`registerDeviceTokenResponse() invoked`);

  var registerDeviceTokenResponse =
    new coreRequestModel.RegisterDeviceTokenResponse();

  registerDeviceTokenResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    registerDeviceTokenResponse.Error = functionContext.error;
    registerDeviceTokenResponse.Details = null;
  } else {
    registerDeviceTokenResponse.Error = null;
    registerDeviceTokenResponse.Details.UserRef = functionContext.userRef;
  }
  appLib.SendHttpResponse(functionContext, registerDeviceTokenResponse);
  logger.logInfo(
    `registerDeviceTokenResponse  Response :: ${JSON.stringify(
      registerDeviceTokenResponse
    )}`
  );
  logger.logInfo(`registerDeviceTokenResponse completed`);
};
