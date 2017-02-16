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
<<<<<<< HEAD
  AudioTranscriptionFreq: [{word: String, frequency: Number}],
=======
  AudioTranscriptionFreq: [{Word: String, Frequency: Number}],
  Slides:[{SlideID:String, TimeStart:String,
            OCRForSlide:String, AudioTranscription:String}],
  LecturePost:[String],
>>>>>>> 6c9572f98b1fc62c5363fc4187149f4138b78702
  RecommendedVideos: [
		{
			PodcastId: Number,
			PodcastImage: String,
<<<<<<< HEAD
			PodcastTitle: String
		}
	],
  Slides:[{SlideID:String, TimeStart:String, TimeEnd:String,
            OCRForSlide:String, AudioTranscription:String,
            RecommendedVideos: [String]}],
  LecturePost:[String] //array of ids
=======
			PodcastName: String
		}
	]
>>>>>>> 6c9572f98b1fc62c5363fc4187149f4138b78702
});

// Create a model based on the schema
var PodcastModel = mongoose.model('PodcastModel', PodcastModel);

module.exports = {PodcastModel: PodcastModel}
