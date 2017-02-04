// Create a schema
var mongoose = require('mongoose');
var SlideModel = new mongoose.Schema({
	TimeStart: Number,
	TimeEnd: String,
	OCRTranscription: ,
	OCRKeywordsForSlide: [
		{
		Word:
		Frequency:
		}
  ],
	RecommendedVideos: [
		{
			PodcastID
			PodcastImage:
			PodcastTitle
		}
	],
	SlidePost: [],
  LecturePost: []

});

// Create a model based on the schema
var SlideModel = mongoose.model('SlideModel', SlideModel);

module.exports = {SlideModel: SlideModel}
