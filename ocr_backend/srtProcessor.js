var parseSRT = require('parse-srt');
var fs = require('fs-extra')
var exec = require('child_process').exec;
var keywordExtract = require("./keywordExtract.js");


module.exports = {
    getSRT: function (videoFileName, intervalData, callback) {
        intervalData = intervalData.map((num) => { return num / 1000; }); // convert ms to s

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
                    'SubsPerSlide': []
                });
                return;
            }
            console.log("Audio extraction complete for " + videoFileName);
            var srtFleName = videoFileName.slice(0, -4) + ".srt";
            parseFile(srtFleName, intervalData, callback);
        });
    }
};


function parseFile (fileName, intervalData, callback) {
    if (intervalData.length == 0) {
        callback();
        return;
    }

    console.log("Reading from srt file: " + fileName);
    fs.readFile(fileName,'utf8', (err, data) => {

        var jsonSubs = parseSRT(data);



        var currentMin = intervalData[0];
        var currentMax = Number.MAX_VALUE;
        if (intervalData.length > 0)
            currentMax = intervalData[1];

        var currentMaxIntervalIndex = 1;
        var forCurrentSlide = "";
        var subsPerSlide = [];
        for (var x = 0; x < jsonSubs.length; x++) {
            if (jsonSubs[x]['start'] <= currentMax) {
                forCurrentSlide += " " + jsonSubs[x]['text'];
            }
            else {
                subsPerSlide.push(forCurrentSlide);
                forCurrentSlide = "";
                currentMin = currentMax;
                currentMaxIntervalIndex++;
                currentMax = Number.MAX_VALUE;
                if (currentMaxIntervalIndex < intervalData.length)
                    currentMax = intervalData[currentMaxIntervalIndex];
                x--;
            }
        }
        subsPerSlide.push(forCurrentSlide);
        console.log("Extracting keywords for audio extraction");
        keywordExtract.extractKeywordsFromSlide(subsPerSlide, function (dataKeys) {
            console.log("Keyword extraction complete..");
            var returnedObj = {
                'FlattenedKeywords': dataKeys["FlattenedReturn"],
                'KeywordsBySlide': dataKeys["RegularReturned"],
                'SRTFile': data,
                'SubsPerSlide': subsPerSlide
            };
            callback(returnedObj);
        });


    });
}
