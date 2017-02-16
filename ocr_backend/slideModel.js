// Create a schema
var mongoose = require('mongoose');
var SlideModel = new mongoose.Schema({
	TimeStart: Number,
	OCRTranscription: String,
	OCRKeywordsForSlide: [
		{
		Word:String,
		Frequency:Number
		}
  ],
  AudioTranscription: String,
  AudioTranscriptionFreq: [{Word: String, Frequency: Number}],
	SlidePost: []
});

// Create a model based on the schema
var SlideModel = mongoose.model('SlideModel', SlideModel);

module.exports = {SlideModel: SlideModel}
