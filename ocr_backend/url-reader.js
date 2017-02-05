var download = require('download-file');
var fs = require('fs');

module.exports = {
	writeToFile: function(url, filename, callback) {
        var fname = url.split("/").slice(-1)[0];
	    var options = {
            directory: ".",
            filename: fname
        };

        download(url, options, function(err) {
            if (err) {
                throw err
            } else {
                console.log("download complete");
                callback(fname);
            }
        });
    }
}
