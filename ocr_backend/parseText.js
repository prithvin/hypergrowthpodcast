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
Object.prototype.getName = function() { 
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

module.exports = {
    parseText: function(dir) {

        var files = read(dir + '/*.txt');
        for (var file in files) {
            var fileBuffer = files[file].contents;
            if (fileBuffer != undefined) {
                // console.log(file);
                // console.log(fileBuffer.toString());
                var text = fileBuffer.toString();
                var words = countWords(text);

                // Put extra weight on title keywords
                var splitted = text.split("\n");
                var firstLine = worder(splitted[0] + '');

                for (var i = 0; i < firstLine.length; i++) {
                    var word = firstLine[i];
                    if (words[word] != null) words[word] += SLIDE_TITLE_KEYWORD_WEIGHT;
                }

                fs.writeJson('./contents/' + file + '_keywords.txt', words, function(err) {
                    if (err != null) console.log(err);
                    // else console.log("...Parsed keywords for " + file);
                });
            }
        }
        
       //var counts = countWords(text);
        //console.log(counts);
        // var words = worder(text);
        // var validWords = new Array();

        // for (var i = 0; i < words.length; i++) {
        //     var word = words[i];
        //     if (checker.check(word)) {
        //         validWords.push(word);
        //     }
        // }
        // console.log(validWords);

        // console.log();
        // console.log("---------------------Retext-Keywords--------------------------")
        // console.log();
        // retext().use(keywords).process(
        //   text,
        //   function (err, file) {
        //     console.log('Keywords:');
         
        //     file.data.keywords.forEach(function (keyword) {
        //       console.log(nlcstToString(keyword.matches[0].node));
        //     });
         
        //     console.log();
        //     console.log('Key-phrases:');
         
        //     file.data.keyphrases.forEach(function (phrase) {
        //       console.log(phrase.matches[0].nodes.map(nlcstToString).join(''));
        //     });
        //   }
        // );
    } 
}