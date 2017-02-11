var sp = require('wordsworth').getInstance();
var worder = require("worder");
var initializedWords = false;

module.exports = {
    spellCorrect: function(text, callback) {
        seedDataLoad(function () {
            text = text.toLowerCase();
            var words = worder(text);
            for (var x = 0; x < words.length; x++) {
                var suggestions = sp.suggest(words[x]);
                if (suggestions.length != 0) 
                    words[x] = suggestions[0];
            }
            callback(words);
        });
    }
};


function seedDataLoad (callback) {
    if(initializedWords) {
        callback(); return;
    }
    sp.initialize(

        './data/seed.txt',
        './data/training.txt', function() {
            initializedWords = true;
            callback();
        }
    );
}