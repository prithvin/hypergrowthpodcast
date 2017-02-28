var exec = require('child_process').exec;
var http = require('http');
var fs = require('fs');
var ffmpegLogic = require("./ffmpeg.js");
var url_reader = require("./url-reader.js");
var deletecmd = 'cp ./videos/*.txt . && rm -rf ./videos';
var normalize = require("./normalizeImage.js");
var textAutocorrector = require("./spellCorrect.js");
var levenshtein = require("./levenshteinDistance.js");
var fs = require('fs');
var parseText = require("./parseText.js");
var fileParser = require('./fileParser.js');
var dbuploader = require('./dbuploader.js');
var recommender = require('./recommender.js');
var srt = require('./srtProcessor.js');
var mongoose = require('mongoose');
var base64resize = require('base64resize');

module.exports = {
  parseVideo: function(videoFiles) {
    parseVideoForEach(videoFiles, [], 0);
  }
};

function parseURL (videoFile) {
  var filename = videoFile.split("/").slice(-1)[0];
  var stripped = filename.slice(0, -4);
  var dirname = "tmp-" + stripped;
  return {
    "FileNameWithoutExtension": stripped,
    "DirName": dirname,
    "FileName": filename,
    "URLOfVideo": videoFile
  }
}

function generateCommand (fileData) {
  return "rm -rf contents/ && python2 ocr/detector.py -d " + fileData["FileName"] + " -o slides/ && " +
  "find slides/ -size 0 -delete && python2 ocr/sorter.py && python2 ocr/extractor.py && " +
  "mv unique/1.jpg contents/ && mv unique/timetable.txt contents/timetable.log && " +
  "rm contents/*.hocr && rm -rf slides/ unique/ && " +
  "mkdir " + fileData["DirName"] + " && mv contents/* " + fileData["DirName"] + "/ && rmdir contents";
}

function addSRTtoFileData (fileData, subs) {
  fileData['SRTFile'] = subs['SRTFile'];
  fileData['SRTByTime'] = subs['SRTByTime'];
  return fileData;
}

function addSlide (timeStart, ocrTranscription, index, slidesArray, callback) {
  if (index == ocrTranscription.length) {
    callback(slidesArray);
    return;
  }

  slidesArray.push(
    {
      SlideNum: index + 1,
      OCRTranscription: ocrTranscription[index],
      StartTime: timeStart[index]
    });
  addSlide(timeStart, ocrTranscription, index + 1, slidesArray, callback);
}

function parseFileNameForCourseData (fileName) {
  var parts = fileName.split('-');
  var course = parts[0];
  var unsortedDay = parts[1];
  var dateString = unsortedDay.slice(4) + "-" + unsortedDay.slice(0,2) + "-" + unsortedDay.slice(2, 4);
  var dateinMillis = new Date(new Date(dateString).getTime() +  8 * 60 * 60 * 1000 ).getTime()

  var formattedCourse = course.split('_')[0].toUpperCase();
  var pre = formattedCourse.split(/[0-9]/)[0];
  formattedCourse = pre + ' ' + formattedCourse.slice(pre.length);

  return {
    "Date": dateinMillis,
    "Quarter": course.slice(-4),
    "Course": formattedCourse,
    "ClassNameCourseKey": course
  };
}

function addPodcast (transcriptionStuff, partsOfFileName, image, fileData, slidesArray, callback) {
  dbuploader.addPodcast({
    Name: partsOfFileName["Course"],
    Quarter: partsOfFileName["Quarter"],
    Time: partsOfFileName["Date"],
    PodcastUrl: fileData["URLOfVideo"],
    Slides: slidesArray,
    AudioTranscript: fileData['SRTByTime'],
    SRTBlob: fileData["SRTFile"],
    PrevVideo: new mongoose.Types.ObjectId,
    NextVideo: new mongoose.Types.ObjectId,
    Recommendations: [],
    Image: image,
    OCRKeywords: transcriptionStuff['FlatKeywordTranscription'],
  }, function (id, courseId) {
    callback(id, courseId);
  });
}

function deleteRandomPodcastData (fileData, callback) {
  exec("rm -f keywordEncoding.txt && rm -f *.srt && rm -f " + fileData["FileName"] + "&& rm -rf " + fileData["DirName"], function(error, stdout, stderr) {
    if (error) {
      console.log("Random error occured in deleting files. This should not happen");
    }
    callback();
  });
}

function isMorePodcastInLecture (videoFiles, index, videosFromCourse, partsOfFileName) {
  if (index + 1 >= videoFiles.length)
    return false;

  var nextFileData = parseURL(videoFiles[index + 1]);
  var nextFileClassData = parseFileNameForCourseData(nextFileData["FileNameWithoutExtension"]);
  return (partsOfFileName["ClassNameCourseKey"] == nextFileClassData["ClassNameCourseKey"]);

}

function parseVideoForEach (videoFiles, videosFromCourse, index) {
  if (index == videoFiles.length)
    process.exit(); // DONE

  var videoFile = videoFiles[index];  // Video file at current index
  console.log("Converting " + videoFile + " to pictures ");

  var fileData = parseURL(videoFile); // Gets the file data from the video file

  url_reader.writeToFile(videoFile, fileData["FileName"], function (name) {
    var commandToRun = generateCommand(fileData);
    exec(commandToRun, function (error, stdout, stderr) {
      if (error) console.log(error);

      console.log("OCR output, timetable, and first image in directory " + fileData["DirName"]);

      // Parse text for keywords
      parseText.parseText(fileData["DirName"], function(words, flat, ocrTranscription) {  // extracts keywords from all the ocr files
        fileParser.cleanParseTimetable(fileData["DirName"] + '/timetable.log', function(timetable) {  //builds time tables
          srt.getSRT(fileData["FileName"], function(subs) { // audio recognition

            fileData = addSRTtoFileData(fileData, subs);  // Updates JSON obj with audio transcription stuff

            // Traverse through OCR trasncripts
            addSlide(timetable, ocrTranscription, 0, [], function (slidesArray) {
              var transcriptionStuff = {
                "TotalTranscription": ocrTranscription.join(" "),
                "FlatKeywordTranscription": flat
              };
              var partsOfFileName = parseFileNameForCourseData(fileData["FileNameWithoutExtension"]); // parses file name for course data
              var image = base64encode(fileData["DirName"] + '/1.jpg');

              base64resize({
                'src': 'data:image/jpeg;base64,' + image,
                'width': 160,
                'height': 100
              }, (error, shrunk) => {
                addPodcast(transcriptionStuff, partsOfFileName, shrunk, fileData, slidesArray, function (podcastId, courseId) {
                  videosFromCourse.push({"_id" : podcastId});
                  deleteRandomPodcastData(fileData, function () {
                    var hasMoreVideosInSeries = isMorePodcastInLecture(videoFiles, index, videosFromCourse, partsOfFileName);
                    recommender.getRecommendationsForCourseID(!hasMoreVideosInSeries, courseId, function () {
                      parseVideoForEach(videoFiles, videosFromCourse, index + 1);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}


function base64encode(file) {
  var bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString('base64');
}




// extractTextWithTesseract

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
