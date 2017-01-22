/*
var tesseract = require('node-tesseract');
 
// Recognize text of any language in any format
tesseract.process(__dirname + '/screenshot.png', function(err, text) {
    if(err) {
        console.error(err);
    } else {
        console.log(text);
    }
});
 
 */
var ffmpeg = require('ffmpeg');


try {
  var process = new ffmpeg('cse100.mp4');
  process.then(
    function (video) {
      video.fnExtractFrameToJPG('./videos', {
        frame_rate : 1,
        file_name : 'my_frame_%t_%s'
      }, 
      function (error, files) {
        if (!error)
          console.log('Frames: ' + files);
      }
    );
  }, 
  function (err) {
    console.log('Error: ' + err);
  });
} 
catch (e) {
  console.log(e.code);
  console.log(e.msg);
}