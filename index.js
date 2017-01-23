var exec = require("child_process").exec;
var ffmpegLogic = require("./ffmpeg.js");
var deletecmd = 'rm -rf ./videos';
var normalize = require("./normalizeImage.js");
var textAutocorrector = require("./spellCorrect.js");
var levenshtein = require("./levenshteinDistance.js");

var fs = require('fs')

//console.log(levenshtein.levenshteinDistance('designing justice does law alone create justice war of all against all in urban colombia construction ofjustice in bogota and medellin remaking the culture remaking the built environment evidence broken window theory of norm compliance medellin data'
//  , 'designing justice does law alone create justice war of all against all in urban colombia construction ofjustice in bogota and medellin remaking the culture remaking the built environment evidence broken window theory of norm compliance medellin data'));

parseVideo('video.mp4');

function parseVideo (videoFile) {
  console.log("Converting " + videoFile + " to pictures ");
  
  ffmpegLogic.extraImagesFromVideo(videoFile, function (fileNames) {
    console.log("Images are extracted from video.");

    fs.writeFile('message.txt', "", 'utf8', function() {});

    recursivelyExtractWithTesseract(0, fileNames, function () {
      exec(deletecmd, function(error, stdout, stderr) {
        console.log("Files are deleted. Script complete");
      });
    });
  });
}

function recursivelyExtractWithTesseract (index, fileNameArrays, callback) {
  if (index == fileNameArrays.length)
    callback();

  normalize.normalizeImage(fileNameArrays[index], index, function(text) {
    console.log("Slide " + index + " normalized");

    textAutocorrector.spellCorrect(text, function (autocorrectedString) {
      console.log("Slide " + index + " autocorrected");

      fs.appendFile('message.txt', "Slide " + index + ":\n" + autocorrectedString + "\n\n", 'utf8', function () {

        console.log("Slide " + index + " written and saved");
        recursivelyExtractWithTesseract(index + 1, fileNameArrays);
      });
    });
  })
}