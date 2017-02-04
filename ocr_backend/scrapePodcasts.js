var exec = require('child_process').exec;
var http = require('http');
var fs = require('fs');

module.exports = {
    scrapePodcasts: function(callback) {
        exec('./scrape_podcasts.py', function(error, stdout, stderr) {
            var arr = stdout.split("\n").filter(Boolean);
            var urls = new Set(arr);

            fs.readFile("scraped", function read(err, data) {
                if (err) {
                    throw err;
                }

                var old = new Set(JSON.parse(data));
                var diff = arr.filter(x => !old.has(x));
                console.log("new podcast list");
                console.log(diff);

                fs.writeFile("diff", JSON.stringify(diff), "utf8", callback);
                fs.writeFile("scraped", JSON.stringify(arr), "utf8");
            });

        });
    }
}
