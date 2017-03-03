// Create a schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NewPodcastModel = new mongoose.Schema({
	CourseId: Schema.Types.ObjectId, // id for course it belongs to
	Time: Number,
	Slides: [],
	AudioTranscript: []
});

// Create a model based on the schema
var NewPodcastModel = mongoose.model('NewPodcastModel', NewPodcastModel, 'podcastmodels');

module.exports = NewPodcastModel;
