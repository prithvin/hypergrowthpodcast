var retext = require('retext');
var nlcstToString = require('nlcst-to-string');
var keywords = require('retext-keywords');
var worder = require("worder");
var checkWord = require('check-word')
var checker = checkWord('en');

module.exports = {
    parseText: function(text) {
       /* console.log("---------------------OCR Text Result--------------------------")
        console.log(text);

        console.log();
        console.log("---------------------Validated english words--------------------------")
        console.log();
        var words = worder(text);
        var validWords = new Array();
        //console.log(words);

        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (checker.check(word)) {
                validWords.push(word);
            }
        }
        console.log(validWords);

        console.log();
        console.log("---------------------Retext-Keywords--------------------------")
        console.log();
        retext().use(keywords).process(
          text,
          function (err, file) {
            console.log('Keywords:');
         
            file.data.keywords.forEach(function (keyword) {
              console.log(nlcstToString(keyword.matches[0].node));
            });
         
            console.log();
            console.log('Key-phrases:');
         
            file.data.keyphrases.forEach(function (phrase) {
              console.log(phrase.matches[0].nodes.map(nlcstToString).join(''));
            });
          }
        );*/
    } 
}