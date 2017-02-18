var parseSRT = require('parse-srt');
var fs = require('fs-extra')
var exec = require('child_process').exec;
var keywordExtract = require("./keywordExtract.js");


module.exports = {
    getSRT: function (videoFileName, callback) {
        var callString = "autosub " + videoFileName;
        console.log("Starting audio extraction for " + videoFileName);
        exec(callString , function(error, stdout, stderr) {
            if (error) {
                console.log("An error occurred");
                console.log(stderr);
                console.log(stdout);
                console.log(error);
                callback({
                    'SRTFile': {},
                    'SRTByTime': []
                });
                return;
            }
            console.log("Audio extraction complete for " + videoFileName);
            var srtFileName = videoFileName.slice(0, -4) + ".srt";
            parseFile(srtFileName, callback);
        });
    }
};


function parseFile (fileName, callback) {
  console.log("Reading from srt file: " + fileName);
  fs.readFile(fileName,'utf8', (err, data) => {

  var jsonSubs = parseSRT(data);
    var i;
    for (i = 0; i < jsonSubs.length; i++) {
      var working = jsonSubs[i];
      delete working.id;
      working.StartTime = working.start;
      delete working.start;
      delete working.end;
      working.Content = working.text;
      delete working.text;
    }

    callback({
      'SRTFile': data,
      'SRTByTime': jsonSubs
    });
  });
}
