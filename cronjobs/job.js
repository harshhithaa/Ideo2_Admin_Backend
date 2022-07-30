// import path from 'path';
var CronJob = require('cron').CronJob;
var fs=require('fs');
var unlink=require('fs').unlink
var nodemailer = require("nodemailer");

async function sendEmail(path) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'coppercodes@gmail.com',
      pass: 'bssqnoesujmbyaru',
    },
  });

    let info = await transporter.sendMail({
    from: 'coppercodes@gmail.com', // sender address
    to: 'akshay.shirwaikar@gmail.com, coppercodes@gmail.com', // list of receivers
    subject: "Ideogram Log Files", // Subject line,
    text: "PFA Log Files", // plain text body
    attachments:[{
      filename: 'Logs.zip',
      path: path
    }]
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

const JSZip = require('jszip');

var job = new CronJob('0 0 */28 * *', function() {
  const zip = new JSZip();

  try{
  const testFolder = '../coreservice/Logs/';
  const testFiles = testFolder+fs.readdirSync(testFolder);

  const logFiles = testFiles.split(',')

  for(var i=0; i<logFiles.length;i++){
    directoryLength=fs.readdirSync(testFolder).length
    if(i==0){
      directoryLength>0?zip.file(`${logFiles[i].split('/')[3]}`,fs.readFileSync(logFiles[i])):null
      directoryLength>0?removeAFile(logFiles[i]):null
    }else{
      directoryLength>1?zip.file(`${logFiles[i]}`,fs.readFileSync(testFolder+logFiles[i])):null
      directoryLength>1?removeAFile(testFolder+logFiles[i]):null 
    }
  }

  zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
  .pipe(fs.createWriteStream(testFolder+'Logs.zip'))
  .on('finish', function () {
      console.log("Logs.zip written.");
  });

  sendEmail(testFolder+'Logs.zip').catch(console.error)

  }catch(err){
    console.log(err)
  }
}, null, true, 'Asia/Kolkata');


job.start();


var removeAFile=(path)=>{
 
  unlink(path, (err) => {
    if (err) throw err;
    console.log(`${path} was removed`);
  });

}
