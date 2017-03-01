var exec = require("child_process").exec;
var scraper = require("./scrapePodcasts.js");
var videoParsing = require("./videoParsing.js");
var fs = require('fs');
var uploader = require('./dbuploader.js');
var srtProcessor = require('./srtProcessor.js');
var existing = new Set([]);
var counter = 0;

var useNew = (process.argv.indexOf('--new') != -1);
var test = (process.argv.indexOf('--test') != -1);

uploader.getPodcastList(function(podcasts) {
  podcasts.push("");
  podcasts.forEach(function(e) {
    existing.add(e.PodcastUrl);
    counter++;

    if (counter == podcasts.length) {
      scraper.scrapePodcasts(existing, useNew, function(working) {
        console.log('Finished scraping - videos to process:\n' + working.join('\n'));

        if (!test) {
          exec("rm -rf tmp* contents slides unique && rm -f *.mp4", function(error, stdout, stderr) {
            videoParsing.parseVideo(working, [], 0);
          });
        }
      });
    }
  });
});
