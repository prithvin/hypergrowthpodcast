// Create a schema
var mongoose = require('mongoose');
var UserModel = new mongoose.Schema({
  ProfilePicture: String,
  Name: String,
  FBUserId: String,
  Notes: [{
    PodcastId: Schema.Types.ObjectId, //_id for podcast
    Content: String
  }],
  WatchLater: [Schema.Types.ObjectId]
});

// Create a model based on the schema
var UserModel = mongoose.model('UserModel', UserModel);

module.exports = UserModel;
