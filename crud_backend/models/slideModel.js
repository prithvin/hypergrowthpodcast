// Create a schema
var mongoose = require('mongoose');
var SlideModel = new mongoose.Schema({
	TimeStart: Number,
	TimeEnd: String,
	OCRTranscription: String,
	OCRKeywordsForSlide: [
		{
		Word:String,
		Frequency:Number
		}
  ],
	SlidePost: [],
  LecturePost: []

});

// Create a model based on the schema
var SlideModel = mongoose.model('SlideModel', SlideModel);

module.exports = {SlideModel: SlideModel}
