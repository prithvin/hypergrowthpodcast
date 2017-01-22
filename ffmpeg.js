var ffmpeg = require('ffmpeg');

module.exports = {
  extraImagesFromVideo: function(videoURL, callback) {
    try {
      var process = new ffmpeg(videoURL);
      process.then( function (video) {
        video.fnExtractFrameToJPG('./videos', {
          frame_rate : 1,
          file_name : 'my_frame_%t_%s',
          every_n_seconds: 5,
        }, 
        function (error, files) {
          if (!error)
            callback(files);
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