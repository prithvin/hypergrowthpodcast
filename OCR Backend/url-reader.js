var https = require('https');
var http = require('http');
var fs = require('fs');

module.exports = {
	writeToFile: function(url, filename, callback) {
    if(url.indexOf('https') >= 0) {
      var file = fs.createWriteStream(filename);
      var request = https.get(url, function(response) {
        response.pipe(file);
        callback(filename);
      });
    } else if(url.indexOf('http') >= 0) {
      var file = fs.createWriteStream(filename);
      var request = http.get(url, function(response) {
        response.pipe(file);
        callback(filename);
      });
    } else {
      callback(url);
    }
	}
}
