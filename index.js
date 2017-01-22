var ffmpegLogic = require("./ffmpeg.js");
var tesseractLogic = require("./tesseract.js");

ffmpegLogic.extraImagesFromVideo('cse100.mp4', function (fileNames) {
  extractWithTesseract(fileNames[0], function (text) {
    console.log(text);
  });
});
/*

 
 */



