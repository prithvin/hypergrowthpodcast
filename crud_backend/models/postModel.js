// Create a schema
var mongoose = require('mongoose');
var PostModel = new mongoose.Schema({
	PodcastId: Schema.Types.ObjectId,
	ProfilePicture: String,
	SlideNum: Number,
	Name: String,
	Time: Number,
	Content: String,
	CourseId: Schema.Types.ObjectId,
	Comments: [{
		ProfilePicture : String,
		Name: String,
		Time: Number,
		Content: String
	}]
});

// Create a model based on the schema
var PostModel = mongoose.model('PostModel', PostModel);

module.exports = PostModel;
