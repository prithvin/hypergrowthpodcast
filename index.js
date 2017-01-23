var exec = require("child_process").exec;
var ffmpegLogic = require("./ffmpeg.js");
var deletecmd = 'rm -rf ./videos';
var normalize = require("./normalizeImage.js");
var textAutocorrector = require("./spellCorrect.js");
var levenshtein = require("./levenshteinDistance.js");
var scraper = require("./scrapePodcasts.js");
var fs = require('fs')

//console.log(levenshtein.levenshteinDistance('designing justice does law alone create justice war of all against all in urban colombia construction ofjustice in bogota and medellin remaking the culture remaking the built environment evidence broken window theory of norm compliance medellin data'
//  , 'designing justice does law alone create justice war of all against all in urban colombia construction ofjustice in bogota and medellin remaking the culture remaking the built environment evidence broken window theory of norm compliance medellin data'));

// scrape podcast.ucsd.edu every hour
fs.stat("scraped", function(err, stats) {
    var interval = 1000*60*60;

    var mtime = stats["mtime"].getTime();
    var now = (new Date).getTime();
    if (now - mtime > interval) {
        console.log("scrape");
        scraper.scrapePodcasts(function() { console.log ('scrape done'); });
    }
});

// Should iterate over all the files in the "scraped" file not in db here
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
  if (index == numFiles + 1)
    callback();     

  extractTextWithTesseract(index, prefix, numFiles, function (text) {
    fs.appendFile('message.txt', "Slide " + index + ":\n" + text + "\n\n", 'utf8', function () {
      console.log("Slide " + index + " written and saved");
      recursivelyExtractWithTesseract(index + 1, prefix, numFiles, callback);
    });
  });
}
