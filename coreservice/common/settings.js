
module.exports.Settings = {
  APP_KEY: null,
  APP_SECRET: null,
  ENVIORNMENT : process.env.ENVIORNMENT,
};

module.exports.FTPSettings = {
  host: process.env.FTP_HOST,
  port: process.env.FTP_PORT,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: false,
};

module.exports.FileConfiguration = {
  FileSize: process.env.FileSize,
  LocalStorage: process.env.LocalStorage,
  RemoteStorage: process.env.RemoteStorage,
  FileUrl: process.env.FileUrl,
  secure: false,
};



module.exports.MailSettings = {
  Username : process.env.MailUsername,
  Password : process.env.MailPassword,
  CC : process.env.MailCC
}