// Create a schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserModel = new mongoose.Schema({
    ProfilePicture: String,
    Name: String,
    Email: String,
  	FBAuthId:String,
    ProfileId: String,
  	Notes:[Schema.Types.ObjectId],
    WatchHistory:[Schema.Types.ObjectId]
});

// Create a model based on the schema
var UserModel = mongoose.model('UserModel', UserModel);

module.exports = {UserModel: UserModel}
