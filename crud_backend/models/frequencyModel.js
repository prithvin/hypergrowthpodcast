var mongoose = require('mongoose');
var FrequencyModel = new mongoose.Schema({
  Word : String,
  Frequency: Number
});

// Create a model based on the schema
var FrequencyModel = mongoose.model('FrequencyModel', FrequencyModel);

module.exports = {FrequencyModel: FrequencyModel}
