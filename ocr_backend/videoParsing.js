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

module.exports = {
  parseVideo: function(videoFiles, videosFromCourse, index) {
    var parseVideoLater = this.parseVideo.bind(this);
    var videoFile = videoFiles[index];
    console.log("Converting " + videoFile + " to pictures ");
    var filename = videoFile.split("/").slice(-1)[0];
    var stripped = filename.slice(0, -4);
    var dirname = "tmp-" + stripped;

    url_reader.writeToFile(videoFile, filename, function (name) {
        var CMD = "rm -rf contents/ && python2 ocr/detector.py -d " + filename + " -o slides/ && " +
        "python2 ocr/sorter.py && python2 ocr/extractor.py && " +
        "mv unique/1.jpg contents/ && mv unique/timetable.txt contents/timetable.log && " +
        "rm contents/*.hocr && rm -rf slides/ unique/ && " +
        "mkdir " + dirname + " && mv contents/* " + dirname + "/ && rmdir contents";

        exec(CMD, function(error, stdout, stderr) {
            if (error) console.log(error);

            console.log("OCR output, timetable, and first image in directory " + dirname);
            var totalTranscription = "";
            var slideIds = [];

            // Parse text for keywords
            parseText.parseText(dirname, function(words, flat) {
              fileParser.cleanParseTimetable(dirname + '/timetable.log', function(timetable) {
                srt.getSRT(filename, timetable, function(subs) {
                  var SRTFile = subs.SRTFile;
                  var SRTKeywords = subs.FlattenedKeywords;
                  var slideSubs = subs.SubsPerSlide;
                  var slideKeywords = subs.KeywordsBySlide;

                  fs.readdir(dirname, function(err, files) {
                    if (err) {
                      console.log(err);
                      return;
                    }

                    var counter = 0;
                    files.forEach(function(file, i) {
                      if (file.endsWith('.txt')) {
                        var whichSlide = Number(file.slice(0, -4));
                        var timeMs = timetable[whichSlide - 1];
                        // we are not using the end time right now

                        var transcription;
                        var id;
                        fs.readFile(dirname + '/' + file, 'utf8', function (err, data) {
                          transcription = data;
                          dbuploader.addSlide({
                            TimeStart: timeMs,
                            OCRTranscription: transcription,
                            OCRKeywordsForSlide: words[whichSlide - 1],  // put extracted keywords here
                            SlidePost: [],
                            AudioTranscription: slideSubs[whichSlide - 1],
                            AudioTranscriptionFreq: slideKeywords[whichSlide - 1],
                          }, function(idx) {
                            id = idx;
                          });
                          slideIds.push({
                            SlideID: id,
                            TimeStart: timeMs,
                            OCRForSlide: transcription,
                            AudioTranscription: slideSubs[whichSlide - 1],
                          });
                          totalTranscription += transcription;
                          counter++;

                          if (counter == (files.length - 2)) {
                            var parts = stripped.split('-');
                            var course = parts[0];
                            var date = parts[1];
                            var quarter = course.slice(-4);
                            var courseCode = course.slice(0, -4);
                            if (courseCode.endsWith("_")) {
                              courseCode = courseCode.slice(0, -1);
                            }
                            var image = base64encode(dirname + '/1.jpg');

                            date = date.slice(4) + date.slice(0, 4);

                            var formattedCourse = course.split('_')[0].toUpperCase();
                            var pre = formattedCourse.split(/[0-9]/)[0];
                            formattedCourse = pre + ' ' + formattedCourse.slice(pre.length);

                            dbuploader.addPodcast({
                              ClassName: formattedCourse,
                              QuarterOfCourse: quarter,
                              ClassNameCourseKey: course,
                              VideoDate: date,
                              NextVideo: "NULL",  // TODO
                              PrevVideo: "NULL",  // TODO
                              PodcastName: stripped,
                              PodcastUrl: videoFile,
                              PodcastImage: image,
                              OCRTranscription: totalTranscription,
                              OCRTranscriptionFreq: flat, // put extracted keywords here
                              AudioTranscription: SRTFile,
                              AudioTranscriptionFreq: SRTKeywords,
                              Slides: slideIds,
                              RecommendedVideos: [],
                              LecturePost: []
                            }, function(id) {
                              videosFromCourse.push({'_id': id});

                              index++;
                              exec("rm -f " + filename + "&& rm -rf " + dirname,
                              function(error, stdout, stderr) {
                                var nextKey = course;
                                if (index < videoFiles.length) {
                                  nextKey = videoFiles[index].split("/").slice(-1)[0].slice(0, -4).split('-')[0];
                                }

                                if (index == videoFiles.length || course != nextKey) {
                                  var c;

                                  dbuploader.getPodcastsForCourse(course, function(existing) {
                                    for (c = 0; c < videosFromCourse.length; c++) {
                                      var current = videosFromCourse[c];
                                      recommender.getRecommendedPodcasts(current, existing, function(r) {
                                        dbuploader.setRecommendations(current._id, r, function() {
                                          if (c == videosFromCourse.length) {
                                            if (index < videoFiles.length) {
                                              parseVideoLater(videoFiles, [], index);
                                            }

                                            else { process.exit(); }
                                          }
                                        });
                                      });
                                    }
                                  });
                                }
                                else {
                                  parseVideoLater(videoFiles, videosFromCourse, index);
                                }
                              });
                            });
                          }
                        });
                      }
                    });
                  });
                });
              });
            });
         });
     });
  }
}

function base64encode(file) {
  var bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString('base64');
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
