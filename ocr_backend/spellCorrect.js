var sp = require('wordsworth').getInstance();
var worder = require("worder");

module.exports = {
    spellCorrect: function(text, callback) {
        sp.initialize(

            './data/seed.txt',
            './data/training.txt', function() {

                text = text.toLowerCase();
                var words = worder(text);
                for (var x = 0; x < words.length; x++) {
                    var suggestions = sp.suggest(words[x]);
                    if (suggestions.length != 0) 
                        words[x] = suggestions[0];
                }

                var newSentence = words.join(' ');
                callback(newSentence);
            }
        );
    }
};



