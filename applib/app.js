var logger = require("./logger").LoggerModel;
var mailer = require("./nodemail").MailModel;
var constant = require("./constant");
var uuid = require("node-uuid");
var amqp = require("amqplib/callback_api");
var request = require("request");

function UUID() {}

UUID.prototype.GetTimeBasedID = () => {
  return uuid.v1({
    node: [
      0x01,
      0x08,
      0x12,
      0x18,
      0x23,
      0x30,
      0x38,
      0x45,
      0x50,
      0x55,
      0x62,
      0x67,
      0x89,
      0xab,
    ],
    clockseq: 0x1234,
  });
};

exports.SendHttpResponse = async function (functionContext, response) {
  
  var logger = functionContext.logger;

  logger.logInfo(`SendHttpResponse() invoked`);
  
  let httpResponseType = constant.ErrorCode.Success;
  functionContext.res.writeHead(httpResponseType, {
    "Content-Type": "application/json",
  });
  var apiContext = functionContext.res.apiContext;
  if(response.Error && response.Error.ErrorDescription )
  {
    try
    {
      await apiContext.mailHelper.sendMail(functionContext,functionContext.requestID,apiContext.req.originalUrl,apiContext.environment,functionContext.error)
    }
    catch(errMailHelper)
    {
      logger.logInfo(`SendHttpResponse() :: errMailHelper :: ${JSON.stringify(errMailHelper)}`);
    }
    delete response.Error.ErrorDescription;
  }

  
  functionContext.responseText = JSON.stringify(response);
  functionContext.res.end(functionContext.responseText);

  

  try{
    await apiContext.databaseHelper.saveRequestLogsDB(functionContext,apiContext,response);
  }
  catch(err)
    {
      logger.logInfo(`SendHttpResponse() Error :${JSON.stringify(err)}`);

    }
};

exports.GetArrayValue = function (array, value, field) {
  return array.find(function (statusArray) {
    return statusArray[field] === value;
  });
};

exports.FilterArray = function (array, value, field) {
  return array.filter(function (item) {
    return item[field] === value;
  });
};



module.exports.fetchDBSettings = async function (
  logger,
  settings,
  databaseModule
) {
  try {
    logger.logInfo("fetchDBSettings()");
    let rows = await databaseModule.knex.raw(`CALL usp_get_app_settings()`);
    var dbSettingsValue = rows[0][0];
    settings.APP_KEY = getValue(dbSettingsValue, "APP_KEY");
    settings.APP_SECRET = getValue(dbSettingsValue, "APP_SECRET");

  logger.logInfo(
      "fetchDBSettings() :: Primary Database settings fetched successfully"
    );
    return;
  } catch (errGetSettingsFromDB) {
    logger.logInfo(
      `fetchDBSettings() :: ${JSON.stringify(errGetSettingsFromDB)}`
    );
    throw errGetSettingsFromDB;
  }
};


function getValue(requestArray, key) {
  var requestArrayLength = requestArray ? requestArray.length : 0;

  for (
    var requestArrayCount = 0;
    requestArrayCount < requestArrayLength;
    requestArrayCount++
  ) {
    if (
      requestArray[requestArrayCount].key.toLowerCase() === key.toLowerCase()
    ) {
      return requestArray[requestArrayCount].value;
    }
  }
  return null;
}

exports.sortArray = function (array, field, sortBy) {
  if (sortBy.toLowerCase() === "ascending") {
    array.sort(function (a, b) {
      return a[field] - b[field];
    });
  } else {
    array.sort(function (a, b) {
      return b[field] - a[field];
    });
  }
};


module.exports.Logger = logger;
module.exports.Mailer = mailer;
module.exports.UUID = UUID;
