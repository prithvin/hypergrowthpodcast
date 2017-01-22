var tesseract = require("tesseract")
  , tess = new tesseract.BaseApi()
  , pix;
 
// set language 
tess.init("eng");
// set image 
tess.setImage("some-image.png");
// run recognition 
tess.recognize();
// get recognized text 
console.log(tess.getText());
 
// clear results 
tess.clear();