var ffmpegLogic = require("./ffmpeg.js");
var tesseractLogic = require("./tesseract.js");

ffmpegLogic.extraImagesFromVideo('cse100.mp4', function (fileNames) {
  recursivelyExtractWithTesseract(0, fileNames);
});


function recursivelyExtractWithTesseract (index, fileNameArrays) {
  console.log(fileNameArrays[index]);
  tesseractLogic.extractWithTesseract(fileNameArrays[index], function (text) {
    console.log(text);
    recursivelyExtractWithTesseract(index + 1, fileNameArrays);
  });
}


