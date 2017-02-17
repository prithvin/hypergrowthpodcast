var mongoose = require('mongoose');
var NotesModel = new mongoose.Schema({
  PodcastId : Schema.Types.ObjectId,
  Content: String
});

// Create a model based on the schema
var NotesModel = mongoose.model('NotesModel', NotesModel);

module.exports = {NotesModel: NotesModel}
