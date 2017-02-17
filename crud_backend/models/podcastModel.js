// Create a schema
var mongoose = require('mongoose');
var PodcastModel = new mongoose.Schema({
  ClassName: String,
  QuarterOfCourse: String,
  ClassNameCourseKey: String,
  VideoDate: String,
  NextVideo: String,
  PrevVideo: String,
  PodcastName: String,
  PodcastUrl: String,
  PodcastImage: String,
  OCRTranscription: String,
  OCRTranscriptionFreq: [Schema.Types.ObjectId],
  AudioTranscription: String,
  AudioTranscriptionFreq: [Schema.Types.ObjectId],
  Slides:[Schema.Types.ObjectId],
  LecturePost:[Schema.Types.ObjectId],
  RecommendedVideos: [Schema.Types.ObjectId]
});

// Create a model based on the schema
var PodcastModel = mongoose.model('PodcastModel', PodcastModel);

module.exports = {PodcastModel: PodcastModel}
