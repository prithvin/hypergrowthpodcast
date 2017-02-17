// Create a schema
var mongoose = require('mongoose');
var SlideModel = new mongoose.Schema({
	TimeStart: Number,
	OCRTranscription: String,
	OCRKeywordsForSlide: [Schema.Types.ObjectId],
  AudioTranscription: String,
  AudioTranscriptionFreq: [Schema.Types.ObjectId],
	SlidePost: [Schema.Types.ObjectId]
});

// Create a model based on the schema
var SlideModel = mongoose.model('SlideModel', SlideModel);

module.exports = {SlideModel: SlideModel}
