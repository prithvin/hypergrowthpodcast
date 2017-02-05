var exec = require("child_process").exec;
var scraper = require("./scrapePodcasts.js");
var videoParsing = require("./videoParsing.js");
var fs = require('fs');



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

// In production, we would read the array from JSON.parse(diff file)
videoParsing.parseVideo(['http://podcast.ucsd.edu/Podcasts//fa16/poli27fa16/poli27fa16-11022016-1200.mp4',
'http://podcast.ucsd.edu/Podcasts//cse101_1_wi17/cse101_1_wi17-02032017-0900.mp4'],
0);
