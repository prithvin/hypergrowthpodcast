var exec = require('child_process').exec;

module.exports = {
    scrapePodcasts: function(existing, callback) {
        exec('./scrape_podcasts.py', function(error, stdout, stderr) {
            var scraped = stdout.split("\n").filter(Boolean);
            callback(scraped.filter(x => !existing.has(x)));
        });
    }
}
