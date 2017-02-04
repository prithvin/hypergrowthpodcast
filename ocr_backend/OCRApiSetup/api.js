var Todo = require('./models/PodcastModel.js').Todo;
var mongoose = require('mongoose');

//API Functions
var apiFunctions = {

  //API Functions for podcast schema
  var podcastSchemaFunction = {

      findPodcast: function(){
        Todo.create({name: 'Create something with Mongoose', completed: true, note: 'this is one'}, function(err, todo){
          if(err) console.log(err);
          else console.log(todo);
      });,



    }
  }
}

module.exports = apiFunctions;
