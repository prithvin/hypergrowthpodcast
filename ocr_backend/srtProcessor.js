var parseSRT = require('parse-srt');
var fs = require('fs-extra')
var exec = require('child_process').exec;


module.exports = {
    getSRT: function (videoFileName, intervalData, callback) {
        var callString = "autosub " + videoFileName;
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
            var srtFleName = videoFileName.slice(-4) + ".srt";
            parseFile(srtFleName, intervalData, callback);
        });
    }
};


function parseFile (fileName, intervalData, callback) {
    if (intervalData.length == 0) {
        callback();
        return;
    }

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
        var returnedObj = {
            'SRTFile': data,
            'SubsPerSlide': subsPerSlide
        };
        callback(returnedObj);
    });
}