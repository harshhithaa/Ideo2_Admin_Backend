// import path from 'path';
var CronJob = require('cron').CronJob;
var fs=require('fs');
var unlink=require('fs').unlink


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
