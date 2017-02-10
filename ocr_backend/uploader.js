var mongoose = require('mongoose');

module.exports = {
  uploadPodcastData: function(podcast_data, callback) {
    var Podcast = require('../crud_backend/models/podcastModel');

    var newPodcast = Podcast({
      podcast_data
    });

    newPodcast.save(function(err) {
      if (err) throw err;
    });
  },

  uploadPostData: function(post_data, callback) {
    var Post = require('../crud_backend/models/postModel');

    var newPost = Post({
      post_data
    });

    newPost.save(function(err) {
      if (err) throw err;
    });
  },

  uploadSlideData: function(slide_data, callback) {
    var Slide= require('../crud_backend/models/slideModel');

    var newSlide = Slide({
      slide_data
    });

    newPodcast.save(function(err) {
      if (err) throw err;
    });
  },

  uploadUserData: function(user_data, callback) {
    var User = require('../crud_backend/models/userModel');

    var newUser = User({
      user_data
    });

    newUser.save(function(err) {
      if (err) throw err;
    });
  }
}
