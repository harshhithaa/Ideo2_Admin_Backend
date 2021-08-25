var databaseHelper = require("../helper/databasehelper");
var coreRequestModel = require("../models/coreServiceModel");
var constant = require("../common/constant");
var xmlBuilder = require("xmlbuilder");
var requestType = constant.RequestType;
var appLib = require("applib");
var uuid = appLib.UUID.prototype;
var settings = require("../common/settings").Settings;
var momentTimezone = require("moment-timezone");
var slashes = require("slashes");
var FTPSettings = require("../common/settings").FTPSettings;
var FileConfiguration = require("../common/settings").FileConfiguration;
var ftp = require("basic-ftp");

module.exports.IsCustomerPresent = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);
  
  logger.logInfo(`isCustomerPresent invoked()`);
  
  var isCustomerPresentProfile = new coreRequestModel.IsCustomerPresentRequest(
    req
    );
    
    var functionContext = {
      requestType: requestType.ISCUSTOMERPRESENT,
      requestID: res.apiContext.requestID,
      error: null,
      res: res,
      customerRef: uuid.GetTimeBasedID(),
      logger: logger,
    };
    
    logger.logInfo(
      `isCustomerPresent() :: Customer request: ${isCustomerPresentProfile}`
      );
      
      if (
        isCustomerPresentProfile.loginType == constant.LoginType.PHONELOGIN &&
        !isCustomerPresentProfile.phone
        ) {
          functionContext.error = new coreRequestModel.ErrorModel(
            constant.ErrorMessage.Invalid_Request,
            constant.ErrorCode.Invalid_Request
            );
            logger.logInfo(
              `isCustomerPresent() :: Error :: Invalid Request :: Phone number missing ::  ${JSON.stringify(
                isCustomerPresentProfile
                )}`
                );
                isCustomerPresentResponse(functionContext, null);
                return;
              }
              if (
                isCustomerPresentProfile.loginType == constant.LoginType.EMAILLOGIN &&
                !isCustomerPresentProfile.email
                ) {
                  functionContext.error = new coreRequestModel.ErrorModel(
                    constant.ErrorMessage.Invalid_Request,
                    constant.ErrorCode.Invalid_Request
                    );
                    logger.logInfo(
                      `isCustomerPresent() :: Error :: Invalid Request :: Phone number missing :: ${JSON.stringify(
                        isCustomerPresentProfile
                        )}`
                        );
                        isCustomerPresentResponse(functionContext, null);
                        return;
                      }
                      
                      var requestContext = {
    
    email: isCustomerPresentProfile.email,
    phone: isCustomerPresentProfile.phone,
    loginType: isCustomerPresentProfile.loginType,
    customerRef: functionContext.customerRef,
    currentTimestamp: isCustomerPresentProfile.currentTimestamp,
  };
  try {
    let checkIfEmailPresentInDBResult = await databaseHelper.checkIfUserIsPresentInDB(
      functionContext,
      requestContext
    );

    isCustomerPresentResponse(functionContext, checkIfEmailPresentInDBResult);
  } catch (errIsCustomerPresent) {
    if (!errIsCustomerPresent.ErrorMessage && !errIsCustomerPresent.ErrorCode) {
      logger.logInfo(`isCustomerPresent() :: Error :: ${errIsCustomerPresent}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }

    logger.logInfo(
      `isCustomerPresent() :: Error :: ${JSON.stringify(errIsCustomerPresent)}`
    );
    isCustomerPresentResponse(functionContext, null);
  }
};


module.exports.UpdateCustomerDetails = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`UpdateCustomerDetails invoked()`);

  var updateCustomerDetailsRequest = new coreRequestModel.UpdateCustomerDetailsRequest(
    req
  );
  logger.logInfo(
    `UpdateCustomerDetails() :: Request :: ${JSON.stringify(req.body)}`
  );
  var functionContext = {
    requestType: requestType.UPDATECUSTOMERDETAILS,
    requestID: res.apiContext.requestID,
    res: res,
    error: null,
    logger: logger,
    customerRef: null,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  if (
    !updateCustomerDetailsRequest.firstName ||
    !updateCustomerDetailsRequest.dateOfBirth ||
    !updateCustomerDetailsRequest.customerRef
  ) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `UpdateCustomerDetails() :: Error :: Invalid Request :: ${JSON.stringify(
        updateCustomerDetailsRequest
      )}`
    );
    updateCustomerDetailsResponse(functionContext, null);
    return;
  }
  try {
    functionContext.customerRef = updateCustomerDetailsRequest.customerRef;
    updateCustomerDetailsRequest.firstName = updateCustomerDetailsRequest.firstName ?  slashes.addSlashes(
      updateCustomerDetailsRequest.firstName) : null;

    updateCustomerDetailsRequest.lastName = updateCustomerDetailsRequest.lastName ? slashes.addSlashes(
      updateCustomerDetailsRequest.lastName) : null;

    updateCustomerDetailsRequest.dateOfBirth = momentTimezone
      .utc(updateCustomerDetailsRequest.dateOfBirth, "DD-MM-YYYY")
      .format("DD-MMMM-YYYY");

    let updateCustomerDetailsInDBResult = await databaseHelper.updateCustomerDetails(
      functionContext,
      updateCustomerDetailsRequest
    );
    updateCustomerDetailsResponse(
      functionContext,
      updateCustomerDetailsInDBResult
    );
  } catch (errUpdateCustomerDetails) {
    if (
      !errUpdateCustomerDetails.ErrorMessage &&
      !errUpdateCustomerDetails.ErrorCode
    ) {
      logger.logInfo(
        `UpdateCustomerDetails() :: Error :: ${errUpdateCustomerDetails}`
      );
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errUpdateCustomerDetails)
      );
    }
    logger.logInfo(
      `UpdateCustomerDetails() :: Error :: ${JSON.stringify(
        errUpdateCustomerDetails
      )}`
    );
    updateCustomerDetailsResponse(functionContext, null);
  }
};


// DELETE MONITORS :: GET

module.exports.SaveScreensUDEL = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`SaveScreensUDEL()`);

  logger.logInfo(
    `SaveScreensUDEL() : Request Body : ${JSON.stringify(req.body)}`
  );

  var SaveScreensUDELRequest = new coreRequestModel.SaveScreensUDELRequest(
    req
  );

  var functionContext = {
    requestType: requestType.SAVESCREENSUDEL,
    requestID: res.apiContext.requestID,
    res: res,
    error: null,
    logger: logger,
    // customerRef: SaveScreensURequest.customerRef,
    // addressRef: null,
    // currentTs: momentTimezone
    //   .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
    //   .tz("Asia/Kolkata")
    //   .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  try {
    logger.logInfo(`SaveScreensUDEL() :: HELLO`);
    let SaveScreensUDELInDBResult = await databaseHelper.SaveScreensUDELInDB(
      functionContext,
      SaveScreensUDELRequest
    );
    SaveScreensUDELResponse(functionContext, SaveScreensUDELInDBResult);
  } catch (errSaveScreensUDEL) {
    if (
      !errSaveScreensUDEL.ErrorMessage &&
      !errSaveScreensUDEL.ErrorCode
    ) {
      logger.logInfo(
        `SaveScreensUDEL() :: Error :: ${errSaveScreensUDEL}`
      );
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errSaveScreensUDEL)
      );
    }
    logger.logInfo(
      `SaveScreensUDEL() :: Error :: ${JSON.stringify(
          errSaveScreensUDEL
      )}`
    );
    SaveScreensUDELResponse(functionContext, null);
  }
};


// ///////////////////////////////////////////////////////////////////////////////////////////////////////////

// UPDATE MONITORS ::

module.exports.SaveScreensU = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`SaveScreensU()`);

  logger.logInfo(
    `SaveScreensU() : Request Body : ${JSON.stringify(req.body)}`
  );

  var SaveScreensURequest = new coreRequestModel.SaveScreensURequest(
    req
  );

  var functionContext = {
    requestType: requestType.SAVESCREENSU,
    requestID: res.apiContext.requestID,
    res: res,
    error: null,
    logger: logger,
    customerRef: SaveScreensURequest.customerRef,
    addressRef: null,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  // if (
  //   !SaveScreensRequest.MonitorRef ||
  //   !SaveScreensRequest.MonitorName ||
  //   !SaveScreensRequest.MonitorDescription ||
  //   !SaveScreensRequest.ScheduleId ||
  //   !SaveScreensRequest.DefaultPlaylistId ||
  //   !SaveScreensRequest.UserId ||
  //   !SaveScreensRequest.CreatedOn 
  //   /*!SaveScreensRequest.longitude*/
  //   /*!SaveScreensRequest.addressNickName*/
  // ) {
  //   functionContext.error = new coreRequestModel.ErrorModel(
  //     constant.ErrorMessage.Invalid_Request,
  //     constant.ErrorCode.Invalid_Request
  //   );
  //   logger.logInfo(
  //     `SaveScreens() :: Error :: Invalid Request :: ${JSON.stringify(
  //         SaveScreensRequest
  //     )}`
  //   );
  //   SaveScreensResponse(functionContext, null);
  //   return;
  // }
  try {
    // if (!SaveScreensURequest.MonitorRef) {
    //   SaveScreensURequest.MonitorRef = uuid.GetTimeBasedID();
    // }
    // functionContext.MonitorRef = SaveScreensURequest.MonitorRef;

    let SaveScreensUInDBResult = await databaseHelper.SaveScreensUInDB(
      functionContext,
      SaveScreensURequest
    );
    SaveScreensUResponse(functionContext, SaveScreensUInDBResult);
  } catch (errSaveScreensU) {
    if (
      !errSaveScreensU.ErrorMessage &&
      !errSaveScreensU.ErrorCode
    ) {
      logger.logInfo(
        `SaveScreensU() :: Error :: ${errSaveScreensU}`
      );
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errSaveScreensU)
      );
    }
    logger.logInfo(
      `SaveScreensU() :: Error :: ${JSON.stringify(
          errSaveScreensU
      )}`
    );
    SaveScreensUResponse(functionContext, null);
  }
};


// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SAVE MONITORS


module.exports.SaveScreens = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`SaveScreens()`);

  logger.logInfo(
    `SaveScreens() : Request Body : ${JSON.stringify(req.body)}`
  );

  var SaveScreensRequest = new coreRequestModel.SaveScreensRequest(
    req
  );

  var functionContext = {
    requestType: requestType.SAVESCREENS,
    requestID: res.apiContext.requestID,
    res: res,
    error: null,
    logger: logger,
    MonitorRef:  SaveScreensRequest.MonitorRef,
    // SaveScreensRequest.MonitorRef,
    addressRef: null,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  // if (
  //     !SaveScreensRequest.MonitorRef 
  //   // !SaveScreensRequest.Customer ||
  //   // !SaveScreensRequest.MonitorName ||
  //   // !SaveScreensRequest.MonitorDescription ||
  //   // !SaveScreensRequest.ScheduleId ||
  //   // !SaveScreensRequest.DefaultPlaylistId ||
  //   // !SaveScreensRequest.UserId ||
  //   // !SaveScreensRequest.CreatedOn 
  //   /*!SaveScreensRequest.longitude*/
  //   /*!SaveScreensRequest.addressNickName*/
  // ) {
  //   functionContext.error = new coreRequestModel.ErrorModel(
  //     constant.ErrorMessage.Invalid_Request,
  //     constant.ErrorCode.Invalid_Request
  //   );
  //   logger.logInfo(
  //     `SaveScreens() :: Error :: Invalid Request :: ${JSON.stringify(
  //         SaveScreensRequest
  //     )}`
  //   );
  //   SaveScreensResponse(functionContext, null);
  //   return;
  // }
  try {
    console.log(SaveScreensRequest.MonitorRef);
    if (SaveScreensRequest.MonitorRef==''||SaveScreensRequest.MonitorRef == null) {
      SaveScreensRequest.MonitorRef = uuid.GetTimeBasedID();
    }
    functionContext.MonitorRef = SaveScreensRequest.MonitorRef;

    let SaveScreensInDBResult = await databaseHelper.SaveScreensInDB(
      functionContext,
      SaveScreensRequest
    );
    SaveScreensResponse(functionContext, SaveScreensInDBResult);
  } catch (errSaveScreens) {
    if (
      !errSaveScreens.ErrorMessage &&
      !errSaveScreens.ErrorCode
    ) {
      logger.logInfo(
        `SaveScreens() :: Error :: ${errSaveScreens}`
      );
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errSaveScreens)
      );
    }
    logger.logInfo(
      `SaveScreens() :: Error :: ${JSON.stringify(
          errSaveScreens
      )}`
    );
    SaveScreensResponse(functionContext, null);
  }
};



// GET PACKAGES //


module.exports.GetPackageItemDetails = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`GetPackageItemDetails()`);

  var functionContext = {
    requestType: requestType.GETPACKAGEITEMDETAILS,
    requestID: res.apiContext.requestID,
    res: res,
    error: null,
    logger: logger,
  };

  try {
    let GetPackageItemDetailsFromDB = await databaseHelper.getPackageDetailsDB(
      functionContext
    );
    
    GetPackageItemDetailsResponse(
      functionContext,
      GetPackageItemDetailsFromDB    );
  } catch (errGetPackageItemDetails) {
    if (
      !errGetPackageItemDetails.ErrorMessage &&
      !errGetPackageItemDetails.ErrorCode
    ) {
      logger.logInfo(
        `SaveCustomerAddress() :: Error :: ${errGetPackageItemDetails}`
      );
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errGetPackageItemDetails)
      );
    }
    logger.logInfo(
      `GetPackageItemDetails() :: Error :: ${JSON.stringify(
          errGetPackageItemDetails
      )}`
    );
    GetPackageItemDetailsResponse(functionContext, null);
  }
};

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//  GET MONITORS

module.exports.GetMonitorItemDetails = async (req, res) => {
    var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);
  
    logger.logInfo(`GetMonitorItemDetails()`);
 
    var functionContext = {
      requestType: requestType.GETMONITORITEMDETAILS,
      requestID: res.apiContext.requestID,
      res: res,
      customerRef:req.body.Customer,
      error: null,
      logger: logger,
    };
  
    try {
      let GetMonitorItemDetailsFromDB = await databaseHelper.getMonitorItemDetailsDB(
        functionContext
      );
      
      GetMonitorItemDetailsResponse(
        functionContext,
        GetMonitorItemDetailsFromDB    );
    } catch (errGetMonitorItemDetails) {
      if (
        !errGetMonitorItemDetails.ErrorMessage &&
        !errGetMonitorItemDetails.ErrorCode
      ) {
        logger.logInfo(
          `SaveCustomerAddress() :: Error :: ${errGetMonitorItemDetails}`
        );
        functionContext.error = new coreRequestModel.ErrorModel(
          constant.ErrorMessage.ApplicationError,
          constant.ErrorCode.ApplicationError,
          JSON.stringify(errGetMonitorItemDetails)
        );
      }
      logger.logInfo(
        `GetMonitorItemDetails() :: Error :: ${JSON.stringify(
            errGetMonitorItemDetails
        )}`
      );
      GetMonitorItemDetailsResponse(functionContext, null);
    }
};



// //////////////////////////////////////////////////////////// ------- CustomerSchedule ---------------------- ////////////////////////////

module.exports.CustomerSchedule = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`ValidatePlaceDelivery()`);

  var validatePlaceDeliveryRequest = new coreRequestModel.validateScheduleRequest(
    req
  );

  logger.logInfo(
    `ValidatePlaceDelivery() Request :: ${JSON.stringify(req.body)}`
  );

  var functionContext = {
    requestType: requestType.VALIDATEPLACEDELIVERY,
    requestID: res.apiContext.requestID,
    serviceType: constant.ServiceType.Delivery,
    userRef: res.apiContext.userRef,
    res: res,
    error: null,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
    reqUrl: req.originalUrl,
  };
  var requestContext = {
    deliveryRef: uuid.GetTimeBasedID(),
    deliveryItemDetails: null,
    currentTs: functionContext.currentTs,
    deliveryStatus: constant.DeliveryStatus.DELIVERY_ESTIMATED_BY_CUSTOMER,
    actualCost: 0,
    discountedCost: 0,
    actualCostAfterDiscount: 0,
    restID: null,
   
    walletAmountApplied : 0,
    walletAmountBalance: 0,
    promoRef: null,
    promoAmountApplied: 0,
    customerWalletBalance: 0,
    customerRef: functionContext.userRef,
    deliveryBaseCharges: 0,
    deliveryBaseAmount: null,
    name:validatePlaceDeliveryRequest.Name,
    description:validatePlaceDeliveryRequest.Description,
    scheduleRef:validatePlaceDeliveryRequest.scheduleRef,
    customer:validatePlaceDeliveryRequest.Customer,
    comand:validatePlaceDeliveryRequest.Comand,
    days:validatePlaceDeliveryRequest.Days,
   
  };
  try {
 if (
    
    validatePlaceDeliveryRequest.schedule.length > 0 
    
  ){
    let processPlaceDeliveryResult = await processPlaceschedule(
      functionContext,
      validatePlaceDeliveryRequest,
     
      requestContext,
     
    );
     var saveDeliveryDetailsResult = await databaseHelper.saveScheduleDetailsInDB(
      functionContext,
      requestContext
    );
  }else{
     var saveDeliveryDetailsResult = await databaseHelper.getscheduleDetailsInDB(
      functionContext,
      requestContext
    );
  }
   

    await validatescheduleresponse(functionContext, saveDeliveryDetailsResult);
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
    validatescheduleresponse(functionContext, null);
  }
};
module.exports.GetCustomerPlaylist = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`ValidatePlaceDelivery()`);

  var validatePlaceDeliveryRequest = new coreRequestModel.getPlaylistAppRequest(
    req
  );

  logger.logInfo(
    `ValidatePlaceDelivery() Request :: ${JSON.stringify(req.body)}`
  );

  var functionContext = {
    requestType: requestType.VALIDATEPLACEDELIVERY,
    requestID: res.apiContext.requestID,
    serviceType: constant.ServiceType.Delivery,
    userRef: res.apiContext.userRef,
    res: res,
    error: null,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
    reqUrl: req.originalUrl,
  };

  var requestContext = {
    deliveryRef: uuid.GetTimeBasedID(),
    deliveryItemDetails: null,
    currentTs: functionContext.currentTs,
    deliveryStatus: constant.DeliveryStatus.DELIVERY_ESTIMATED_BY_CUSTOMER,
    actualCost: 0,
    discountedCost: 0,
    actualCostAfterDiscount: 0,
    restID: null,
   
    walletAmountApplied : 0,
    walletAmountBalance: 0,
    promoRef: null,
    promoAmountApplied: 0,
    customerWalletBalance: 0,
    customerRef: functionContext.userRef,
    deliveryBaseCharges: 0,
    deliveryBaseAmount: null,
    scheduleRef:validatePlaceDeliveryRequest.scheduleRef,
    customerRef:validatePlaceDeliveryRequest.customerRef,
    currentTimestamp:validatePlaceDeliveryRequest.currentTimestamp,
   
  };

  try {
 
     var saveDeliveryDetailsResult = await databaseHelper.getPlaylistDetailsInDB(
      functionContext,
      requestContext
    );
  

    await validatePlaylistAppResponse(functionContext, saveDeliveryDetailsResult);
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
    validatePlaylistAppResponse(functionContext, null);
  }
};
module.exports.CustomerPlaylist = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`ValidatePlaceDelivery()`);

  var validatePlaceDeliveryRequest = new coreRequestModel.ValidatePlaceDeliveryRequest(
    req
  );

  logger.logInfo(
    `ValidatePlaceDelivery() Request :: ${JSON.stringify(req.body)}`
  );

  var functionContext = {
    requestType: requestType.VALIDATEPLACEDELIVERY,
    requestID: res.apiContext.requestID,
    serviceType: constant.ServiceType.Delivery,
    userRef: res.apiContext.userRef,
    res: res,
    error: null,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
    reqUrl: req.originalUrl,
  };

  var requestContext = {
    deliveryRef: uuid.GetTimeBasedID(),
    deliveryItemDetails: null,
    currentTs: functionContext.currentTs,
    deliveryStatus: constant.DeliveryStatus.DELIVERY_ESTIMATED_BY_CUSTOMER,
    actualCost: 0,
    discountedCost: 0,
    actualCostAfterDiscount: 0,
    restID: null,
   
    walletAmountApplied : 0,
    walletAmountBalance: 0,
    promoRef: null,
    promoAmountApplied: 0,
    customerWalletBalance: 0,
    customerRef: functionContext.userRef,
    deliveryBaseCharges: 0,
    deliveryBaseAmount: null,
    name:validatePlaceDeliveryRequest.Name,
    description:validatePlaceDeliveryRequest.Description,
    PlaylistRef:validatePlaceDeliveryRequest.PlaylistRef,
    customer:validatePlaceDeliveryRequest.Customer,
    comand:validatePlaceDeliveryRequest.Comand,
   
  };

  try {
 if (
    
    validatePlaceDeliveryRequest.playlist.length > 0 
    
  ){
    let processPlaceDeliveryResult = await processPlaceDelivery(
      functionContext,
      validatePlaceDeliveryRequest,
     
      requestContext,
     
    );
     let saveDeliveryDetailsResult = await databaseHelper.saveDeliveryDetailsInDB(
      functionContext,
      requestContext
    );
  }else{
     var saveDeliveryDetailsResult = await databaseHelper.getDeliveryDetailsInDB(
      functionContext,
      requestContext
    );
  }

    await validatePlaceDeliveryResponse(functionContext, saveDeliveryDetailsResult);
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
    validatePlaceDeliveryResponse(functionContext, null);
  }
};

////////////////////////////////////////-----------------------------///////////////////////////////---------------------------------------


module.exports.AppSettings = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`AppSettings()`);

  logger.logInfo(
    `CustomerAppSettings() Request :: ${JSON.stringify(req.body)}`
  );

  var functionContext = {
    requestType: requestType.CUSTOMERAPPSETTINGS,
    requestID: res.apiContext.requestID,
    res: res,
    userType: res.apiContext.userType,
    error: null,
    logger: logger,
    reqUrl: req.originalUrl,
  };
  var requestContext = {
    restaurantCities: [],
    baseDeliveryRate: {
      amount: null,
      isRequired: null,
    },
    maxNumberOfFavourite: {
      Favourites: null,
      isRequired: null,
    },
    feedbackQuestionSet: {
      DeliveryFeedbackQuestionSet: [],
      PickupFeedbackQuestionSet: [],
      BookingFeedbackQuestionSet: [],
    },
    appMessages :{},
    feedbackRatingMap : []
  };

  try {
    let getAllRestaurantDetailsResult = await databaseHelper.getAllRestaurantDetails(
      functionContext,
      null
    );

    let getRestaurantBaseSettingsDBResult = await databaseHelper.getRestaurantBaseSettingsDB(
      functionContext,
      null
    );

    let getFeedbackQuestionsResult = await databaseHelper.getFeedbackQuestionsDB(
      functionContext,
      null
    );

    let processCustomerAppsettingsResult = await processCustomerAppsettings(
      functionContext,
      requestContext,
      getAllRestaurantDetailsResult,
      getRestaurantBaseSettingsDBResult,
      getFeedbackQuestionsResult
    );

    getCustomerAppSettingsResponse(functionContext, requestContext);
  } catch (errAppSettings) {
    if (!errAppSettings.ErrorMessage && !errAppSettings.ErrorCode) {
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errAppSettings)
      );
    }

    logger.logInfo(
      `AppSettings() :: Error :: ${JSON.stringify(errAppSettings)}`
    );
    getCustomerAppSettingsResponse(functionContext, null);
  }
};

module.exports.UpdatePassword = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`updatePassword()`);

  logger.logInfo(`updatePassword() Request :: ${JSON.stringify(req.body)}`);

  var updatePasswordRequest = new coreRequestModel.UpdatePasswordRequest(req);

  if (!updatePasswordRequest.password) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request
    );
    updatePasswordResponse(functionContext, null);
    return;
  }

  var functionContext = {
    requestType: requestType.UPDATEPASSWORD,
    requestID: res.apiContext.requestID,
    res: res,
    userType: res.apiContext.userType,
    userRef: res.apiContext.userRef,
    error: null,
    logger: logger,
    reqUrl: req.originalUrl,
  };

  var requestContext = {
    password: updatePasswordRequest.password,
    currentTimestamp: updatePasswordRequest.currentTimestamp,
  };

  try {
    let updatePassword = await databaseHelper.updatePasswordDB(
      functionContext,
      requestContext
    );

    updatePasswordResponse(functionContext, updatePassword);
  } catch (errUpdatePassword) {
    if (!errUpdatePassword.ErrorMessage && !errUpdatePassword.ErrorCode) {
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errUpdatePassword)
      );
    }

    logger.logInfo(
      `updatePassword() :: Error :: ${JSON.stringify(errUpdatePassword)}`
    );
    updatePasswordResponse(functionContext, null);
  }
};
module.exports.CustomerLoginApp = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`CustomerLogin invoked()!!`);

  var functionContext = {
    requestType: requestType.CUSTOMERLOGIN,
    requestID: res.apiContext.requestID,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  var customerLogin = new coreRequestModel.CustomerLoginRequest(req);
  logger.logInfo(`Cus1tomerLogin() :: Request Object : ${customerLogin}`);

  if (!customerLogin.phone || !customerLogin.password) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `CustomerLogin() Error:: Invalid Request :: ${JSON.stringify(
        customerLogin
      )}`
    );
    saveCustomerLoginAppResponse(functionContext, null);
    return;
  }

  try {
    let customerLoginDBResult = await databaseHelper.CustomerLoginAppDB(
      functionContext,
      customerLogin
    );
   
    saveCustomerLoginAppResponse(functionContext, customerLoginDBResult);
  } catch (errCustomerLogin) {
    if (!errCustomerLogin.ErrorMessage && !errCustomerLogin.ErrorCode) {
      logger.logInfo(`Customer1Login() :: Error :: ${errCustomerLogin}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errCustomerLogin)
      );
    }
    logger.logInfo(
      `CustomerLogin() :: Error1 :: ${JSON.stringify(errCustomerLogin)}`
    );
    saveCustomerLoginAppResponse(functionContext, null);
  }
};
module.exports.CustomerLogin = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`CustomerLogin invoked()!!`);

  var functionContext = {
    requestType: requestType.CUSTOMERLOGIN,
    requestID: res.apiContext.requestID,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  var customerLogin = new coreRequestModel.CustomerLoginRequest(req);
  logger.logInfo(`Cus1tomerLogin() :: Request Object : ${customerLogin}`);

  if (!customerLogin.phone || !customerLogin.password) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `CustomerLogin() Error:: Invalid Request :: ${JSON.stringify(
        customerLogin
      )}`
    );
    saveCustomerLoginResponse(functionContext, null);
    return;
  }

  try {
    let customerLoginDBResult = await databaseHelper.CustomerLoginDB(
      functionContext,
      customerLogin
    );
    saveCustomerLoginResponse(functionContext, customerLoginDBResult);
  } catch (errCustomerLogin) {
    if (!errCustomerLogin.ErrorMessage && !errCustomerLogin.ErrorCode) {
      logger.logInfo(`Customer1Login() :: Error :: ${errCustomerLogin}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errCustomerLogin)
      );
    }
    logger.logInfo(
      `CustomerLogin() :: Error2 :: ${JSON.stringify(errCustomerLogin)}`
    );
    saveCustomerLoginResponse(functionContext, null);
  }
};

module.exports.CustomerUpload = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`CustomerLogin invoked()!!`);

  var functionContext = {
    requestType: requestType.CUSTOMERLOGIN,
    requestID: res.apiContext.requestID,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };
 
  var customerLogin = new coreRequestModel.CustomerUploadRequest(req);
  var requestContext = {
   ...customerLogin,
    srcPath: null,
    destPath: null,
    dishImageUrl: null,
    
  };
 
  logger.logInfo(`Cus1tomerLogin() :: Request Object : ${customerLogin}`);

  // if (!customerLogin.Name || !customerLogin.Description) {
  //   functionContext.error = new coreRequestModel.ErrorModel(
  //     constant.ErrorMessage.Invalid_Request,
  //     constant.ErrorCode.Invalid_Request
  //   );
  //   logger.logInfo(
  //     `CustomerLogin() Error:: Invalid Request ::`
  //   );
  //   saveCustomerUploadResponse(functionContext, null);
  //   return;
  // }else{
     if (req.hasOwnProperty("file")) {
        if (req.file.hasOwnProperty("filename")) {
          if (req.file.filename) {
           
            customerLogin.CustomerImage = req.file.filename;
          }

 
     requestContext.srcPath =
        FileConfiguration.LocalStorage +
        customerLogin.CustomerImage;
      requestContext.destPath =
        FileConfiguration.RemoteStorage +
        customerLogin.CustomerImage;
      requestContext.dishImageUrl =
        FileConfiguration.FileUrl + customerLogin.CustomerImage;
     var uploadFile = await fileUpload(functionContext, requestContext);
     




        }
      }
    
  // }

  try {
    let customerLoginDBResult = await databaseHelper.CustomerUploadDB(
      functionContext,
      customerLogin
    );
    saveCustomerUploadResponse(functionContext, customerLoginDBResult);
  } catch (errCustomerLogin) {
    if (!errCustomerLogin.ErrorMessage && !errCustomerLogin.ErrorCode) {
      logger.logInfo(`Customer1Login() :: Error :: ${errCustomerLogin}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError,
        JSON.stringify(errCustomerLogin)
      );
    }
    logger.logInfo(
      `CustomerLogin() :: Error3 :: ${JSON.stringify(errCustomerLogin)}`
    );
    saveCustomerUploadResponse(functionContext, null);
  }
};


var isCustomerPresentResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`isCustomerPresentResponse Invoked()`);

  var isCustomerPresentResponse = new coreRequestModel.IsCustomerPresentResponse();

  isCustomerPresentResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    isCustomerPresentResponse.Error = functionContext.error;
    isCustomerPresentResponse.Details = null;
  } else {
    isCustomerPresentResponse.Error = null;
    isCustomerPresentResponse.Details.CustomerRef = resolvedResult.CustomerRef
      ? resolvedResult.CustomerRef
      : null;
    isCustomerPresentResponse.Details.VerificationStatus = resolvedResult.VerificationStatus
      ? resolvedResult.VerificationStatus
      : null;
    isCustomerPresentResponse.Details.AuthToken = resolvedResult.AuthToken
      ? resolvedResult.AuthToken
      : null;
    isCustomerPresentResponse.Details.VerificationStatus = resolvedResult.VerificationStatus
      ? resolvedResult.VerificationStatus
      : null;
  }
  appLib.SendHttpResponse(functionContext, isCustomerPresentResponse);
  logger.logInfo(
    `isCustomerPresentResponse  Response :: ${JSON.stringify(
      isCustomerPresentResponse
    )}`
  );
  logger.logInfo(`isCustomerPresentResponse completed`);
};



var updateCustomerDetailsResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`updateCustomerDetailsResponse Invoked()`);

  var updateCustomerDetailsResponse = new coreRequestModel.UpdateCustomerDetailsResponse();

  updateCustomerDetailsResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    updateCustomerDetailsResponse.Error = functionContext.error;
    updateCustomerDetailsResponse.Details = null;
  } else {
    updateCustomerDetailsResponse.Error = null;
    updateCustomerDetailsResponse.Details.CustomerRef =
      functionContext.customerRef;
    updateCustomerDetailsResponse.Details.VerificationStatus =
      resolvedResult.VerificationStatus;
  }
  appLib.SendHttpResponse(functionContext, updateCustomerDetailsResponse);
  logger.logInfo(
    `updateCustomerDetailsResponse  Response :: ${JSON.stringify(
      updateCustomerDetailsResponse
    )}`
  );
  logger.logInfo(`updateCustomerDetailsResponse completed`);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DELETE MONITORS ::
var SaveScreensUDELResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`SaveScreensUDELResponse() invoked`);

  var SaveScreensUDELResponse = new coreRequestModel.SaveScreensUDELResponse();

  SaveScreensUDELResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
      SaveScreensUDELResponse.Error = functionContext.error;
      SaveScreensUDELResponse.Details = null;
  } else {
      SaveScreensUDELResponse.Error = null;
      SaveScreensUDELResponse.Details.AddressRef = functionContext.addressRef;
  }
  appLib.SendHttpResponse(functionContext, saveCustomerAddressResponse);
  logger.logInfo(
    `SaveScreensUDELResponse  Response :: ${JSON.stringify(
      SaveScreensUDELResponse
    )}`
  );
  logger.logInfo(`SaveScreensUDELResponse completed`);
};


// UPDATE MONITORS ::

var SaveScreensUResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`SaveScreensUResponse() invoked`);

  var SaveScreensUResponse = new coreRequestModel.SaveScreensUResponse();

  SaveScreensUResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
      SaveScreensUResponse.Error = functionContext.error;
      SaveScreensUResponse.Details = null;
  } else {
      SaveScreensUResponse.Error = null;
      SaveScreensUResponse.Details.AddressRef = functionContext.addressRef;
  }
  appLib.SendHttpResponse(functionContext, saveCustomerAddressResponse);
  logger.logInfo(
    `SaveScreensUResponse  Response :: ${JSON.stringify(
      SaveScreensUResponse
    )}`
  );
  logger.logInfo(`SaveScreensUResponse completed`);
};


// Save MOnitors


var SaveScreensResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`SaveScreensResponse() invoked`);

  var SaveScreensResponse = new coreRequestModel.SaveScreensResponse();

  SaveScreensResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
      SaveScreensResponse.Error = functionContext.error;
      SaveScreensResponse.Details = null;
  } else {
      SaveScreensResponse.Error = null;
      SaveScreensResponse.Details.MonitorRef = functionContext.MonitorRef;
  }
  appLib.SendHttpResponse(functionContext, saveCustomerAddressResponse);
  logger.logInfo(
    `SaveScreensResponse  Response :: ${JSON.stringify(
      SaveScreensResponse
    )}`
  );
  logger.logInfo(`SaveScreensResponse completed`);
};




var saveCustomerAddressResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`saveCustomerAddressResponse() invoked`);

  var saveCustomerAddressResponse = new coreRequestModel.SaveCustomerAddressResponse();

  saveCustomerAddressResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    saveCustomerAddressResponse.Error = functionContext.error;
    saveCustomerAddressResponse.Details = null;
  } else {
    saveCustomerAddressResponse.Error = null;
    saveCustomerAddressResponse.Details.AddressRef = functionContext.addressRef;
  }
  appLib.SendHttpResponse(functionContext, saveCustomerAddressResponse);
  logger.logInfo(
    `saveCustomerAddressResponse  Response :: ${JSON.stringify(
     saveCustomerAddressResponse
    )}`
  );
  logger.logInfo(`saveCustomerAddressResponse completed`);
};


// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////



var GetPackageItemDetailsResponse =  (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`GetPackageItemDetailsResponse Invoked()`);

  var restaurantItemDetailsResponse = new coreRequestModel.GetPackageItemDetailsResponse();
  restaurantItemDetailsResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    restaurantItemDetailsResponse.Error = functionContext.error;
    restaurantItemDetailsResponse.Details = [];
  }else{
    restaurantItemDetailsResponse.Details.Dishes = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, restaurantItemDetailsResponse);
  logger.logInfo(
    `GetPackageItemDetailsResponse  Response :: ${JSON.stringify(
      restaurantItemDetailsResponse
    )}`
  );
  logger.logInfo(`GetPackageItemDetailsResponse completed`);
};


// Get Monitors

var GetMonitorItemDetailsResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`GetMonitorItemDetailsResponse Invoked()`);

  var restaurantItemDetailsResponse = new coreRequestModel.GetMonitorItemDetailsResponse();
  restaurantItemDetailsResponse.RequestID = functionContext.requestID;
  if (functionContext.error) {
    restaurantItemDetailsResponse.Error = functionContext.error;
    restaurantItemDetailsResponse.Details = [];
  }else{
    restaurantItemDetailsResponse.Details.Dishes = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, restaurantItemDetailsResponse);
  logger.logInfo(
    `GetMonitorItemDetailsResponse  Response :: ${JSON.stringify(
      restaurantItemDetailsResponse
    )}`
  );
  logger.logInfo(`GetMonitorItemDetailsResponse completed`);
};


// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var validatescheduleresponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`validatePlaceDeliveryResponse Invoked()${JSON.stringify(resolvedResult)}`);

  var validatePlaceDeliveryResponse = new coreRequestModel.ValidatePlaceDeliveryResponse();

  validatePlaceDeliveryResponse.RequestID = functionContext.requestID;

  if (functionContext.error) {
    validatePlaceDeliveryResponse.Error = functionContext.error;
    validatePlaceDeliveryResponse.Details = null;
  } else {
  for (let index = 0; index < resolvedResult.BasicDetails1.length; index++) {
   
      validatePlaceDeliveryResponse.Details.playlist.push(resolvedResult.BasicDetails1[index]);
      let id =resolvedResult.BasicDetails1[index].Id;
   let media =resolvedResult.BasicDetails.filter((item,index)=>{return    item.ScheduleId===id})
 validatePlaceDeliveryResponse.Details.playlist[index].media=media;
  
  }
    validatePlaceDeliveryResponse.Error = null;
  }
  appLib.SendHttpResponse(functionContext, validatePlaceDeliveryResponse);
  logger.logInfo(
    `validatePlaceDeliveryResponse  Response :: ${JSON.stringify(
      validatePlaceDeliveryResponse
    )}`
  );
  logger.logInfo(`validatePlaceDeliveryResponse completed`);
};
var validatePlaylistAppResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`validatePlaceDeliveryResponse Invoked()`);

  var validatePlaceDeliveryResponse = new coreRequestModel.playlistAppResponse();

  validatePlaceDeliveryResponse.RequestID = functionContext.requestID;

  if (functionContext.error) {
    validatePlaceDeliveryResponse.Error = functionContext.error;
    validatePlaceDeliveryResponse.Details = null;
  } else {
 
   
     
    validatePlaceDeliveryResponse.Details.playlist = resolvedResult.BasicDetails;
    validatePlaceDeliveryResponse.Details.schedule = resolvedResult.BasicDetails1;
  
  
  
    validatePlaceDeliveryResponse.Error = null;
  }
  appLib.SendHttpResponse(functionContext, validatePlaceDeliveryResponse);
  logger.logInfo(
    `validatePlaceDeliveryResponse  Response :: ${JSON.stringify(
      validatePlaceDeliveryResponse
    )}`
  );
  logger.logInfo(`validatePlaceDeliveryResponse completed`);
};
var validatePlaceDeliveryResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`validatePlaceDeliveryResponse Invoked()`);

  var validatePlaceDeliveryResponse = new coreRequestModel.ValidatePlaceDeliveryResponse();

  validatePlaceDeliveryResponse.RequestID = functionContext.requestID;

  if (functionContext.error) {
    validatePlaceDeliveryResponse.Error = functionContext.error;
    validatePlaceDeliveryResponse.Details = null;
  } else {
  for (let index = 0; index < resolvedResult.BasicDetails1.length; index++) {
   
      validatePlaceDeliveryResponse.Details.playlist.push(resolvedResult.BasicDetails1[index]);
      let id =resolvedResult.BasicDetails1[index].Id;
   let media =resolvedResult.BasicDetails.filter((item,index)=>{return    item.PlaylistId===id})
 validatePlaceDeliveryResponse.Details.playlist[index].media=media;
  
  }
    validatePlaceDeliveryResponse.Error = null;
  }
  appLib.SendHttpResponse(functionContext, validatePlaceDeliveryResponse);
  logger.logInfo(
    `validatePlaceDeliveryResponse  Response :: ${JSON.stringify(
      validatePlaceDeliveryResponse
    )}`
  );
  logger.logInfo(`validatePlaceDeliveryResponse completed`);
};
async function processPlaceschedule(
  functionContext,
  validatePlaceDeliveryRequest,
  
  requestContext,
 
) {
  var logger = functionContext.logger;

  logger.logInfo(`processPlaceDelivery Invoked()`);

  // requestContext.deliveryBaseCharges =
  //   getRestaurantBaseSettingsDBResult.Is_Base_Delivery_Rate_Required == 1
  //     ? getRestaurantBaseSettingsDBResult.Base_Delivery_Rate
  //     : 0;

  var requestDeliveryItems = validatePlaceDeliveryRequest.schedule;
  var requestDeliveryItemsCount = requestDeliveryItems.length;
  // var restaurantDetails = appLib.GetArrayValue(
  //   getAllRestaurantDetailsResult.Restaurant,
  //   validatePlaceDeliveryRequest.restaurantRef,
  //   "RestaurantRef"
  // );
  // if (restaurantDetails.IsDeliveryAvail == 0) {
  //   logger.logInfo(
  //     `processPlaceDelivery() Error:: Restaurant is current not servicing delivery. Delivery Avail Status :  ${restaurantDetails.IsDeliveryAvail}`
  //   );

  //   functionContext.error = new coreRequestModel.ErrorModel(
  //     constant.ErrorMessage.Delivery_InServiceable,
  //     constant.ErrorCode.Delivery_InServiceable
  //   );
  //   throw functionContext.error;
  // }
  // var restaurantItemDetails = restaurantDetails.RestID
  //   ? appLib.FilterArray(
  //       getAllRestaurantDetailsResult.Dishes,
  //       restaurantDetails.RestID,
  //       "RestId"
  //     )
  //   : [];
  // var restaurantItemDetailsCount = restaurantItemDetails.length;

  // requestContext.restID = restaurantDetails.RestID;

  if (requestDeliveryItemsCount > 0) {
    var saveDeliveryDetailsListXML = xmlBuilder.create("root");
    for (
      let reqDeliveryCount = 0;
      reqDeliveryCount < requestDeliveryItemsCount;
      reqDeliveryCount++
    ) {
      // var reqDeliveryItemRef = requestDeliveryItems[reqDeliveryCount].DishRef;

      // var isReqDishActive = false;
      // for (
      //   let restDetailsCount = 0;
      //   restDetailsCount < restaurantItemDetailsCount;
      //   restDetailsCount++
      // ) {
        // var restItemDetailsRef =
        //   restaurantItemDetails[restDetailsCount].DishRef;

        // if (reqDeliveryItemRef == restItemDetailsRef) {
        //   if (restaurantItemDetails[restDetailsCount].IsActive == 1) {
            // var itemActualAmount =
            //   restaurantItemDetails[restDetailsCount].Amount;
            
            // requestContext.actualCost =
            //   requestContext.actualCost +
            //   itemActualAmount *
            //     requestDeliveryItems[reqDeliveryCount].Quantity;

            // var itemActualCostAfterDiscount =
            //   itemActualAmount *
            //   requestDeliveryItems[reqDeliveryCount].Quantity;

            var discountedAmount = 0;
            saveDeliveryDetailsListXML
              .ele("Delivery")
              .ele("TransactionRef", uuid.GetTimeBasedID())
              .up()
              .ele("PlaylistID", requestDeliveryItems[reqDeliveryCount].pref)
              .up()
              .ele("Firststart", requestDeliveryItems[reqDeliveryCount].startdate)
              .up()
              .ele("Firststop", requestDeliveryItems[reqDeliveryCount].middate)
              .up()
              .ele("Endtime", requestDeliveryItems[reqDeliveryCount].enddate)
              .up()
              
              // .ele(
              //   "ActualAmount",
              //   itemActualAmount *
              //     requestDeliveryItems[reqDeliveryCount].Quantity
              // )
              // .up()
              // .ele("DiscountedAmount", discountedAmount)
              // .up()
              // .ele("ActualCostAfterDiscount", itemActualCostAfterDiscount)
              // .up()
              ;

            isReqDishActive = true;
        //   } else {
        //     logger.logInfo(
        //       `processPlaceDelivery() Error:: Dish is presently not available ${reqDeliveryItemRef}`
        //     );

        //     functionContext.error = new coreRequestModel.ErrorModel(
        //       constant.ErrorMessage.Dish_Not_Available.replace(
        //         "$dishname",
        //         restaurantItemDetails[restDetailsCount].DishName
        //       ),
        //       constant.ErrorCode.Dish_Not_Available
        //     );
        //     throw functionContext.error;
        //   }
        //   break;
        // } else {
        // }
      // }
      // if (!isReqDishActive) {
      //   logger.logInfo(
      //     `processPlaceDelivery() Error:: Invalid Dish Reference Passed ${reqDeliveryItemRef}`
      //   );

      //   functionContext.error = new coreRequestModel.ErrorModel(
      //     constant.ErrorMessage.Restaurant_Details_Updated,
      //     constant.ErrorCode.Restaurant_Details_Updated
      //   );
      //   throw functionContext.error;
      // }
    }

    saveDeliveryDetailsListXML.end();
    logger.logInfo(
      "saveDeliveryDetailsListXML Snapshot List: " +
        saveDeliveryDetailsListXML.toString({ pretty: true })
    );

    requestContext.deliveryItemDetails = saveDeliveryDetailsListXML;

    /**Calculating Base Delivery Rate */
    // var finalCost = requestContext.actualCost;
    // requestContext.deliveryBaseAmount = finalCost;

    // if (requestContext.deliveryBaseCharges > 0) {
    //   if (!validatePlaceDeliveryRequest.deliveryCharges) {
    //     functionContext.error = new coreRequestModel.ErrorModel(
    //       constant.ErrorMessage.Invalid_Request,
    //       constant.ErrorCode.Invalid_Request
    //     );
    //     logger.logInfo(
    //       `ValidatePlaceDelivery() Error:: Invalid Request :: ${JSON.stringify(
    //         validatePlaceDeliveryRequest
    //       )}`
    //     );
    //     throw functionContext.error;
    //   } else {
    //     if (
    //       validatePlaceDeliveryRequest.deliveryCharges ==
    //       requestContext.deliveryBaseCharges
    //     ) {
    //       logger.logInfo(
    //         `Delivery Charges Applied : ${requestContext.deliveryBaseCharges}`
    //       );

    //       requestContext.actualCost =
    //         finalCost + requestContext.deliveryBaseCharges;
    //     } else {
    //       logger.logInfo(
    //         `processPlaceDelivery() Error:: Mismatch Delivery Charges , Delivery Ref : ${reqDeliveryItemRef}, Requested Delivery Charges : ${validatePlaceDeliveryRequest.deliveryCharges} , Current Delivery Charges ${requestContext.deliveryBaseCharges} `
    //       );

    //       functionContext.error = new coreRequestModel.ErrorModel(
    //         constant.ErrorMessage.Restaurant_Details_Updated,
    //         constant.ErrorCode.Restaurant_Details_Updated
    //       );
    //       throw functionContext.error;
    //     }
    //   }
    // }
    // let calculateFinalCostResult = await calculateFinalCost(
    //   functionContext,
    //   requestContext.actualCost,
    //   validatePlaceDeliveryRequest.walletAmount,
    //   validatePlaceDeliveryRequest.promoRef,
    //   requestContext
    // );
    /** */

    return requestContext;
  } else {
    // logger.logInfo(
    //   `processPlaceDelivery() Error:: No Item Details Present :: ${JSON.stringify(
    //     restaurantItemDetails
    //   )}`
    // );

    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request
    );
    throw functionContext.error;
  }
}
async function processPlaceDelivery(
  functionContext,
  validatePlaceDeliveryRequest,
  
  requestContext,
 
) {
  var logger = functionContext.logger;

  logger.logInfo(`processPlaceDelivery Invoked()`);

  // requestContext.deliveryBaseCharges =
  //   getRestaurantBaseSettingsDBResult.Is_Base_Delivery_Rate_Required == 1
  //     ? getRestaurantBaseSettingsDBResult.Base_Delivery_Rate
  //     : 0;

  var requestDeliveryItems = validatePlaceDeliveryRequest.playlist;
  var requestDeliveryItemsCount = requestDeliveryItems.length;
  // var restaurantDetails = appLib.GetArrayValue(
  //   getAllRestaurantDetailsResult.Restaurant,
  //   validatePlaceDeliveryRequest.restaurantRef,
  //   "RestaurantRef"
  // );
  // if (restaurantDetails.IsDeliveryAvail == 0) {
  //   logger.logInfo(
  //     `processPlaceDelivery() Error:: Restaurant is current not servicing delivery. Delivery Avail Status :  ${restaurantDetails.IsDeliveryAvail}`
  //   );

  //   functionContext.error = new coreRequestModel.ErrorModel(
  //     constant.ErrorMessage.Delivery_InServiceable,
  //     constant.ErrorCode.Delivery_InServiceable
  //   );
  //   throw functionContext.error;
  // }
  // var restaurantItemDetails = restaurantDetails.RestID
  //   ? appLib.FilterArray(
  //       getAllRestaurantDetailsResult.Dishes,
  //       restaurantDetails.RestID,
  //       "RestId"
  //     )
  //   : [];
  // var restaurantItemDetailsCount = restaurantItemDetails.length;

  // requestContext.restID = restaurantDetails.RestID;

  if (requestDeliveryItemsCount > 0) {
    var saveDeliveryDetailsListXML = xmlBuilder.create("root");
    for (
      let reqDeliveryCount = 0;
      reqDeliveryCount < requestDeliveryItemsCount;
      reqDeliveryCount++
    ) {
      // var reqDeliveryItemRef = requestDeliveryItems[reqDeliveryCount].DishRef;

      // var isReqDishActive = false;
      // for (
      //   let restDetailsCount = 0;
      //   restDetailsCount < restaurantItemDetailsCount;
      //   restDetailsCount++
      // ) {
        // var restItemDetailsRef =
        //   restaurantItemDetails[restDetailsCount].DishRef;

        // if (reqDeliveryItemRef == restItemDetailsRef) {
        //   if (restaurantItemDetails[restDetailsCount].IsActive == 1) {
            // var itemActualAmount =
            //   restaurantItemDetails[restDetailsCount].Amount;
            
            // requestContext.actualCost =
            //   requestContext.actualCost +
            //   itemActualAmount *
            //     requestDeliveryItems[reqDeliveryCount].Quantity;

            // var itemActualCostAfterDiscount =
            //   itemActualAmount *
            //   requestDeliveryItems[reqDeliveryCount].Quantity;

            var discountedAmount = 0;
            saveDeliveryDetailsListXML
              .ele("Delivery")
              .ele("TransactionRef", uuid.GetTimeBasedID())
              .up()
              .ele("MediaID", requestDeliveryItems[reqDeliveryCount].Id)
              .up()
              .ele("MediaRef", requestDeliveryItems[reqDeliveryCount].MediaRef)
              .up()
              .ele("Priority",reqDeliveryCount )
              .up()
              // .ele(
              //   "ActualAmount",
              //   itemActualAmount *
              //     requestDeliveryItems[reqDeliveryCount].Quantity
              // )
              // .up()
              // .ele("DiscountedAmount", discountedAmount)
              // .up()
              // .ele("ActualCostAfterDiscount", itemActualCostAfterDiscount)
              // .up()
              ;

            isReqDishActive = true;
        //   } else {
        //     logger.logInfo(
        //       `processPlaceDelivery() Error:: Dish is presently not available ${reqDeliveryItemRef}`
        //     );

        //     functionContext.error = new coreRequestModel.ErrorModel(
        //       constant.ErrorMessage.Dish_Not_Available.replace(
        //         "$dishname",
        //         restaurantItemDetails[restDetailsCount].DishName
        //       ),
        //       constant.ErrorCode.Dish_Not_Available
        //     );
        //     throw functionContext.error;
        //   }
        //   break;
        // } else {
        // }
      // }
      // if (!isReqDishActive) {
      //   logger.logInfo(
      //     `processPlaceDelivery() Error:: Invalid Dish Reference Passed ${reqDeliveryItemRef}`
      //   );

      //   functionContext.error = new coreRequestModel.ErrorModel(
      //     constant.ErrorMessage.Restaurant_Details_Updated,
      //     constant.ErrorCode.Restaurant_Details_Updated
      //   );
      //   throw functionContext.error;
      // }
    }

    saveDeliveryDetailsListXML.end();
    logger.logInfo(
      "saveDeliveryDetailsListXML Snapshot List: " +
        saveDeliveryDetailsListXML.toString({ pretty: true })
    );

    requestContext.deliveryItemDetails = saveDeliveryDetailsListXML;

    /**Calculating Base Delivery Rate */
    // var finalCost = requestContext.actualCost;
    // requestContext.deliveryBaseAmount = finalCost;

    // if (requestContext.deliveryBaseCharges > 0) {
    //   if (!validatePlaceDeliveryRequest.deliveryCharges) {
    //     functionContext.error = new coreRequestModel.ErrorModel(
    //       constant.ErrorMessage.Invalid_Request,
    //       constant.ErrorCode.Invalid_Request
    //     );
    //     logger.logInfo(
    //       `ValidatePlaceDelivery() Error:: Invalid Request :: ${JSON.stringify(
    //         validatePlaceDeliveryRequest
    //       )}`
    //     );
    //     throw functionContext.error;
    //   } else {
    //     if (
    //       validatePlaceDeliveryRequest.deliveryCharges ==
    //       requestContext.deliveryBaseCharges
    //     ) {
    //       logger.logInfo(
    //         `Delivery Charges Applied : ${requestContext.deliveryBaseCharges}`
    //       );

    //       requestContext.actualCost =
    //         finalCost + requestContext.deliveryBaseCharges;
    //     } else {
    //       logger.logInfo(
    //         `processPlaceDelivery() Error:: Mismatch Delivery Charges , Delivery Ref : ${reqDeliveryItemRef}, Requested Delivery Charges : ${validatePlaceDeliveryRequest.deliveryCharges} , Current Delivery Charges ${requestContext.deliveryBaseCharges} `
    //       );

    //       functionContext.error = new coreRequestModel.ErrorModel(
    //         constant.ErrorMessage.Restaurant_Details_Updated,
    //         constant.ErrorCode.Restaurant_Details_Updated
    //       );
    //       throw functionContext.error;
    //     }
    //   }
    // }
    // let calculateFinalCostResult = await calculateFinalCost(
    //   functionContext,
    //   requestContext.actualCost,
    //   validatePlaceDeliveryRequest.walletAmount,
    //   validatePlaceDeliveryRequest.promoRef,
    //   requestContext
    // );
    /** */

    return requestContext;
  } else {
    // logger.logInfo(
    //   `processPlaceDelivery() Error:: No Item Details Present :: ${JSON.stringify(
    //     restaurantItemDetails
    //   )}`
    // );

    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request
    );
    throw functionContext.error;
  }
}


var getCustomerAppSettingsResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`getCustomerAppSettingsResponse Invoked()`);

  var getCustomerAppSettingsResponse = new coreRequestModel.CustomerAppSettingsResponse();

  getCustomerAppSettingsResponse.RequestID = functionContext.requestID;

  if (functionContext.error) {
    getCustomerAppSettingsResponse.Error = functionContext.error;
    getCustomerAppSettingsResponse.Details = null;
  } else {
    getCustomerAppSettingsResponse.Details.FeedbackRatingMap =
      resolvedResult.feedbackRatingMap;
    getCustomerAppSettingsResponse.Details.RestaurantOperatingCities =
      resolvedResult.restaurantCities;
    getCustomerAppSettingsResponse.Details.DeliveryBaseRate.Amount =
      resolvedResult.baseDeliveryRate.amount;
    getCustomerAppSettingsResponse.Details.MaxNumberOfFavourites.Favourites =
      resolvedResult.maxNumberOfFavourite.Favourites;
    getCustomerAppSettingsResponse.Details.MaxNumberOfFavourites.IsRequired =
      resolvedResult.maxNumberOfFavourite.isRequired;
    getCustomerAppSettingsResponse.Details.FeedbackQuestionSet =
      resolvedResult.feedbackQuestionSet;
    getCustomerAppSettingsResponse.Details.CustomerAppMessages =
      resolvedResult.appMessages;

    getCustomerAppSettingsResponse.Error = null;
  }
  appLib.SendHttpResponse(functionContext, getCustomerAppSettingsResponse);
  logger.logInfo(
    `getCustomerAppSettingsResponse  Response :: ${JSON.stringify(
      getCustomerAppSettingsResponse
    )}`
  );
  logger.logInfo(`getCustomerAppSettingsResponse completed`);
};

var updatePasswordResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`updatePasswordResponse Invoked()`);

  var updatePasswordResponse = new coreRequestModel.UpdatePasswordResponse();

  updatePasswordResponse.RequestID = functionContext.requestID;

  if (functionContext.error) {
    updatePasswordResponse.Error = functionContext.error;
    updatePasswordResponse.Details = null;
  } else {
    updatePasswordResponse.Details.CustomerRef = functionContext.userRef;
    updatePasswordResponse.Error = null;
  }
  appLib.SendHttpResponse(functionContext, updatePasswordResponse);
  logger.logInfo(
    `updatePasswordResponse  Response :: ${JSON.stringify(
      updatePasswordResponse
    )}`
  );
  logger.logInfo(`updatePasswordResponse completed`);
};

var saveCustomerUploadResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`saveCustomerLoginResponse Invoked()`);

  var customerLoginResponse = new coreRequestModel.customerUploadResponse();

  customerLoginResponse.RequestID = functionContext.requestID;

  if (functionContext.error) {
    customerLoginResponse.Error = functionContext.error;
    customerLoginResponse.Details = null;
  } else {
    customerLoginResponse.Details= resolvedResult;
   
    customerLoginResponse.Error = null;
  }
  appLib.SendHttpResponse(functionContext, customerLoginResponse);
  logger.logInfo(
    `customerLoginResponse  Response :: ${JSON.stringify(
      customerLoginResponse
    )}`
  );
  logger.logInfo(`customerLoginResponse completed`);
};
var saveCustomerLoginAppResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`saveCustomerLoginResponse Invoked()`);

  var customerLoginResponse = new coreRequestModel.CustomerLoginResponse();

  customerLoginResponse.RequestID = functionContext.requestID;

  if (functionContext.error) {
    customerLoginResponse.Error = functionContext.error;
    customerLoginResponse.Details = null;
  } else {
    customerLoginResponse.Details.CustomerRef = resolvedResult.result.CustomerRef;
    customerLoginResponse.Details.details = resolvedResult.result1;
    customerLoginResponse.Details.Token = resolvedResult.result.Token;
    customerLoginResponse.Error = null;
  }
  appLib.SendHttpResponse(functionContext, customerLoginResponse);
  logger.logInfo(
    `customerLoginResponse  Response :: ${JSON.stringify(
      customerLoginResponse
    )}`
  );
  logger.logInfo(`customerLoginResponse completed`);
};
var saveCustomerLoginResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`saveCustomerLoginResponse Invoked()`);

  var customerLoginResponse = new coreRequestModel.CustomerLoginResponse();

  customerLoginResponse.RequestID = functionContext.requestID;

  if (functionContext.error) {
    customerLoginResponse.Error = functionContext.error;
    customerLoginResponse.Details = null;
  } else {
    customerLoginResponse.Details.CustomerRef = resolvedResult.CustomerRef;
    customerLoginResponse.Details.Token = resolvedResult.Token;
    customerLoginResponse.Error = null;
  }
  appLib.SendHttpResponse(functionContext, customerLoginResponse);
  logger.logInfo(
    `customerLoginResponse  Response :: ${JSON.stringify(
      customerLoginResponse
    )}`
  );
  logger.logInfo(`customerLoginResponse completed`);
};


var processCustomerAppsettings = (
  functionContext,
  requestContext,
  getAllRestaurantDetailsResult,
  getRestaurantBaseSettingsDBResult,
  getFeedbackQuestionsResult
) => {
  var logger = functionContext.logger;

  logger.logInfo(`processCustomerAppsettings Invoked()`);

  var isRestaurantActive = [];
  isRestaurantActive =
    getAllRestaurantDetailsResult.Restaurant.length > 0
      ? appLib.FilterArray(
          getAllRestaurantDetailsResult.Restaurant,
          1,
          "IsActive"
        )
      : [];

  for (var count = 0; count < isRestaurantActive.length; count++) {
    requestContext.restaurantCities.push(isRestaurantActive[count].City);
  }
  requestContext.restaurantCities = Array.from(
    new Set(requestContext.restaurantCities)
  );

  requestContext.baseDeliveryRate.amount =
    getRestaurantBaseSettingsDBResult.Is_Base_Delivery_Rate_Required == 1
      ? getRestaurantBaseSettingsDBResult.Base_Delivery_Rate
      : 0;

  requestContext.maxNumberOfFavourite.Favourites =
    getRestaurantBaseSettingsDBResult.Max_Number_Of_Favourites_To_Add;
  requestContext.maxNumberOfFavourite.isRequired =
    getRestaurantBaseSettingsDBResult.Is_Max_Number_Of_Favourites_Required;

  if (getFeedbackQuestionsResult.length > 0) {
    for (var count = 0; count < getFeedbackQuestionsResult.length; count++) {
      if (
        getFeedbackQuestionsResult[count].ServiceType ==
        constant.ServiceType.Delivery
      ) {
        requestContext.feedbackQuestionSet.DeliveryFeedbackQuestionSet.push({
          Id: getFeedbackQuestionsResult[count].ID,
          Note: getFeedbackQuestionsResult[count].Questions,
          RatingType: getFeedbackQuestionsResult[count].RatingType,
        });
      }
      if (
        getFeedbackQuestionsResult[count].ServiceType ==
        constant.ServiceType.Pickup
      ) {
        requestContext.feedbackQuestionSet.PickupFeedbackQuestionSet.push({
          Id: getFeedbackQuestionsResult[count].ID,
          Note: getFeedbackQuestionsResult[count].Questions,
          RatingType: getFeedbackQuestionsResult[count].RatingType,
        });
      }
      if (
        getFeedbackQuestionsResult[count].ServiceType ==
        constant.ServiceType.BookATable
      ) {
        requestContext.feedbackQuestionSet.BookingFeedbackQuestionSet.push({
          Id: getFeedbackQuestionsResult[count].ID,
          Note: getFeedbackQuestionsResult[count].Questions,
          RatingType: getFeedbackQuestionsResult[count].RatingType,
        });
      }
    }
  }

  requestContext.appMessages['Customer_On_Booking_Placed_App_Msg'] = settings.Customer_On_Booking_Placed_App_Msg;
  requestContext.appMessages['Customer_Booking_On_Accepted_App_Msg'] = settings.Customer_Booking_On_Accepted_App_Msg;
  requestContext.appMessages['Customer_Booking_On_Visit_To_Restaurant_App_Msg'] = settings.Customer_Booking_On_Visit_To_Restaurant_App_Msg;
  requestContext.appMessages['Customer_Booking_On_Complete_App_Msg'] = settings.Customer_Booking_On_Complete_App_Msg;
  requestContext.appMessages['Customer_Booking_On_Cancelled_App_Msg'] = settings.Customer_Booking_On_Cancelled_App_Msg;
  requestContext.appMessages['Customer_Booking_On_Req_NotFulfilled_App_Msg'] = settings.Customer_Booking_On_Req_NotFulfilled_App_Msg;
  
  var bookingFeedbackRatingMapValueLength = Object.keys(constant.BookingFeedbackRatingMapValue).length

  for(var count = 0 ; count < bookingFeedbackRatingMapValueLength ; count ++)
  {
  
    var bookingFeedbackMapKey = constant.BookingFeedbackRatingMapKey[Object.keys(constant.BookingFeedbackRatingMapValue)[count]]
    requestContext.feedbackRatingMap.push({[bookingFeedbackMapKey] : Object.values(constant.BookingFeedbackRatingMapValue)[count]}) 
  };
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