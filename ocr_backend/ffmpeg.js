var ffmpeg = require('ffmpeg');

module.exports = {
  extraImagesFromVideo: function(videoURL, callback) {
    try {
      var process = new ffmpeg(videoURL);
      process.then( function (video) {
        video.fnExtractFrameToJPG('./videos', {
          file_name : videoURL.split("/").slice(-1)[0],
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
