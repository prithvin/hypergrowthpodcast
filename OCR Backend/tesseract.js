var tesseract = require('node-tesseract');
 

module.exports = {
  extractWithTesseract: function (imageURL, callback) {
    tesseract.process(imageURL, function(err, text) {
      if(err) {
        console.error(err);
       } else {
        callback(text);
      }
    });
  }
}
