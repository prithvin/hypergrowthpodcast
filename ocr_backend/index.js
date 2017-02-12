var exec = require("child_process").exec;
var scraper = require("./scrapePodcasts.js");
var videoParsing = require("./videoParsing.js");
var fs = require('fs');
var uploader = require('./dbuploader.js');
var srtProcessor = require('./srtProcessor.js');
var existing = new Set([]);
var counter = 0;

uploader.getPodcastList(function(podcasts) {
  podcasts.push("");
  podcasts.forEach(function(e) {
    existing.add(e.PodcastUrl);
    counter++;

    if (counter == podcasts.length) {
      scraper.scrapePodcasts(existing, function(working) {
        console.log("finished scraping");

        exec("rm -rf tmp* && rm -f *.mp4", function(error, stdout, stderr) {
          working = [
            'http://podcast.ucsd.edu/Podcasts//cse101_1_wi17/cse101_1_wi17-01132017-0900.mp4',
            'http://podcast.ucsd.edu/Podcasts//cse101_1_wi17/cse101_1_wi17-01182017-0900.mp4',
            'http://podcast.ucsd.edu/Podcasts//cse101_1_wi17/cse101_1_wi17-01202017-0900.mp4',
            'http://podcast.ucsd.edu/Podcasts//cse101_1_wi17/cse101_1_wi17-01232017-0900.mp4',
            'http://podcast.ucsd.edu/Podcasts//cse101_1_wi17/cse101_1_wi17-01252017-0900.mp4',
            'http://podcast.ucsd.edu/Podcasts//cse101_1_wi17/cse101_1_wi17-01272017-0900.mp4',
            'http://podcast.ucsd.edu/Podcasts//cse101_1_wi17/cse101_1_wi17-02012017-0900.mp4',
            'http://podcast.ucsd.edu/Podcasts//cse101_1_wi17/cse101_1_wi17-02032017-0900.mp4',
            'http://podcast.ucsd.edu/Podcasts//cse101_1_wi17/cse101_1_wi17-02062017-0900.mp4',
            'http://podcast.ucsd.edu/Podcasts//cse101_1_wi17/cse101_1_wi17-02082017-0900.mp4',
            'http://podcast.ucsd.edu/Podcasts//cse101_1_wi17/cse101_1_wi17-02102017-0900.mp4',
          ];

          videoParsing.parseVideo(working, [], 0);
        });
      });
    }
  });
});
