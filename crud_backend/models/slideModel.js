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
<<<<<<< HEAD
	SlidePost: [],
  LecturePost: []

=======
  AudioTranscription: String,
  AudioTranscriptionFreq: [{Word: String, Frequency: Number}],
	SlidePost: []
>>>>>>> 6c9572f98b1fc62c5363fc4187149f4138b78702
});

// Create a model based on the schema
var SlideModel = mongoose.model('SlideModel', SlideModel);

module.exports = {SlideModel: SlideModel}
