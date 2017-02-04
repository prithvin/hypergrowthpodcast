var im = require("imagemagick");
var http = require("http");
var parseText = require("./parseText.js");
var exec = require("child_process").exec;
var normcmd = './textcleaner';
var tesseractLogic = require("./tesseract.js");

module.exports = {
  normalizeImage: function(filePath, index, callback) {
    // var newStr = "./videos/output" + index + ".png";
    // var args = [
    //   filePath,
    //   "-crop",
    //   "2300x1350+120+150",
    //   newStr,
    // ];
    // imageMagickHelper(args, newStr, callback);
    var textCleanerCommand = normcmd + ' ' + filePath + ' ' + filePath;
    textCleanerHelper(textCleanerCommand, filePath, callback)
  },

};

  // function imageMagickHelper (args, newStr, callback) {
  //   im.convert(args, function(err) {
  //     if (err) { console.log(err); }
  //     var textCleanerCommand = normcmd + ' ' + newStr + ' ' + newStr;
  //     textCleanerHelper(textCleanerCommand, newStr, callback)
  //   });
  // }

  function textCleanerHelper (command, newStr, callback) {
    exec(command, function(error, stdout, stderr) {
      if (error)
        console.log(error);

      tesseractLogic.extractWithTesseract(newStr, function (text) {
        callback(text);
      })
    });
  }