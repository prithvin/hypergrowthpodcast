// Create a schema
var mongoose = require('mongoose');
var PostModel = new mongoose.Schema({
    SlideId: Number,
  	LectureId: Number,
  	ProfilePicture: String,
  	NameOfUser: String,
  	TimeOfPost: Number,
  	Content: String,
  	Comments: [{
  		ProfilePicture: String,
  		NameOfUser: String,
  		TimeOfPost: Number,
  		Content: String
  	}]
});

// Create a model based on the schema
var PostModel = mongoose.model('PostModel', PostModel);

module.exports = {PostModel: PostModel}
