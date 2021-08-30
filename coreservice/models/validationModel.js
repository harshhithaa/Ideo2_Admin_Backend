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
    adminRef: joi.string().allow(null),
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
    componentType: joi.number().valid(constant.COMPONENTS.Media,constant.COMPONENTS.Playlist,constant.COMPONENTS.Schedule,constant.COMPONENTS.Monitor)
  });
  return joiSchema.validate(requestParams);
};

module.exports.savePlaylistRequest = (requestParams) => {
  var joiSchema = joi.object({
    playlistRef: joi.string().required().allow(null),
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