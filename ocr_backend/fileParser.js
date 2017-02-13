var readline = require('readline');
var fs = require('fs');

module.exports = {
  parseTimetable: function(path, callback) {
    var slide_times = [];

    fs.readFile(path, 'utf8', function(err, data) {
      content = data.split("\n");

      content.forEach(function(line) {
        var id = Number(line.split(':')[0].slice(6));
        var time = line.split(' ')[2];

        slide_times.push({SlideID: id, TimeStart: time});
      });

      callback(slide_times);
    });
  },

  cleanParseTimetable: function(path, callback) {
    this.parseTimetable(path, function(slide_times) {
      var last = 0;
      var real = [];
      var count;
      for (count = 0; count < slide_times.length; count++) {
        var obj = slide_times[count];
        if (obj.SlideID <= count) { break; }
        var t = obj.TimeStart;
        var s = t.split(':');
        var timeSeconds = 60*60*Number(s[0]) + 60*Number(s[1]) + Number(s[2]);
        real.push(1000*timeSeconds);
      }
      callback(real);
    });
  }
}
