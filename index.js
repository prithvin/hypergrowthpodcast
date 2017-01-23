var exec = require("child_process").exec;
var ffmpegLogic = require("./ffmpeg.js");
var deletecmd = 'rm -rf ./videos';
var normalize = require("./normalizeImage.js");
var textAutocorrector = require("./spellCorrect.js");
var levenshtein = require("./levenshteinDistance.js");

var fs = require('fs')

//console.log(levenshtein.levenshteinDistance());
parseVideo('video.mp4');

function parseVideo (videoFile) {
  console.log("Converting " + videoFile + " to pictures ");
  
  ffmpegLogic.extraImagesFromVideo(videoFile, function (fileNames) {
    console.log("Images are extracted from video.");

    fs.writeFile('message.txt', "", 'utf8', function() {});

    if (fileNames.length == 0)
      return;

    var prefix = fileNames[0].substring(0, fileNames[0].indexOf("_"));
    console.log(prefix);
    console.log("The prefix is " + prefix);
    recursivelyExtractWithTesseract(1, prefix , fileNames.length,  function () {
      exec(deletecmd, function(error, stdout, stderr) {
        console.log("Files are deleted. Script complete");
      });
    });
  });
}

function recursivelyExtractWithTesseract (index, prefix, numFiles, callback) {
  if (index == numFiles + 1)
    callback();

  var fileName = prefix + "_" + index + ".jpg";
  normalize.normalizeImage(fileName , index, function(text) {
    console.log("Slide " + index + " normalized");

    textAutocorrector.spellCorrect(text, function (autocorrectedString) {
      console.log("Slide " + index + " autocorrected");

      fs.appendFile('message.txt', "Slide " + index + ":\n" + autocorrectedString + "\n\n", 'utf8', function () {

        console.log("Slide " + index + " written and saved");
        recursivelyExtractWithTesseract(index + 1, prefix, numFiles, callback);
      });
    });
  })
}