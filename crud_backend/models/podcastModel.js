// Create a schema
var mongoose = require('mongoose');
var PodcastModel = new mongoose.Schema({
  podcastName: String,
  podcastUrl: String,
  keywords: []
});

// Create a model based on the schema
var PodcastModel = mongoose.model('PodcastModel', PodcastModel);

module.exports = {PodcastModel: PodcastModel}
