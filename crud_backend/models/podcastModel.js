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
  OCRTranscriptionFreq: [{Word: String, Frequency: Number}],
  AudioTranscription: String,
  AudioTranscriptionFreq: [{Word: String, Frequency: Number}],
  Slides:[{SlideID:String, TimeStart:String, TimeEnd:String,
            OCRForSlide:String, AudioTranscription:String}],
  LecturePost:[String],
  RecommendedVideos: [
		{
			PodcastId: Number,
			PodcastImage: String,
			PodcastName: String
		}
	]
});

// Create a model based on the schema
var PodcastModel = mongoose.model('PodcastModel', PodcastModel);

module.exports = {PodcastModel: PodcastModel}
