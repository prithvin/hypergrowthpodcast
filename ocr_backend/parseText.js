var retext = require('retext');
var nlcstToString = require('nlcst-to-string');
var keywords = require('retext-keywords');
var worder = require('worder');
var checkWord = require('check-word');
var checker = checkWord('en');
var countWords = require("count-words");
var read = require('file-reader');
var fs = require('fs-extra');

const SLIDE_TITLE_KEYWORD_WEIGHT = 25;

module.exports = {
    parseText: function(dir, callback) {
      var all = [];
      var total = {};
      var all_flat = [];

        var files = read(dir + '/*.txt');
        for (var file in files) {
            var obj = [];
            var fileBuffer = files[file].contents;
            if (fileBuffer != undefined) {
                var text = fileBuffer.toString();
                var words = countWords(text);

                // Put extra weight on title keywords
                var splitted = text.split("\n");
                var firstLine = worder(splitted[0] + '');

                for (var i = 0; i < firstLine.length; i++) {
                    var word = firstLine[i];
                    if (words[word] != null) words[word] += SLIDE_TITLE_KEYWORD_WEIGHT;
                }

                for (var key in words) {
                  if (words.hasOwnProperty(key)) {
                    if (total.hasOwnProperty(key)) {
                      total[key] += words[key];
                    } else {
                      total[key] = words[key];
                    }
                    obj.push({'Word': key, 'Frequency': words[key]});
                  }
                }

                all.push(obj);
            }
        }

        for (var key in total) {
          if (total.hasOwnProperty(key)) {
            all_flat.push({'Word': key, 'Frequency': total[key]});
          }
        }

        callback(all, all_flat);
    }
}
