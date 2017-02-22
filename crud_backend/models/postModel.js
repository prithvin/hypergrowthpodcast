// Create a schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PostModel = new mongoose.Schema({
	PodcastId: Schema.Types.ObjectId,
	ProfilePic: String,
	SlideOfPost: Number,
	Name: String,
	TimeOfPost: Number,
	Content: String,
	CourseId: Schema.Types.ObjectId,
	Comments: [{
		Pic : String,
		PosterName: String,
		Time: Number,
		Content: String
	}]
});

// Create a model based on the schema
var PostModel = mongoose.model('PostModel', PostModel);

module.exports = PostModel;
