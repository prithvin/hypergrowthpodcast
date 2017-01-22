
var ffmpegLogic = require("./ffmpeg.js");
var tesseractLogic = require("./tesseract.js");
var parseText = require("./parseText.js");

ffmpegLogic.extraImagesFromVideo('cse100.mp4', function (fileNames) {
  recursivelyExtractWithTesseract(0, fileNames);
});

function recursivelyExtractWithTesseract (index, fileNameArrays) {
  console.log(fileNameArrays[index]);
  tesseractLogic.extractWithTesseract(fileNameArrays[index], function (text) {
    parseText.parseText(text);
    // recursivelyExtractWithTesseract(index + 1, fileNameArrays);
  });
}