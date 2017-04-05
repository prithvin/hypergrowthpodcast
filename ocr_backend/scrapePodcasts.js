var exec = require('child_process').exec;

module.exports = {
    scrapePodcasts: function(existing, useNew, callback) {
        var keys = new Set([]);
        var existingArr = [...existing];

        for (let i = 0; i < existingArr.length; i++) {
          if (!existingArr[i]) continue;
          keys.add(existingArr[i].split('/').slice(-2)[0]);
        }

        var command = useNew ? './scrape_podcasts.py --new ' : './scrape_podcasts.py ';
        command += [...keys].join(' ') + ' | sort | uniq';
        console.log('Running scrape command: ' + command);

        exec(command, function(error, stdout, stderr) {
            var scraped = stdout.split("\n").filter(Boolean);
            callback(scraped.filter(x => !existing.has(x)));
        });
    }
}
