var exec = require('child_process').exec;
var http = require('http');
var fs = require('fs');
var ffmpegLogic = require("./ffmpeg.js");
var url_reader = require("./url-reader.js");
var deletecmd = 'cp ./videos/*.txt . && rm -rf ./videos';
var normalize = require("./normalizeImage.js");
var textAutocorrector = require("./spellCorrect.js");
var levenshtein = require("./levenshteinDistance.js");
var fs = require('fs')

module.exports = {
  parseVideo: function(videoFiles, index) {
    var parseVideoLater = this.parseVideo.bind(this);
    var videoFile = videoFiles[index];
    console.log("Converting " + videoFile + " to pictures ");

    var filename = 'podcast.mp4';
    
    url_reader.writeToFile(videoFile, filename, function (name) {
      ffmpegLogic.extraImagesFromVideo(name, function (fileNames) {
        console.log("Images are extracted from video.");

        console.log("filenames is");
        console.log(fileNames);
        var prefix = fileNames[0].substring(0, fileNames[0].lastIndexOf("_"));
        fs.writeFile(prefix + '.txt', "", 'utf8', function() {});

        if (fileNames.length == 0)
          return;

        console.log(prefix);
        console.log("The prefix is " + prefix);
        recursivelyExtractWithTesseract(1, prefix , fileNames.length,  function () {
            // need to put the text in db here!
          exec(deletecmd, function(error, stdout, stderr) {
            console.log("Files are deleted. Script complete");
            index = index + 1;
            if (index != videoFiles.length) {
                parseVideoLater(videoFiles, index);
            }
          });
        });
      });
    });
  }
}



function extractTextWithTesseract (index, prefix, numFiles, callback) {
  var fileName = prefix + "_" + index + ".jpg";

  normalize.normalizeImage(fileName , index, function(text) {
    console.log("Slide " + index + " normalized");

    textAutocorrector.spellCorrect(text, function (autocorrectedString) {
      console.log("Slide " + index + " autocorrected");
      callback(autocorrectedString);
    });
  })
}



function recursivelyExtractWithTesseract (index, prefix, numFiles, callback) {
  if (index == numFiles + 1) {
    callback();
    return;
  }

  extractTextWithTesseract(index, prefix, numFiles, function (text) {
    fs.appendFile(prefix + '.txt', "Slide " + index + ":\n" + text + "\n\n", 'utf8', function () {
      console.log("Slide " + index + " written and saved");
      recursivelyExtractWithTesseract(index + 1, prefix, numFiles, callback);
    });
  });
}
