
var ffmpegLogic = require("./ffmpeg.js");
var tesseractLogic = require("./tesseract.js");
var im = require("imagemagick");
var http = require("http");
var parseText = require("./parseText.js");

ffmpegLogic.extraImagesFromVideo('cse100.mp4', function (fileNames) {
  recursivelyExtractWithTesseract(0, fileNames);
});

function recursivelyExtractWithTesseract (index, fileNameArrays) {
  console.log(fileNameArrays[index]);
  var newStr = "output" + index + ".png";
  var args = [
  	fileNameArrays[index],
  	"-crop",
  	"2300x1350+120+150",
  	newStr,
  ]
  im.convert(args, function(err) {
  	if (err) { console.log(err); }
  	tesseractLogic.extractWithTesseract("./" + newStr, function (text) {
    console.log(text);
    parseText.parseText(text);
    // recursivelyExtractWithTesseract(index + 1, fileNameArrays);
  	});
  });
}

// var exec =
// tesseractLogic.extractWithTesseract('./output0.png', function(text) {
// 	console.log(text);
// });