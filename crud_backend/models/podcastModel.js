// Create a schema
var mongoose = require('mongoose');
var PodcastModel = new mongoose.Schema({
	CourseId: Schema.Types.ObjectId, // id for course it belongs to
	PodcastDate: Number,
	PodcastUrl: String,
	Slides: [{
		SlideNum: Number,
		OCRTranscription: String,
		StartTime: Number,
	}],
	AudioTranscript: [{
		StartTime: Number,
		Content: String
	}],
	SRTBlob: String,
	PrevVideo: Schema.Types.ObjectId,
	NextVideo: Schema.Types.ObjectId,
	Recommendations: [{
		PodcastId: Schema.Types.ObjectId,
		PodcastImage: String,
		PodcastDate: Number
	}]
});

// Create a model based on the schema
var PodcastModel = mongoose.model('PodcastModel', PodcastModel);

module.exports = PodcastModel;
