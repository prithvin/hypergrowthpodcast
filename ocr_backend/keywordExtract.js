var exec = require('child_process').exec;


module.exports = {
    extract: function(text, callback) {
        var callString = "python ./runner.py \""  + text + "\"";
        exec(callString , function(error, stdout, stderr) {
            if (error) {
                console.log("An error occurred");
                callback([]); return;
            }
            var data = JSON.parse(stdout);
            var keywordsExtracted = [];
            for (var x = 0; x < data.length; x++) {
                keywordsExtracted.push({
                    "Word": data[x][0],
                    "Frequency": data[x][1]
                });
            }
            callback(keywordsExtracted);
        });
    }
}
