// Create a schema
var mongoose = require('mongoose');
var UserModel = new mongoose.Schema({
  User: {
    Name: String,
    Email: String,
    ProfilePicture: String,
    CourseNameKey: String,
  	FacebookAuthToken:String,
  	Subscriptions: [String],//course name + number
  	WatchLater: [Number]//podcastids
  }
});

// Create a model based on the schema
var UserModel = mongoose.model('UserModel', UserModel);

module.exports = {UserModel: UserModel}
