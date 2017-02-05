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
    var filename = videoFile.split("/").slice(-1)[0];
    var stripped = filename.slice(0, -4);

    url_reader.writeToFile(videoFile, filename, function (name) {
        var CMD = "rm -rf contents/ && python2 ocr/detector.py -d " + filename + " -o slides/ && " +
        "python2 ocr/sorter.py && python2 ocr/extractor.py && " +
        "mv unique/1.jpg contents/ && mv unique/timetable.txt contents/ && " +
        "rm contents/*.hocr && rm -rf slides/ unique/ && " +
        "mkdir " + stripped + " && mv contents/* " + stripped + "/ && rmdir contents && " +
        "rm " + filename;

        exec(CMD, function(error, stdout, stderr) {
            if (error) console.log(error);

            console.log("OCR output, timetable, and first image in directory " + stripped);
            index = index + 1; 
            if (index != videoFiles.length) {
                parseVideoLater(videoFiles, index);
            }
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
