var mongoose = require('mongoose');

module.exports = {
  uploadPodcastData: function(podcast_data, callback) {
    var Podcast = require('./models/podcastModel');

    var newPodcast = Podcast({
      podcast_data
    });

    newPodcast.save(function(err) {
      if (err) throw err;
    });
  },

  uploadPostData: function(post_data, callback) {
    var Post = require('./models/postModel');

    var newPost = Post({
      post_data
    });

    newPost.save(function(err) {
      if (err) throw err;
    });
  },

  uploadSlideData: function(slide_data, callback) {
    var Slide= require('./models/slideModel');

    var newSlide = Slide({
      slide_data
    });

    newPodcast.save(function(err) {
      if (err) throw err;
    });
  },

  uploadUserData: function(user_data, callback) {
    var User = require('./models/userModel');

    var newUser = User({
      user_data
    });

    newUser.save(function(err) {
      if (err) throw err;
    });
  }
}
