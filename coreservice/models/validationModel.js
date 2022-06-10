var joi = require("@hapi/joi");
var constant = require("../common/constant");

module.exports.validateRequest = (requestParams) => {
  var joiSchema = joi.object({
    apiUri: joi.string().required(),
    authorization: joi.string().required(),
    appVersion: joi.string().required(),
    authToken: joi.string().optional(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.adminLoginRequest = (requestParams) => {
  var joiSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
  });
  return joiSchema.validate(requestParams);
};

module.exports.registerDeviceTokenRequest = (requestParams) => {
  var joiSchema = joi.object({
    deviceToken: joi.string().required(),
    appType: joi
      .number()
      .required()
      .allow(constant.APPTYPE.Android, constant.APPTYPE.iOS),
  });
  return joiSchema.validate(requestParams);
};

module.exports.saveSystemUserRequest = (requestParams) => {
  var joiSchema = joi.object({
    adminRef: joi.string().optional().allow(null),
    userName: joi.string().required(),
    password: joi.string().allow(null),
    email: joi.string().required(),
    phone: joi.string().required(),
    isActive: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.saveMediaRequest = (requestParams) => {
  var joiSchema = joi.object({
    userReference: joi.string().required(),
    currentTs: joi.string().optional(),

  });
  return joiSchema.validate(requestParams);
};

module.exports.getAdminComponentRequest = (requestParams) => {
  var joiSchema = joi.object({
    componentType: joi.number().valid(constant.COMPONENTS.Media, constant.COMPONENTS.Playlist, constant.COMPONENTS.Schedule, constant.COMPONENTS.Monitor)
  });
  return joiSchema.validate(requestParams);
};

module.exports.savePlaylistRequest = (requestParams) => {
  var joiSchema = joi.object({
    playlistRef: joi.string().optional().allow(null),
    playlistName: joi.string().required(),
    description: joi.string().optional().allow(null),
    isActive: joi.number().required(),
    playlist: joi
      .array()
      .items({
        MediaRef: joi.string().required(),
        IsActive: joi.number().required().allow(1, 0),
      })
      .optional().allow(null),
    currentTs: joi.string().optional(),

  });
  return joiSchema.validate(requestParams);
};

module.exports.saveScheduleRequest = (requestParams) => {
  var joiSchema = joi.object({
    scheduleRef: joi.string().optional().allow(null),
    scheduleTitle: joi.string().required(),
    description: joi.string().optional().allow(null),
    playlistRef: joi.string().required().allow(null),
    monitorRef: joi.string().optional().allow(null),
    fixedTimePlayback: joi.number().required(),
    isActive: joi.number().required(),
    schedule: joi
      .object({
        StartTime: joi.string().required(),
        EndTime: joi.string().required(),
        StartDate: joi.string().required(),
        EndDate: joi.string().required(),
        Days: joi.array().required(),
      })
      .optional().allow(null),
    currentTs: joi.string().optional(),

  });
  return joiSchema.validate(requestParams);
};

module.exports.saveMonitorRequest = (requestParams) => {
  var joiSchema = joi.object({
    monitorRef: joi.string().optional().allow(null),
    monitorName: joi.string().required(),
    description: joi.string().optional().allow(null),
    defaultPlaylistRef: joi.string().required().allow(null),
    scheduleRef: joi.string().optional().allow(null),
    isActive: joi.number().required(),
    currentTs: joi.string().optional(),
    orientation: joi.string().required(),
    slideTime: joi.number.required()
  });
  return joiSchema.validate(requestParams);
};

module.exports.getAdminCompenentRequest = (requestParams) => {
  var joiSchema = joi.object({
    componentType: joi.number().required().valid(constant.COMPONENTS.Media,constant.COMPONENTS.Playlist,constant.COMPONENTS.Schedule,constant.COMPONENTS.Monitor),   

  });
  return joiSchema.validate(requestParams);
};

module.exports.getAdminComponentDetailsRequest = (requestParams) => {
  var joiSchema = joi.object({
    componentType: joi.number().required().valid(constant.COMPONENTS.Media,constant.COMPONENTS.Playlist,constant.COMPONENTS.Schedule,constant.COMPONENTS.Monitor),   
    componentRef: joi.string().required().allow(null),

  });
  return joiSchema.validate(requestParams);
};

module.exports.monitorDetailsRequest = (requestParams) => {
  var joiSchema = joi.object({
    monitorRef: joi.string().required().allow(null),
  });
  return joiSchema.validate(requestParams);
};

module.exports.deleteAdminCompenentRequest = (requestParams) => {
  var joiSchema = joi.object({
    componentType: joi.number().required().valid(constant.COMPONENTS.Media,constant.COMPONENTS.Playlist,constant.COMPONENTS.Schedule,constant.COMPONENTS.Monitor),   
    componentList: joi.array().required(),   
    currentTs: joi.string().optional(),

  });
  return joiSchema.validate(requestParams);
};

module.exports.monitorLoginRequest = (requestParams) => {
  var joiSchema = joi.object({
    monitorUser: joi.string().required(),
    password: joi.string().required()

  });
  return joiSchema.validate(requestParams);
};

