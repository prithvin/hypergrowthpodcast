var exec = require('child_process').exec;
var autocomplete = require('./spellCorrect.js');
var fs = require('fs');

module.exports = {
    extractKeywordsFromSlide: function (slideTexts, callback) {
        extractKeyByEle(slideTexts, 0, function (data) {
            callback(data);
        }, [], [])
        // return [[{}]]
    }
}

function extractKeyByEle (slideTexts, index, callback, regularReturned, flattenedReturn) {
    if (slideTexts.length == index) {
        callback({
            "FlattenedReturn": flattenedReturn,
            "RegularReturned": regularReturned
        }); return;
    }
    extract(slideTexts[index], function (keywordsExtracted) {
        regularReturned.push(keywordsExtracted);
        flattenedReturn.push.apply(flattenedReturn, keywordsExtracted);
        extractKeyByEle(slideTexts, index + 1, callback, regularReturned, flattenedReturn);
    });
}

function extract (text, callback) {
    fs.writeFile('keywordEncoding.txt', text, 'utf8', function (err) {
        if (err) {
            console.log("Some error occured when writing to the keyword file");
            console.log(err);
        }

        var callString = "python2 ./runner.py";
        exec(callString , function(error, stdout, stderr) {
            if (error) {
                console.log("An error occurred");
                callback([]); return;
            }
            var data = JSON.parse(stdout);
            var keywordsExtracted = [];
            spellCorrectExtract(keywordsExtracted, data, 0, function () {
                callback(keywordsExtracted);
            })
        });
    });
}

function spellCorrectExtract (keywordsExtracted, data, index, callback) {
    if (data.length == index) {
        callback(); return;
    }

    var wordData = data[index][0];
    var freqData = data[index][1];


    autocomplete.spellCorrect(wordData, function (autocorrectedWords) {
        for (var x = 0; x < autocorrectedWords.length; x++) {
            var newKeyword = {
                "Word": autocorrectedWords[x],
                "Frequency": freqData
            };
            keywordsExtracted.push(newKeyword);
        }
                    spellCorrectExtract(keywordsExtracted, data, index + 1, callback);
    });
}