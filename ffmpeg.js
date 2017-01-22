var ffmpeg = require('ffmpeg');
var url_reader = require('./url-reader.js');

module.exports = {
  extraImagesFromVideo: function(videoURL, callback) {
    try {
      var filename = 'podcast.mp4';
      url_reader.writeToFile(videoURL, filename);

      var process = new ffmpeg(filename);
      process.then( function (video) {
        video.fnExtractFrameToJPG('./videos', {
          file_name : 'my_frame_%t_%s',
          every_n_seconds: 5,
          size: '2560x1600'
        }, 
        function (error, files) {
          if (!error)
            callback(files);
          else
            console.log(error);
        });
      }, 
      function (err) {
        console.log('Error: ' + err);
      });
    } 
    catch (e) {
      console.log(e.code);
      console.log(e.msg);
    }
  }

};
