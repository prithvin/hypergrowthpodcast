// Create a schema
var mongoose = require('mongoose');
var PodcastModel = new mongoose.Schema({

  podcastName: String,
  podcastUrl: String,
  podcastImage: String,
  OCRTranscription: String,
  OCRTranscriptionFreq: [{word: String, frequency: Number}],
  AudioTranscription: String,
  AudioTranscriptionFreq: [{word: String, frequency: Number}],
  Slides:[{SlideID:String/*id from slide model*/, TimeStart:String}],
  LecturePost:[String] //array of ids

});

// Create a model based on the schema
var PodcastModel = mongoose.model('PodcastModel', PodcastModel);

module.exports = {PodcastModel: PodcastModel}
