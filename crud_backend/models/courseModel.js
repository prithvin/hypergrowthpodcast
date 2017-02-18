var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CourseModel = mongoose.Schema({
	Name: String,
	Quarter: String,
	Podcasts: [{
  PodcastId: Schema.Types.ObjectId,//_id for podcast
  PodcastImage: String,
  OCRKeywords: [String], //words ordered by frequencies with any words above a baseline frequency.
	Time: Number //milliseconds
	}]
});

// Create a model based on the schema
var CourseModel = mongoose.model('CourseModel', CourseModel);

module.exports = {CourseModel: CourseModel};
