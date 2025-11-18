var databaseModule = require("../database/database");
var coreRequestModel = require("../models/coreServiceModel");
var constant = require("../common/constant");

module.exports.fetchAdminLoginDetailsDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("fetchAdminLoginDetailsDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_fetch_admin_login_details('${resolvedResult.email}')`
    );
    logger.logInfo(
      `fetchAdminLoginDetailsDB() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    var result = rows[0][0][0] ? rows[0][0][0] : null;
    return result;
  } catch (errfetchAdminLoginDetailsDBDB) {
    logger.logInfo(
      `fetchAdminLoginDetailsDBDB() :: Error :: ${JSON.stringify(
        errfetchAdminLoginDetailsDBDB
      )}`
    );
    var errorCode = null;
    var errorMessage = null;
    if (
      errfetchAdminLoginDetailsDBDB.sqlState &&
      errfetchAdminLoginDetailsDBDB.sqlState == constant.ErrorCode.Invalid_User
    ) {
      errorCode = constant.ErrorCode.Invalid_User;
      errorMessage = constant.ErrorMessage.Invalid_User;
    } else if (
      errfetchAdminLoginDetailsDBDB.sqlState &&
      errfetchAdminLoginDetailsDBDB.sqlState ==
        constant.ErrorCode.Invalid_User_Name_Or_Password
    ) {
      errorCode = constant.ErrorCode.Invalid_User_Name_Or_Password;
      errorMessage = constant.ErrorMessage.Invalid_User_Name_Or_Password;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode
    );
    throw functionContext.error;
  }
};

module.exports.adminLoginDB = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("adminLoginDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_admin_login('${resolvedResult.email}','${functionContext.currentTs}')`
    );
    logger.logInfo(
      `adminLoginDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    var result = rows[0][0][0] ? rows[0][0][0] : null;
    return result;
  } catch (errAdminLoginDB) {
    logger.logInfo(
      `adminLoginDB() :: Error :: ${JSON.stringify(errAdminLoginDB)}`
    );
    var errorCode = null;
    var errorMessage = null;
    if (
      errAdminLoginDB.sqlState &&
      errAdminLoginDB.sqlState == constant.ErrorCode.Invalid_User
    ) {
      errorCode = constant.ErrorCode.Invalid_User;
      errorMessage = constant.ErrorMessage.Invalid_User;
    } else if (
      errAdminLoginDB.sqlState &&
      errAdminLoginDB.sqlState ==
        constant.ErrorCode.Invalid_User_Name_Or_Password
    ) {
      errorCode = constant.ErrorCode.Invalid_User_Name_Or_Password;
      errorMessage = constant.ErrorMessage.Invalid_User_Name_Or_Password;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode
    );
    throw functionContext.error;
  }
};

module.exports.adminLogoutInDB = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("adminLogoutInDB() Invoked!");

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_user_logout('${functionContext.userRef}',${functionContext.userType},'${functionContext.currentTs}')`
    );

    logger.logInfo("adminLogoutInDB() :: admin Logged out Successfully");
    return result;
  } catch (erradminLogout) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError
    );
    logger.logInfo(
      `adminLogoutInDB() :: Error :: ${JSON.stringify(erradminLogout)}`
    );
    throw functionContext.error;
  }
};

module.exports.saveSystemUserDB = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("saveSystemUserDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      "CALL usp_save_system_users(:adminRef,:userName,:email,:phone, :password,:passwordHash,:isActive,:currentTs)",
      {
        adminRef: resolvedResult.adminRef,
        userName: resolvedResult.userName,
        email: resolvedResult.email,
        phone: resolvedResult.phone,
        password: resolvedResult.password,
        passwordHash: resolvedResult.passwordHash,
        isActive: resolvedResult.isActive,
        currentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `saveSystemUserDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    var result = rows[0][0][0] ? rows[0][0][0] : null;
    return result;
  } catch (errsaveSystemUserDB) {
    logger.logInfo(
      `saveSystemUserDB() :: Error :: ${JSON.stringify(errsaveSystemUserDB)}`
    );
    var errorCode = null;
    var errorMessage = null;
    if (
      errsaveSystemUserDB.sqlState &&
      errsaveSystemUserDB.sqlState == constant.ErrorCode.Invalid_User
    ) {
      errorCode = constant.ErrorCode.Invalid_User;
      errorMessage = constant.ErrorMessage.Invalid_User;
    } else if (
      errsaveSystemUserDB.sqlState &&
      errsaveSystemUserDB.sqlState ==
        constant.ErrorCode.Invalid_User_Name_Or_Password
    ) {
      errorCode = constant.ErrorCode.Invalid_User_Name_Or_Password;
      errorMessage = constant.ErrorMessage.Invalid_User_Name_Or_Password;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode
    );
    throw functionContext.error;
  }
};

module.exports.getAdminComponentsDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("getAdminComponentsDB() Invoked!");

  logger.logInfo(
    `getAdminComponentsDB() :: CALL usp_get_admin_components('${functionContext.userRef}','${resolvedResult.componentType}')`
  );

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_get_admin_components('${functionContext.userRef}','${resolvedResult.componentType}')`
    );

    logger.logInfo(
      `getAdminComponentsDB() :: Data Saved Successfully${JSON.stringify(
        result[0][0]
      )}`
    );
    return {
      ComponentDetails: result[0][0],
    };
  } catch (errgetAdminComponentsDB) {
    logger.logInfo(
      `getAdminComponentsDB() :: Error :: ${JSON.stringify(
        errgetAdminComponentsDB
      )}`
    );
    var errorCode = null;
    var errorMessage = null;
    if (
      errgetAdminComponentsDB.sqlState &&
      errgetAdminComponentsDB.sqlState == constant.ErrorCode.Invalid_User
    ) {
      errorCode = constant.ErrorCode.Invalid_User;
      errorMessage = constant.ErrorMessage.Invalid_User;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode,
      JSON.stringify(errgetAdminComponentsDB)
    );
    throw functionContext.error;
  }
};

module.exports.getAdminComponentListInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("getAdminComponentListInDB() Invoked!");

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_get_admin_components('${functionContext.userRef}','${resolvedResult.componentType}')`
    );

    logger.logInfo(
      `getAdminComponentListInDB() :: Data Saved Successfully${JSON.stringify(
        result[0]
      )}`
    );
    return result[0];
  } catch (errSaveDeliveryDetailsInDB) {
    logger.logInfo(
      `saveDeliveryDetailsInDB() :: Error :: ${JSON.stringify(
        errSaveDeliveryDetailsInDB
      )}`
    );
    var errorCode = null;
    var errorMessage = null;
    if (
      errSaveDeliveryDetailsInDB.sqlState &&
      errSaveDeliveryDetailsInDB.sqlState == constant.ErrorCode.Invalid_User
    ) {
      errorCode = constant.ErrorCode.Invalid_User;
      errorMessage = constant.ErrorMessage.Invalid_User;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode,
JSON.stringify(errSaveDeliveryDetailsInDB)
    );
    throw functionContext.error;
  }
};

module.exports.getAdminComponentDetailsInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("getAdminComponentDetailsInDB() Invoked!");

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_get_admin_components_details('${resolvedResult.componentType}','${resolvedResult.componentRef}')`
    );

    logger.logInfo(
      `getAdminComponentDetailsInDB() :: Data Saved Successfully${JSON.stringify(
        result[0]
      )}`
    );
    return result[0];
  } catch (errGetAdminComponentsDetailsInDB) {
    logger.logInfo(
      `getAdminComponentInDB() :: Error :: ${JSON.stringify(
        errGetAdminComponentsDetailsInDB
      )}`
    );
    var errorCode = null;
    var errorMessage = null;
    if (
      errGetAdminComponentsDetailsInDB.sqlState &&
      errGetAdminComponentsDetailsInDB.sqlState ==
        constant.ErrorCode.Invalid_User
    ) {
      errorCode = constant.ErrorCode.Invalid_User;
      errorMessage = constant.ErrorMessage.Invalid_User;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode,
JSON.stringify(errGetAdminComponentsDetailsInDB)
    );
    throw functionContext.error;
  }
};

module.exports.ValidateDeleteAdminComponentListInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("ValidatedeleteAdminComponentListInDB() Invoked!");

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_validate_delete_admin_components('${
        functionContext.userRef
      }','${resolvedResult.componentType}','${JSON.stringify(
        resolvedResult.componentList
      )}')`
    );

    logger.logInfo(
      `ValidatedeleteAdminComponentListInDB() :: Data Saved Successfully${JSON.stringify(
        result[0][0]
      )}`
    );
    return result[0][0];
  } catch (errValidatedeleteAdminComponentListInDB) {
    logger.logInfo(
      `ValidatedeleteAdminComponentListInDB() :: Error :: ${JSON.stringify(
        errValidatedeleteAdminComponentListInDB
      )}`
    );
    var errorCode = null;
    var errorMessage = null;
    if (
      errValidatedeleteAdminComponentListInDB.sqlState &&
      errValidatedeleteAdminComponentListInDB.sqlState ==
        constant.ErrorCode.Invalid_User
    ) {
      errorCode = constant.ErrorCode.Invalid_User;
      errorMessage = constant.ErrorMessage.Invalid_User;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode,
      JSON.stringify(errValidatedeleteAdminComponentListInDB)
    );
    throw functionContext.error;
  }
};

module.exports.deleteAdminComponentListInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("deleteAdminComponentListInDB() Invoked!");

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_delete_admin_components('${functionContext.userRef}','${
        resolvedResult.componentType
      }','${JSON.stringify(resolvedResult.componentList)}')`
    );

    logger.logInfo(
      `deleteAdminComponentListInDB() :: Data Saved Successfully${JSON.stringify(
        result[0][0]
      )}`
    );
    return result[0][0];
  } catch (errdeleteAdminComponentListInDB) {
    logger.logInfo(
      `deleteAdminComponentListInDB() :: Error :: ${JSON.stringify(
        errdeleteAdminComponentListInDB
      )}`
    );
    var errorCode = null;
    var errorMessage = null;
    if (
      errdeleteAdminComponentListInDB.sqlState &&
      errdeleteAdminComponentListInDB.sqlState ==
        constant.ErrorCode.Invalid_User
    ) {
      errorCode = constant.ErrorCode.Invalid_User;
      errorMessage = constant.ErrorMessage.Invalid_User;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode,
JSON.stringify(errdeleteAdminComponentListInDB)
    );
    throw functionContext.error;
  }
};

module.exports.validateRequest = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("validateRequest() Invoked!");

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_validate_request('${resolvedResult.apiUri}','${resolvedResult.authToken}')`
    );
    logger.logInfo("validateRequest() :: Api validanted Successfully");
    return result[0][0][0];
  } catch (errValidateRequest) {
    logger.logInfo(
      `validateRebbquest() :: Error :: ${JSON.stringify(errValidateRequest)}`
    );
    var errorCode = null;
    var errorMessage = null;

    if (
      errValidateRequest.sqlState &&
      errValidateRequest.sqlState == constant.ErrorCode.Invalid_Request_Url
    ) {
      errorCode = constant.ErrorCode.Invalid_Request_Url;
      errorMessage = constant.ErrorMessage.Invalid_Request_Url;
    } else if (
      errValidateRequest.sqlState &&
      errValidateRequest.sqlState == constant.ErrorCode.Invalid_User_Credentials
    ) {
      errorCode = constant.ErrorCode.Invalid_User_Credentials;
      errorMessage = constant.ErrorMessage.Invalid_User_Credentials;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode,
      JSON.stringify(errValidateRequest)
    );
    throw functionContext.error;
  }
};

module.exports.registerDeviceTokenInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("registerDeviceTokenInDB() Invoked!");

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_register_device_token('${functionContext.userRef}','${resolvedResult.deviceToken}',${resolvedResult.appType},${functionContext.userType},'${functionContext.currentTs}')`
    );

    logger.logInfo(
      "registerDeviceTokenInDB() :: Device Token Registered Successfully"
    );
    return result;
  } catch (errRegisterDeviceTokenInDB) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
      JSON.stringify(errRegisterDeviceTokenInDB)
    );
    logger.logInfo(
      `registerDeviceTokenInDB() :: Error :: ${JSON.stringify(
        errRegisterDeviceTokenInDB
      )}`
    );
    throw functionContext.error;
  }
};

module.exports.userLogoutInDB = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("userLogoutInDB() Invoked!");

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_user_logout('${resolvedResult.userRef}',${functionContext.userType},'${functionContext.currentTs}')`
    );

    logger.logInfo("userLogoutInDB() :: User Logged out Successfully");
    return result;
  } catch (errUserLogout) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
      JSON.stringify(errUserLogout)
    );
    logger.logInfo(
      `userLogoutInDB() :: Error :: ${JSON.stringify(errUserLogout)}`
    );
    throw functionContext.error;
  }
};

module.exports.checkIfUserIsPresentInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("checkIfUserIsPresentInDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_is_customer_present('${functionContext.customerRef}',${resolvedResult.loginType},'${resolvedResult.email}','${resolvedResult.phone}','${resolvedResult.currentTimestamp}')`
    );
    logger.logInfo(
      `checkIfUserIsPresentInDB() ::Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    var result = rows[0][0][0] ? rows[0][0][0] : null;
    return result;
  } catch (errCheckIfUserPresentInDB) {
    logger.logInfo(
      `checkIfUserPresentInDB() :: Error :: ${JSON.stringify(
        errCheckIfUserPresentInDB
      )}`
    );
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
      JSON.stringify(errCheckIfUserPresentInDB)
    );

    throw functionContext.error;
  }
};

module.exports.saveMediaDB = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("saveMediaDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_save_media('${JSON.stringify(resolvedResult)}')`
    );
    logger.logInfo(
      `saveMediaDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    var result = rows[0][0] ? rows[0][0] : null;
    return result;
  } catch (errsaveMediaDB) {
    logger.logInfo(
      `saveMediaDB() :: Error :: ${JSON.stringify(errsaveMediaDB)}`
    );

    functionContext.error = new coreRequestModel.ErrorModel(
      (errorMessage = constant.ErrorMessage.ApplicationError),
      (errorCode = constant.ErrorCode.ApplicationError),
      {
        sqlMessage: errsaveMediaDB.sqlMessage,
        stack: errsaveMediaDB.stack,
      }
    );
    throw functionContext.error;
  }
};

module.exports.savePlaylistDB = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("savePlaylistDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_save_playlist('${JSON.stringify(resolvedResult)}')`
    );
    logger.logInfo(
      `savePlaylistDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    var result = rows[0][0][0] ? rows[0][0][0] : null;
    return result;
  } catch (errsavePlaylistDB) {
    logger.logInfo(
      `savePlaylistDB() :: Error :: ${JSON.stringify(errsavePlaylistDB)}`
    );

    functionContext.error = new coreRequestModel.ErrorModel(
      (errorMessage = constant.ErrorMessage.ApplicationError),
      (errorCode = constant.ErrorCode.ApplicationError),
      {
        sqlMessage: errsavePlaylistDB.sqlMessage,
        stack: errsavePlaylistDB.stack,
      }
    );
    throw functionContext.error;
  }
};

module.exports.saveScheduleDB = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("saveScheduleDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_save_schedule('${JSON.stringify(resolvedResult)}')`
    );
    logger.logInfo(
      `saveScheduleDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    var result = rows[0][0][0] ? rows[0][0][0] : null;
    return result;
  } catch (errsaveScheduleDB) {
    logger.logInfo(
      `saveScheduleDB() :: Error :: ${JSON.stringify(errsaveScheduleDB)}`
    );

    functionContext.error = new coreRequestModel.ErrorModel(
      (errorMessage = constant.ErrorMessage.ApplicationError),
      (errorCode = constant.ErrorCode.ApplicationError),
      {
        sqlMessage: errsaveScheduleDB.sqlMessage,
        stack: errsaveScheduleDB.stack,
      }
    );
    throw functionContext.error;
  }
};

module.exports.saveMonitorDB = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("saveMonitorDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_save_monitor('${JSON.stringify(resolvedResult)}')`
    );
    logger.logInfo(
      `saveMonitorDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    var result = rows[0][0][0] ? rows[0][0][0] : null;
    return result;
  } catch (errsaveMonitorDB) {
    logger.logInfo(
      `saveMonitorDB() :: Error :: ${JSON.stringify(errsaveMonitorDB)}`
    );

    functionContext.error = new coreRequestModel.ErrorModel(
      (errorMessage = constant.ErrorMessage.ApplicationError),
      (errorCode = constant.ErrorCode.ApplicationError),
      {
        sqlMessage: errsaveMonitorDB.sqlMessage,
        stack: errsaveMonitorDB.stack,
      }
    );
    throw functionContext.error;
  }
};

module.exports.fetchMonitorDetailsRequest = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("fetchMonitorDetailsRequest() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_fetch_monitor_details('${resolvedResult.monitorRef}')`
    );
    logger.logInfo(
      `fetchMonitorDetailsRequest() :: Returned Result :: ${JSON.stringify(
        rows[0]
      )}`
    );
    var result = rows[0] ? rows[0] : null;
    return result;
  } catch (errFetchMonitorDetailsDB) {
    logger.logInfo(
      `errFetchMonitorDetailsDB() :: Error :: ${JSON.stringify(
        errFetchMonitorDetailsDB
      )}`
    );

    functionContext.error = new coreRequestModel.ErrorModel(
      (errorMessage = constant.ErrorMessage.ApplicationError),
      (errorCode = constant.ErrorCode.ApplicationError),
      {
        sqlMessage: errsaveMonitorDB.sqlMessage,
        stack: errsaveMonitorDB.stack,
      }
    );
    throw functionContext.error;
  }
};

module.exports.monitorLoginDB = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("monitorLoginDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_monitor_login('${resolvedResult.monitorUser}','${resolvedResult.password}','${functionContext.currentTs}')`
    );
    logger.logInfo(
      `monitorLoginDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    var result = rows[0][0][0] ? rows[0][0][0] : null;
    return result;
  } catch (errMonitorLoginDB) {
    logger.logInfo(
      `MonitorLoginDB() :: Error :: ${JSON.stringify(errMonitorLoginDB)}`
    );
    var errorCode = null;
    var errorMessage = null;
    if (
      errMonitorLoginDB.sqlState &&
      errMonitorLoginDB.sqlState == constant.ErrorCode.Invalid_User
    ) {
      errorCode = constant.ErrorCode.Invalid_User;
      errorMessage = constant.ErrorMessage.Invalid_User;
    } else if (
      errMonitorLoginDB.sqlState &&
      errMonitorLoginDB.sqlState ==
        constant.ErrorCode.Invalid_User_Name_Or_Password
    ) {
      errorCode = constant.ErrorCode.Invalid_User_Name_Or_Password;
      errorMessage = constant.ErrorMessage.Invalid_User_Name_Or_Password;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode
    );
    throw functionContext.error;
  }
};

module.exports.updateAllMonitorInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("updateAllMonitorInDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_update_all_monitors('${JSON.stringify(
        resolvedResult.monitorList
      )}','${resolvedResult.playlistRef}')`
    );
    logger.logInfo(
      `updateAllMonitorInDB() :: Returned Result :: ${JSON.stringify(rows[0])}`
    );
    var result = rows[0][0] ? rows[0][0] : null;
    return result;
  } catch (errUpdateAllMonitors) {
    logger.logInfo(
      `errUpdateAllMonitors() :: Error :: ${JSON.stringify(
        errUpdateAllMonitors
      )}`
    );
    var errorCode = null;
    var errorMessage = null;
    if (
      errMonitorLoginDB.sqlState &&
      errMonitorLoginDB.sqlState == constant.ErrorCode.Invalid_User
    ) {
      errorCode = constant.ErrorCode.Invalid_User;
      errorMessage = constant.ErrorMessage.Invalid_User;
    } else if (
      errMonitorLoginDB.sqlState &&
      errMonitorLoginDB.sqlState ==
        constant.ErrorCode.Invalid_User_Name_Or_Password
    ) {
      errorCode = constant.ErrorCode.Invalid_User_Name_Or_Password;
      errorMessage = constant.ErrorMessage.Invalid_User_Name_Or_Password;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode
    );
    throw functionContext.error;
  }
};

module.exports.fetchMediaFromDB = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("fetchMediaFromDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_fetch_media('${resolvedResult.mediaRef}')`
    );
    logger.logInfo(
      `fetchMediaFromDB() :: Returned Result :: ${JSON.stringify(rows[0])}`
    );
    var result = rows[0][0][0] ? rows[0][0][0] : null;
    return result;
  } catch (errFetchMediaFromDB) {
    logger.logInfo(
      `errFetchMediaFromDB() :: Error :: ${JSON.stringify(errFetchMediaFromDB)}`
    );

    functionContext.error = new coreRequestModel.ErrorModel(
      (errorMessage = constant.ErrorMessage.ApplicationError),
      (errorCode = constant.ErrorCode.ApplicationError),
      {
        sqlMessage: errsaveMonitorDB.sqlMessage,
        stack: errsaveMonitorDB.stack,
      }
    );
    throw functionContext.error;
  }
};
