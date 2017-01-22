var exec = require("child_process").exec;
var ffmpegLogic = require("./ffmpeg.js");
var deletecmd = 'rm -rf ./videos';
var normalize = require("./normalizeImage.js");

ffmpegLogic.extraImagesFromVideo('cse100.mp4', function (fileNames) {
  recursivelyExtractWithTesseract(0, fileNames, function () {
    exec(deletecmd, function(error, stdout, stderr) {
      console.log(stdout);
      console.log(error);
      console.log(stderr);
    });
  });
});

function recursivelyExtractWithTesseract (index, fileNameArrays, callback) {
  if (index == fileNameArrays.length)
    callback();
  normalize.normalizeImage(fileNameArrays[index], index, function(parsedString, text) {
    console.log(parsedString);
    console.log(text);
    recursivelyExtractWithTesseract(index + 1, fileNameArrays);
  })
}

// var exec =
// tesseractLogic.extractWithTesseract('./o1.png', function(text) {
//   console.log('1');
// 	console.log(text);
// });

// tesseractLogic.extractWithTesseract('./o5.png', function(text) {
//     console.log('5');

//   console.log(text);
// });
