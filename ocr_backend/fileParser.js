var readline = require('readline');
var fs = require('fs');

module.exports = {
  parseTimetable: function(path, callback) {
    var slide_times = {};
    var rl = readline.createInterface({
      input: fs.createReadStream(path);
    });

    rl.on('line', function (line) {
      var id = line.split(':')[0];
      var time = line.split(' ')[2];

      slide_times.push({SlideID: id, TimeStart: time});
    });

    return slide_times;
  }
}
