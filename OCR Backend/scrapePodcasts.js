var exec = require('child_process').exec;
var http = require('http');
var fs = require('fs');

module.exports = {
    scrapePodcasts: function(callback) {
        exec('./scrape_podcasts.py', function(error, stdout, stderr) {
            var urls = stdout.split("\n");
            fs.writeFile("scraped",
            JSON.stringify(urls), "utf8", callback);
        });
    }
}
