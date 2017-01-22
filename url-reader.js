var https = require('https');
var http = require('http');
var fs = require('fs');

module.exports = {
	writeToFile: function(url, filename) {
    if(url.indexOf('https') >= 0) {
      var file = fs.createWriteStream(filename);
      var request = https.get(videoURL, function(response) {
          response.pipe(file);
      });
    } else if(url.indexOf('http') >= 0) {
      var file = fs.createWriteStream(filename);
      var request = http.get(videoURL, function(response) {
          response.pipe(file);
      });
    } else {
      return false;
    }

    return true;
	}
}
