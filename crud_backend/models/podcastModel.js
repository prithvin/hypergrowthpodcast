// Create a schema
var mongoose = require('mongoose');
var PodcastModel = new mongoose.Schema({
  ClassName: String,
  QuarterOfCourse: String,
  ClassNameCourseKey: String,
  VideoDate: String,
  NextVideo: String,
  PrevVideo: String,
  PodcastUrl: String,
  PodcastImage: String,
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
