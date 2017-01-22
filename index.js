var tesseract = require('node-tesseract');
 
// Recognize text of any language in any format
tesseract.process(__dirname + '/screenshot.png',function(err, text) {
    if(err) {
        console.error(err);
    } else {
        console.log(text);
    }
});
 