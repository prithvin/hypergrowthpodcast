var retext = require('retext');
var nlcstToString = require('nlcst-to-string');
var keywords = require('retext-keywords');
var worder = require('worder');
var checkWord = require('check-word');
var checker = checkWord('en');
var countWords = require("count-words");
var read = require('file-reader');
var fs = require('fs-extra');
var keywordExtract = require('./keywordExtract.js');

const SLIDE_TITLE_KEYWORD_WEIGHT = 25;

module.exports = {
  parseText: function(dir, callback) {
    /*var all = [];
    var all_flat = [];
    var total = {};*/
    var textArr = [];

    var files = read(dir + '/*.txt');
    var num_files = Object.keys(files).length;
    for (var file in files) {
      var fileBuffer = files[file].contents;
      if (fileBuffer != undefined) {
        textArr.push(fileBuffer.toString());
      }
    }

    keywordExtract.extractKeywordsFromSlide(textArr, function(data) {
      callback(data['RegularReturned'], data['FlattenedReturn']);
    });
  }
}
