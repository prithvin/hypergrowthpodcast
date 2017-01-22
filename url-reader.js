var https = require('https');
var http = require('http');
var fs = require('fs');

module.exports = {
	writeToFile: function(url, filename) {
    if(url.indexOf('http:') >= 0) {
      var file = fs.createWriteStream("podcast.mp4");
      var request = http.get(videoURL, function(response) {
          response.pipe(file);
      });
    } else if(url.indexOf('https:') >= 0) {
      var file = fs.createWriteStream("podcast.mp4");
      var request = http.get(videoURL, function(response) {
          response.pipe(file);
      });
    }
	}
}
