var databaseModule = require("../database/database");
var coreRequestModel = require("../models/coreServiceModel");
var constant = require("../common/constant");
var general = require("./general");


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

  logger.logInfo(`getAdminComponentsDB() :: CALL usp_get_admin_components('${functionContext.userRef}','${resolvedResult.componentType}')`);

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_get_admin_components('${functionContext.userRef}','${resolvedResult.componentType}')`
    );

    logger.logInfo(`getAdminComponentsDB() :: Data Saved Successfully${JSON.stringify(
        result[0][0]
      )}`);
     return {
      ComponentDetails: result[0][0]
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
      JSON.stringify(errSaveRestaurantItemDetailsDB)
    );
    throw functionContext.error;
  }
};

module.exports.getCustomerDetailsFromDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("getCustomerDetailsFromDB() Invoked!");
  logger.logInfo(
    `getCustomerDetailsFromDB() :: CALL usp_get_customer_details('${resolvedResult.customerRef}')'`
  );
  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_get_customer_details('${resolvedResult.customerRef}')`
    );
    var dbResult = result[0][0][0] ? result[0][0][0] : null;
    logger.logInfo(
      `getCustomerDetailsFromDB() :: Returned Result :: ${JSON.stringify(
        dbResult
      )}`
    );
    return dbResult;
  } catch (errGetCustomerDetailsFromDB) {
    logger.logInfo(
      `getCustomerDetailsFromDB() :: Error :: ${JSON.stringify(
        errGetCustomerDetailsFromDB
      )}`
    );
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
      JSON.stringify(errGetCustomerDetailsFromDB)
    );
    throw functionContext.error;
  }
};

module.exports.getCustomerAddressListDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("getCustomerAddressListDB() Invoked!");

  logger.logInfo(
    `getCustomerAddressListDB() :: CALL usp_get_customer_address_list('${resolvedResult.customerRef}')'`
  );
  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_get_customer_address_list('${resolvedResult.customerRef}')`
    );
    logger.logInfo(
      `usp_get_customer_address_list() :: Returned Result :: ${JSON.stringify(
        result[0][0]
      )}`
    );
    return result[0][0];
  } catch (errgetCustomerAddressListDB) {
    logger.logInfo(
      `getCustomerAddressListDB() :: Error :: ${JSON.stringify(
        errgetCustomerAddressListDB
      )}`
    );
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
      JSON.stringify(errgetCustomerAddressListDB)
    );

    throw functionContext.error;
  }
};

module.exports.updateCustomerDetails = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("updateCustomerDetails() Invoked!");

  logger.logInfo(
    `updateCustomerDetails() :: CALL usp_update_customer_details('${resolvedResult.customerRef}','${resolvedResult.firstName}','${resolvedResult.lastName}','${resolvedResult.dateOfBirth}','${resolvedResult.phone},'${resolvedResult.email}','${functionContext.currentTs}')'`
  );
  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_update_customer_details('${resolvedResult.customerRef}','${resolvedResult.firstName}','${resolvedResult.lastName}','${resolvedResult.dateOfBirth}','${resolvedResult.phone}','${resolvedResult.email}','${functionContext.currentTs}')`
    );
    logger.logInfo(
      `updateCustomerDetails() :: Returned Result :: ${JSON.stringify(
        result[0][0][0]
      )}`
    );
    return result[0][0][0];
  } catch (errUpdateCustomerDetails) {
    logger.logInfo(
      `updateCustomerDetails() :: Error :: ${JSON.stringify(
        errUpdateCustomerDetails
      )}`
    );
    var errorCode = null;
    var errorMessage = null;

    if (
      errUpdateCustomerDetails.sqlState &&
      errUpdateCustomerDetails.sqlState ==
        constant.ErrorCode.Phone_Already_In_Use
    ) {
      errorCode = constant.ErrorCode.Phone_Already_In_Use;
      errorMessage = constant.ErrorMessage.Phone_Already_In_Use;
    } else if (
      errUpdateCustomerDetails.sqlState &&
      errUpdateCustomerDetails.sqlState ==
        constant.ErrorCode.Email_Already_In_Use
    ) {
      errorCode = constant.ErrorCode.Email_Already_In_Use;
      errorMessage = constant.ErrorMessage.Email_Already_In_Use;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode,
      JSON.stringify(errUpdateCustomerDetails)
    );
    throw functionContext.error;
  }
};

// ///////////////////////// DELETE MONITORS /////////////////////////////////////////

module.exports.SaveScreensUDELInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo(`SaveScreensUDELInDB() invoked`);
  try {
    let result = await databaseModule.knex.raw(
      "CALL usp_delete_monitor(:MonitorName)",
      {        
          MonitorName: resolvedResult.MonitorName
      }
    );

    logger.logInfo(`SaveScreensUDELInDB() :: Address Saved Successfully`);
    return result;
  } catch (errSaveScreensUDEL) {
    logger.logInfo(
      `SaveScreensUDELInDB():: Error:: ${JSON.stringify(
          errSaveScreensUDEL
      )}`
    );
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
      JSON.stringify(errSaveScreensUDEL)
    );
    throw errSaveScreensUDEL;
  }
};


// ////////////////////////// update monitor ////////////////////////////////////////

module.exports.SaveScreensUInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo(`SaveScreensUInDB() invoked`);
  try {
    let result = await databaseModule.knex.raw(
      "CALL USP_update_monitors(:MonitorName,:ScheduleId,:CreatedOn)",
      {
          MonitorName: resolvedResult.MonitorName,
          ScheduleId: resolvedResult.ScheduleId,
          CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(`SaveScreensUInDB() :: Address Saved Successfully`);
    return result;
  } catch (errSaveScreensU) {
    logger.logInfo(
      `SaveScreensUInDB():: Error:: ${JSON.stringify(
          errSaveScreensU
      )}`
    );
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
      JSON.stringify(errSaveScreensU)
    );
    throw errSaveScreensU;
  }
};
// ///////////////////////////////////////////////////////////////////////////////

module.exports.SaveScreensInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo(`SaveScreensInDB() invoked`);
  try {
    let result = await databaseModule.knex.raw(
      "CALL usp_save_monitors(:MonitorRef, :MonitorName, :MonitorDescription, :ScheduleId, :DefaultPlaylistId, :UserId, :CreatedOn)",
      {
          MonitorRef: resolvedResult.MonitorRef,
          MonitorName: resolvedResult.MonitorName,
          MonitorDescription: resolvedResult.MonitorDescription,
          ScheduleId: resolvedResult.ScheduleId,
          DefaultPlaylistId: resolvedResult.DefaultPlaylistId,
          UserId: resolvedResult.Customer,
          CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(`SaveScreensInDB() :: Address Saved Successfully`);
    return result;
  } catch (errSaveScreens) {
    logger.logInfo(
      `SaveScreensInDB():: Error:: ${JSON.stringify(
          errSaveScreens
      )}`
    );
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
      JSON.stringify(errSaveScreens)
    );
    throw errSaveScreens;
  }
};




module.exports.saveCustomerAddressInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo(`saveCustomerAddressInDB() invoked`);
  try {
    let result = await databaseModule.knex.raw(
      "CALL usp_save_customer_address(:customerRef,:addressRef,:address1,:address2, :city,:state,:pincode,:latitude,:longitude,:addressNickName,:currentTs)",
      {
        customerRef: resolvedResult.customerRef,
        addressRef: resolvedResult.addressRef,
        address1: resolvedResult.address1,
        address2: resolvedResult.address2,
        city: resolvedResult.city,
        state: resolvedResult.state,
        pincode: resolvedResult.pincode,
        latitude: resolvedResult.latitude,
        longitude: resolvedResult.longitude,
        addressNickName: resolvedResult.addressNickName,
        currentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(`saveCustomerAddressInDB() :: Address Saved Successfully`);
    return result;
  } catch (errsaveCustomerAddress) {
    logger.logInfo(
      `saveCustomerAddressInDB():: Error:: ${JSON.stringify(
        errsaveCustomerAddress
      )}`
    );
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
      JSON.stringify(errsaveCustomerAddress)
    );
    throw errsaveCustomerAddress;
  }
};

module.exports.getRestaurantsListFromDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("getRestaurantsListFromDB() Invoked!");
  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_get_restaurants_list()`
    );
    logger.logInfo(
      `getRestaurantsListFromDB() :: Returned Result ::${JSON.stringify(
        result[0][0]
      )}`
    );

    return { restaurantList: result[0][0], restaurantImages: result[0][1] };
  } catch (errgetCustomerAddressListDB) {
    logger.logInfo(
      `getRestaurantsListFromDB() :: Error :: ${JSON.stringify(
        errgetCustomerAddressListDB
      )}`
    );
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
      JSON.stringify(errgetCustomerAddressListDB)
    );
    throw functionContext.error;
  }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 // Get Packages //

module.exports.getPackageDetailsDB = async (
    functionContext,
    resolvedResult
  ) => {
    var logger = functionContext.logger;
    logger.logInfo("getPackageDetailsDB() Invoked!");
  
    logger.logInfo(
      `getPackageDetailsDB() :: CALL usp_get_packages()'`
    );
    try {
      let result = await databaseModule.knex.raw(
        `CALL usp_get_packages()`
      );
      logger.logInfo(
        `getPackageDetailsDB() :: Returned Result :: ${JSON.stringify(
          result[0][0]
        )}`
      );
      return result[0][0];
    } catch (errgetPackageDetailsDB) {
      var errorCode = null;
      var errorMessage = null;
  
      if (
        errgetPackageDetailsDB.sqlState &&
        errgetPackageDetailsDB.sqlState ==
          constant.ErrorCode.Invalid_Package_Ref
      ) {
        errorCode = constant.ErrorCode.Invalid_Package_Ref;
        errorMessage = constant.ErrorMessage.Invalid_Package_Ref;
      } else {
        errorCode = constant.ErrorCode.ApplicationError;
        errorMessage = constant.ErrorMessage.ApplicationError;
      }
  
      functionContext.error = new coreRequestModel.ErrorModel(
        errorMessage,
        errorCode,
        JSON.stringify(errgetPackageDetailsDB)
      );
  
      logger.logInfo(
        `getPackageDetailsDB() :: Error :: ${JSON.stringify(
            errgetPackageDetailsDB
        )}`
      );
  
      throw functionContext.error;
    }
  };
                                                      

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// GET Monitors



module.exports.getMonitorItemDetailsDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("getMonitorItemDetailsDB() Invoked!");

  logger.logInfo(
    `getMonitorItemDetailsDB() :: CALL usp_get_monitors()'`
  );
  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_get_monitors('${functionContext.customerRef}')`
    );
    logger.logInfo(
      `getMonitorItemDetailsDB() :: Returned Result :: ${JSON.stringify(
        result[0][0]
      )}`
    );
    return result[0][0];
  } catch (errgetMonitorItemDetailsDB) {
    var errorCode = null;
    var errorMessage = null;

    if (
      errgetMonitorItemDetailsDB.sqlState &&
      errgetMonitorItemDetailsDB.sqlState ==
        constant.ErrorCode.Invalid_Restaurant_Ref
    ) {
      errorCode = constant.ErrorCode.Invalid_Restaurant_Ref;
      errorMessage = constant.ErrorMessage.Invalid_Restaurant_Ref;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }

    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode,
      JSON.stringify(errgetMonitorItemDetailsDB)
    );

    logger.logInfo(
      `getMonitorItemDetailsDB() :: Error :: ${JSON.stringify(
          errgetMonitorItemDetailsDB
      )}`
    );

    throw functionContext.error;
  }
};




// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.saveScheduleDetailsInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("saveDeliveryDetailsInDB() Invoked!");

  logger.logInfo(`saveDeliveryDetailsInDB() :: CALL usp_save_delivery_details('${
    resolvedResult.name
  }',
		'${resolvedResult.description}',
											'${resolvedResult.deliveryItemDetails.toString({ pretty: true })}',
                      '${resolvedResult.customer}',
											'${resolvedResult.currentTs}',
										'${resolvedResult.scheduleRef}'
										
											)`);

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_save_schedule_details('${resolvedResult.name}',
											'${resolvedResult.description}',
											'${resolvedResult.deliveryItemDetails.toString({ pretty: true })}',
                      '${resolvedResult.customer}',
											'${resolvedResult.currentTs}',
                      	'${resolvedResult.comand}',
                        	'${resolvedResult.scheduleRef}',
                          	'${resolvedResult.days}'
										
										
											)`
    );

    logger.logInfo(`saveDeliveryDetailsInDB() :: Data Saved Successfully${JSON.stringify(
        result[0][0]
      )},${JSON.stringify(
        result[0][1]
      )}`);
    return  {
      BasicDetails: result[0][0],
      BasicDetails1: result[0][1],
    };
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
      JSON.stringify(errSaveRestaurantItemDetailsDB)
    );
    throw functionContext.error;
  }
};
module.exports.saveDeliveryDetailsInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("saveDeliveryDetailsInDB() Invoked!");

  logger.logInfo(`saveDeliveryDetailsInDB() :: CALL usp_save_delivery_details('${
    resolvedResult.name
  }',
		'${resolvedResult.description}',
											'${resolvedResult.deliveryItemDetails.toString({ pretty: true })}',
                      '${resolvedResult.customer}',
											'${resolvedResult.currentTs}',
										'${resolvedResult.PlaylistRef}'
										
											)`);

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_save_delivery_details('${resolvedResult.name}',
											'${resolvedResult.description}',
											'${resolvedResult.deliveryItemDetails.toString({ pretty: true })}',
                      '${resolvedResult.customer}',
											'${resolvedResult.currentTs}',
                      	'${resolvedResult.comand}',
                        	'${resolvedResult.PlaylistRef}'
										
										
											)`
    );

    logger.logInfo(`saveDeliveryDetailsInDB() :: Data Saved Successfully`);
    return result[0][0][0];
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
      JSON.stringify(errSaveRestaurantItemDetailsDB)
    );
    throw functionContext.error;
  }
};
module.exports.getscheduleDetailsInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("saveDeliveryDetailsInDB() Invoked!");

  logger.logInfo(`saveDeliveryDetailsInDB() :: CALL usp_save_delivery_details('${
    resolvedResult.name
  }',
		'${resolvedResult.description}',
										
                      '${resolvedResult.customer}',
											'${resolvedResult.currentTs}'
										
										
											)`);

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_get_schedules_details('${resolvedResult.name}',
											'${resolvedResult.description}',
											
                      '${resolvedResult.customer}',
											'${resolvedResult.currentTs}',
                      	'${resolvedResult.comand}'
										
										
											)`
    );

    logger.logInfo(`saveDeliveryDetailsInDB() :: Data Saved Successfully${JSON.stringify(
        result[0][0]
      )}`);
    // return result[0][0];
     return {
      BasicDetails: result[0][0],
      BasicDetails1: result[0][1],
    };
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
      JSON.stringify(errSaveRestaurantItemDetailsDB)
    );
    throw functionContext.error;
  }
};
module.exports.getPlaylistDetailsInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("saveDeliveryDetailsInDB() Invoked!");

  logger.logInfo(`saveDeliveryDetailsInDB() :: CALL usp_getcustomerappplaylist('${
    resolvedResult.scheduleRef
  }',
		'${resolvedResult.customerRef}'
										
										
											)`);

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_getcustomerappplaylist('${resolvedResult.scheduleRef}',
											'${resolvedResult.customerRef}',
                      	'${resolvedResult.currentTimestamp}'
										
										
											)`
    );

    logger.logInfo(`saveDeliveryDetailsInDB() :: Data Saved Successfully${JSON.stringify(
        result[0][0]
      )}`);
    // return result[0][0];
     return {
      BasicDetails: result[0][0],
      BasicDetails1: result[0][1],
    };
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
      JSON.stringify(errSaveRestaurantItemDetailsDB)
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
    logger. logInfo("validateRequest() :: Api validanted Successfully");
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

module.exports.getCustomerBasicInfo = async (functionContext, userRef) => {
  var logger = functionContext.logger;

  logger.logInfo("getCustomerBasicInfo() Invoked!");
  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_get_customer_basic_info('${userRef}')`
    );

    logger.logInfo(
      `getCustomerBasicInfo() :: Customer's Basic Info Fetched Successfully`
    );

    return {
      BasicDetails: result[0][0][0],
      AddressDetails: result[0][1],
    };
  } catch (errGetCustomerBasicInfo) {
    logger.logInfo(
      `getCustomerBasicInfo() :: Error :: ${JSON.stringify(
        errGetCustomerBasicInfo
      )}`
    );
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
      JSON.stringify(errGetCustomerBasicInfo)
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
//this is for admin
module.exports.checkIfcustomerandsiteIsPresentInDB = async (
  functionContext,
  resolvedResult
) => {
  
  var logger = functionContext.logger;
  
  logger.logInfo(
    `checkIfriderIsPresentInDB() Invoked! ${JSON.stringify(
      resolvedResult,
      functionContext
    )}`
  );
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_edit_customer('${functionContext.customerRef}','${functionContext.siteRef}','${functionContext.customeraddressRef}','${resolvedResult.Firstname}','${resolvedResult.Lastname}','${resolvedResult.Email}','${resolvedResult.Pin}','${resolvedResult.Phone}','${resolvedResult.Panchayat}','${resolvedResult.Buildingname}','${resolvedResult.Description}','${resolvedResult.Storey}','${resolvedResult.Condition}','${resolvedResult.TypeConstruction}','${resolvedResult.BuiltArea}','${resolvedResult.AddressofSite1}','${resolvedResult.AddressofSite2}','${resolvedResult.Toilet}','${resolvedResult.Operation}','${resolvedResult.PlotNumber}','${resolvedResult.command}','${resolvedResult.currentTimestamp}','${resolvedResult.Address1}','${resolvedResult.Address2}','${resolvedResult.City}','${resolvedResult.State}','${resolvedResult.CustomerRef}','${functionContext.siteRentRef}','${resolvedResult.Use}','${resolvedResult.OccupantName}','${resolvedResult.Amount}','${resolvedResult.CarpetArea}','${resolvedResult.Zone}')`
    );
   
    logger.logInfo(
      `checkIfUserIsPresentInDB() ::Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    logger.logInfo(
      `CALL usp_edit_customer('${functionContext.customerRef}','${functionContext.siteRef}','${functionContext.customeraddressRef}','${resolvedResult.Firstname}','${resolvedResult.Lastname}','${resolvedResult.Email}','${resolvedResult.Pin}','${resolvedResult.Phone}','${resolvedResult.Panchayat}','${resolvedResult.Buildingname}','${resolvedResult.Description}','${resolvedResult.Storey}','${resolvedResult.Condition}','${resolvedResult.TypeConstruction}','${resolvedResult.BuiltArea}','${resolvedResult.AddressofSite1}','${resolvedResult.AddressofSite2}','${resolvedResult.Toilet}','${resolvedResult.Operation}','${resolvedResult.PlotNumber}','${resolvedResult.command}','${resolvedResult.currentTimestamp}','${resolvedResult.Address1}','${resolvedResult.Address2}','${resolvedResult.City}','${resolvedResult.State}')`
    
    );
    var result = rows[0][0] ? rows[0][0] : null;
    return result;
  } catch (errCheckIfUserPresentInDB) {
    logger.logInfo(
      `checkIfUserPresentInDB() :: Error :: ${JSON.stringify(
        errCheckIfUserPresentInDB
      )}`
    );
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError
    );

    throw functionContext.error;
  }
};
module.exports.checkIfrestuserIsPresentInDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo(
    `checkIfriderIsPresentInDB() Invoked! ${JSON.stringify(
      resolvedResult,
      functionContext
    )}`
  );
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_get_taxdetails()`
    );
    logger.logInfo(
      `checkIfUserIsPresentInDB() ::Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    logger.logInfo(
      `checkIfUserIsPresentInDB() ::Returned Result :: ${JSON.stringify(
        `CALL usp_edit_restaurant_user(${resolvedResult.type},${resolvedResult.valtype},${resolvedResult.stype},${resolvedResult.maxd},${resolvedResult.maxda},${resolvedResult.maxp},${resolvedResult.maxpa},'${resolvedResult.command}','${resolvedResult.ref}','${functionContext.riderRef}','${resolvedResult.firstname}',${resolvedResult.lastname},'${resolvedResult.email}',${resolvedResult.phone},'${resolvedResult.Password}','${resolvedResult.Address1}','${resolvedResult.City}','${resolvedResult.State}',${resolvedResult.Pincode},'${resolvedResult.Address2}','${resolvedResult.currentTimestamp}')`
      )}`
    );
    var result = rows[0][0] ? rows[0][0] : null;
    return result;
  } catch (errCheckIfUserPresentInDB) {
    logger.logInfo(
      `checkIfUserPresentInDB() :: Error :: ${JSON.stringify(
        errCheckIfUserPresentInDB
      )}`
    );
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError
    );

    throw functionContext.error;
  }
};
module.exports.updatePasswordDB = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("updatePasswordDB() Invoked!");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_update_password('${functionContext.userRef}','${resolvedResult.password}','${resolvedResult.currentTimestamp}')`
    );
    logger.logInfo(
      `updatePasswordDB() ::Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    var result = rows[0][0] ? rows[0][0] : null;

    return result;
  } catch (errorupdatePasswordDB) {
    logger.logInfo(
      `updatePasswordDB() :: Error :: ${JSON.stringify(errorupdatePasswordDB)}`
    );
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError,
      JSON.stringify(errorupdatePasswordDB)
    );

    throw functionContext.error;
  }
};

module.exports.CustomerLoginAppDB = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("CustomerLoginDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_customer_loginapp('${resolvedResult.phone}','${resolvedResult.password}','${functionContext.currentTs}')`
    );
    logger.logInfo(
      `customerLoginDB() :: Returned Result :: ${JSON.stringify(rows[0][0][0])}`,
      `customerLoginDB() :: Returned Result :: ${JSON.stringify(rows[0][1])}`,
    );
   
    var result = rows[0][0][0] ? rows[0][0][0] : null;
    var result1 = rows[0][1] ? rows[0][1] : null;
    return {
      result: result,
      result1: result1,
      
    };
  } catch (errCustomerLoginDB) {
    logger.logInfo(
      `customerLoginDB() :: Error :: ${JSON.stringify(errCustomerLoginDB)}`
    );
    var errorCode = null;
    var errorMessage = null;
    if (
      errCustomerLoginDB.sqlState &&
      errCustomerLoginDB.sqlState == constant.ErrorCode.Invalid_User
    ) {
      errorCode = constant.ErrorCode.Invalid_User;
      errorMessage = constant.ErrorMessage.Invalid_User;
    } else if (
      errCustomerLoginDB.sqlState &&
      errCustomerLoginDB.sqlState ==
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
      errorCode,
      JSON.stringify(errCustomerLoginDB)
    );
    throw functionContext.error;
  }
};
module.exports.CustomerLoginDB = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("CustomerLoginDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_customer_login('${resolvedResult.phone}','${resolvedResult.password}','${functionContext.currentTs}')`
    );
    logger.logInfo(
      `customerLoginDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    var result = rows[0][0][0] ? rows[0][0][0] : null;
    return result;
  } catch (errCustomerLoginDB) {
    logger.logInfo(
      `customerLoginDB() :: Error :: ${JSON.stringify(errCustomerLoginDB)}`
    );
    var errorCode = null;
    var errorMessage = null;
    if (
      errCustomerLoginDB.sqlState &&
      errCustomerLoginDB.sqlState == constant.ErrorCode.Invalid_User
    ) {
      errorCode = constant.ErrorCode.Invalid_User;
      errorMessage = constant.ErrorMessage.Invalid_User;
    } else if (
      errCustomerLoginDB.sqlState &&
      errCustomerLoginDB.sqlState ==
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
      errorCode,
      JSON.stringify(errCustomerLoginDB)
    );
    throw functionContext.error;
  }
};
module.exports.CustomerUploadDB = async (functionContext, resolvedResult) => {
  var logger = functionContext.logger;
  logger.logInfo("CustomerLoginDB() Invoked!");
  try {

    let rows = await databaseModule.knex.raw(
      `CALL usp_customer_upload('${resolvedResult.Name}','${resolvedResult.Description}','${functionContext.Default}','${resolvedResult.Mediapath}','${resolvedResult.Type}','${resolvedResult.currentTimestamp}','${resolvedResult.customerRef}','${resolvedResult.mediaRef}','${resolvedResult.Command}')`
    );
    logger.logInfo(
      `customerLoginDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    var result = rows[0][0] ? rows[0][0] : null;
    return result;

  } catch (errCustomerLoginDB) {
    logger.logInfo(
      
      `customerLoginDB() :: Error :: ${JSON.stringify(errCustomerLoginDB)}`
    );
    var errorCode = null;
    var errorMessage = null;
    if (
      errCustomerLoginDB.sqlState &&
      errCustomerLoginDB.sqlState == constant.ErrorCode.Invalid_User
    ) {
      errorCode = constant.ErrorCode.Invalid_User;
      errorMessage = constant.ErrorMessage.Invalid_User;
    } else if (
      errCustomerLoginDB.sqlState &&
      errCustomerLoginDB.sqlState ==
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
      errorCode,
      JSON.stringify(errCustomerLoginDB)
    );
    throw functionContext.error;
  }
};

module.exports.saveMediaDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("saveMediaDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_save_media('${JSON.stringify(resolvedResult)}')`
    );
    logger.logInfo(
      `saveMediaDB() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}` 
    );
    var result = rows[0][0] ? rows[0][0] : null;
    return result;
  } catch (errsaveMediaDB) {
    logger.logInfo(
      `saveMediaDB() :: Error :: ${JSON.stringify(
        errsaveMediaDB
      )}`
    );
  
 
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage=constant.ErrorMessage.ApplicationError,
      errorCode=constant.ErrorCode.ApplicationError,
      {
        sqlMessage:errsaveMediaDB.sqlMessage,
        stack:errsaveMediaDB.stack,
      }
    );
    throw functionContext.error;
  }
};

module.exports.savePlaylistDB = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;
  logger.logInfo("savePlaylistDB() Invoked!");
  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_save_playlist('${JSON.stringify(resolvedResult)}')`
    );
    logger.logInfo(
      `savePlaylistDB() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}` 
    );
    var result = rows[0][0][0] ? rows[0][0][0] : null;
    return result;
  } catch (errsavePlaylistDB) {
    logger.logInfo(
      `savePlaylistDB() :: Error :: ${JSON.stringify(
        errsavePlaylistDB
      )}`
    );
  
 
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage=constant.ErrorMessage.ApplicationError,
      errorCode=constant.ErrorCode.ApplicationError,
      {
        sqlMessage:errsavePlaylistDB.sqlMessage,
        stack:errsavePlaylistDB.stack,
      }
    );
    throw functionContext.error;
  }
};