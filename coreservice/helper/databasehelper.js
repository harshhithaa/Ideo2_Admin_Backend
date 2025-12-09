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
    // Log what we're trying to delete
    logger.logInfo(
      `deleteAdminComponentListInDB() :: ComponentType: ${resolvedResult.componentType}`
    );
    logger.logInfo(
      `deleteAdminComponentListInDB() :: ComponentList: ${JSON.stringify(resolvedResult.componentList)}`
    );
    logger.logInfo(
      `deleteAdminComponentListInDB() :: UserRef: ${functionContext.userRef}`
    );

    // Convert componentList to JSON string for the stored procedure
    const componentListJson = JSON.stringify(resolvedResult.componentList);

    // First, let's check what's actually in the schedules table for this ID
    if (resolvedResult.componentType === 3) {
      for (let scheduleId of resolvedResult.componentList) {
        const checkQuery = `SELECT * FROM schedules WHERE Id = ${scheduleId}`;
        logger.logInfo(`deleteAdminComponentListInDB() :: Check query: ${checkQuery}`);

        const existingSchedule = await databaseModule.knex.raw(checkQuery);
        logger.logInfo(
          `deleteAdminComponentListInDB() :: Found schedule: ${JSON.stringify(existingSchedule[0])}`
        );
      }
    }

    // Now execute the stored procedure with the correct parameters
    let result = await databaseModule.knex.raw(
      `CALL usp_delete_admin_components(?, ?, ?)`,
      [
        functionContext.userRef,  // paramAdminRef
        resolvedResult.componentType,  // paramComponentType
        componentListJson  // paramComponentList as JSON string
      ]
    );

    logger.logInfo(
      `deleteAdminComponentListInDB() :: SP Result: ${JSON.stringify(result[0])}`
    );

    // Extract affected rows from the stored procedure result
    let affectedRows = 0;
    let processedCount = 0;
    
    if (result && result[0] && result[0][0]) {
      affectedRows = result[0][0].affectedRows || 0;
      processedCount = result[0][0].processedCount || 0;
    }

    logger.logInfo(
      `deleteAdminComponentListInDB() :: Affected Rows: ${affectedRows}, Processed Count: ${processedCount}`
    );

    // Check if schedule still exists after deletion (for verification)
    if (resolvedResult.componentType === 3) {
      for (let scheduleId of resolvedResult.componentList) {
        const afterCheckQuery = `SELECT * FROM schedules WHERE Id = ${scheduleId}`;
        const afterCheck = await databaseModule.knex.raw(afterCheckQuery);
        logger.logInfo(
          `deleteAdminComponentListInDB() :: After deletion, schedule exists: ${JSON.stringify(afterCheck[0])}`
        );
        
        // If schedule still exists after deletion, throw error
        if (afterCheck[0] && afterCheck[0].length > 0) {
          throw new Error(`Failed to delete schedule ID ${scheduleId} - Record still exists in database`);
        }
      }
    }

    logger.logInfo(
      `deleteAdminComponentListInDB() :: Successfully deleted ${affectedRows} items`
    );

    return {
      success: true,
      affectedRows: affectedRows,
      processedCount: processedCount
    };

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
      errdeleteAdminComponentListInDB.message || JSON.stringify(errdeleteAdminComponentListInDB)
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
    // ✅ Convert payload to JSON string for stored procedure
    const mediaJSON = JSON.stringify(resolvedResult);

    logger.logInfo(
      `saveMediaDB() :: Calling usp_save_media with JSON :: ${mediaJSON}`
    );

    // ✅ Call stored procedure with JSON parameter
    let rows = await databaseModule.knex.raw(
      `CALL usp_save_media(?)`,
      [mediaJSON]
    );

    logger.logInfo(
      `saveMediaDB() :: Returned Result :: ${JSON.stringify(rows[0])}`
    );

    // ✅ The stored procedure returns the inserted media records
    var result = rows[0] && rows[0][0] ? rows[0][0] : [];
    
    if (!result || result.length === 0) {
      logger.logInfo(`saveMediaDB() :: WARNING - No result returned from stored procedure`);
    } else {
      logger.logInfo(`saveMediaDB() :: Successfully inserted ${result.length} media records`);
    }

    return result;
  } catch (errsaveMediaDB) {
    logger.logInfo(
      `saveMediaDB() :: Error :: ${JSON.stringify({
        message: errsaveMediaDB.message,
        sqlMessage: errsaveMediaDB.sqlMessage,
        sqlState: errsaveMediaDB.sqlState,
        sql: errsaveMediaDB.sql
      })}`
    );

    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
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

module.exports.getAdminComponentsWithPaginationDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("getAdminComponentsWithPaginationDB() Invoked!");

  const {
    componentType,
    searchText,
    mediaType,
    isActive,
    userId,  // This should now contain the logged-in user's ID
    pageNumber,
    pageSize
  } = resolvedResult;

  logger.logInfo(
    `getAdminComponentsWithPaginationDB() :: Parameters: componentType=${componentType}, userId=${userId}, pageNumber=${pageNumber}, pageSize=${pageSize}`
  );

  logger.logInfo(
    `getAdminComponentsWithPaginationDB() :: CALL usp_list_admin_components(${componentType}, '${searchText || ''}', ${mediaType ? `'${mediaType}'` : 'NULL'}, ${isActive !== null && isActive !== undefined ? isActive : 'NULL'}, ${userId || 'NULL'}, ${pageNumber || 1}, ${pageSize || 10})`
  );

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_list_admin_components(?, ?, ?, ?, ?, ?, ?)`,
      [
        componentType,
        searchText || '',
        mediaType || null,
        isActive !== null && isActive !== undefined ? isActive : null,
        userId || null,  // Logged-in user ID
        pageNumber || 1,
        pageSize || 10
      ]
    );

    logger.logInfo(
      `getAdminComponentsWithPaginationDB() :: Raw result structure: ${JSON.stringify(result[0])}`
    );

    const resultData = result[0][0] || [];

    logger.logInfo(
      `getAdminComponentsWithPaginationDB() :: Success - Retrieved ${resultData.length} records for userId: ${userId}`
    );

    return resultData;
  } catch (errgetAdminComponentsWithPaginationDB) {
    logger.logInfo(
      `getAdminComponentsWithPaginationDB() :: Exception Occurred: ${errgetAdminComponentsWithPaginationDB.message}`
    );
    logger.logInfo(
      `getAdminComponentsWithPaginationDB() :: Exception Stack: ${errgetAdminComponentsWithPaginationDB.stack}`
    );

    var errorCode = constant.ErrorCode.ApplicationError;
    var errorMessage = constant.ErrorMessage.ApplicationError;

    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode,
      errgetAdminComponentsWithPaginationDB.message
    );

    throw functionContext.error;
  }
};

module.exports.updateMonitorStatus = async (functionContext, requestContext) => {
  var logger = functionContext.logger;
  logger.logInfo("updateMonitorStatus() Invoked!");

  try {
    const query = `
      INSERT INTO monitor_heartbeat 
      (MonitorRef, LastHeartbeat, Status, CurrentMedia, CurrentPlaylist, UpdatedAt)
      VALUES (?, NOW(), ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        LastHeartbeat = NOW(),
        Status = VALUES(Status),
        CurrentMedia = VALUES(CurrentMedia),
        CurrentPlaylist = VALUES(CurrentPlaylist),
        UpdatedAt = NOW()
    `;

    await databaseModule.ExecuteQuery(
      query,
      [
        requestContext.MonitorRef,
        requestContext.Status || 'online',
        requestContext.CurrentMedia,
        requestContext.CurrentPlaylist
      ]
    );

    logger.logInfo("updateMonitorStatus() completed successfully");
    return { success: true };
  } catch (error) {
    logger.logInfo(`updateMonitorStatus() error: ${error}`);
    throw error;
  }
};

module.exports.getMonitorStatus = async (functionContext, requestContext) => {
  var logger = functionContext.logger;
  logger.logInfo("getMonitorStatus() Invoked!");

  try {
    const query = `
      SELECT 
        MonitorRef,
        LastHeartbeat,
        Status,
        CurrentMedia,
        CurrentPlaylist,
        TIMESTAMPDIFF(SECOND, LastHeartbeat, NOW()) as SecondsSinceLastHeartbeat
      FROM monitor_heartbeat
      WHERE MonitorRef = ?
    `;

    const result = await databaseModule.ExecuteQuery(query, [requestContext.MonitorRef]);

    if (result && result.length > 0) {
      logger.logInfo(`getMonitorStatus() :: Found status: ${JSON.stringify(result[0])}`);
      return result[0];
    }

    logger.logInfo("getMonitorStatus() :: No status found");
    return null;
  } catch (error) {
    logger.logInfo(`getMonitorStatus() error: ${error}`);
    throw error;
  }
};