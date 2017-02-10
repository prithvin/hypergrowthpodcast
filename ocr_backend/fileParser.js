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
  }
}
