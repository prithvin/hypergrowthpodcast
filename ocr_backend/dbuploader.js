var mongoose = require('mongoose');
var PodcastModel = require('./podcastModel.js').PodcastModel;
var SlideModel = require('./slideModel.js').SlideModel;

var isMongoConnected = false;

function connectMongo (callback) {
  if (isMongoConnected)  {
    callback(); return;
  }

  mongoose.connect('mongodb://testUser:testUser@ds139899.mlab.com:39899/testdbnaruto', function(error){
    if(error){
      console.log("Error Connecting" + error);
      console.log("Trying again...");
      setTimeout(function () {
        connectMongo(callback);
      }, 1000);
    }
    else{
      console.log("Connection Successful");
      isMongoConnected = true;
      callback();
    }
  });
}


module.exports = {
  getPodcastList: function (callback) {
    connectMongo(function () {
      PodcastModel.find({}, 'PodcastUrl', function (err, podcasts){
        if (err) {
          console.error("Issue connecting to database");
          console.error(err);
        }
        else {
          callback(podcasts);
        }
      });
    });
  },
  getPodcastsForCourse: function (course, callback) {
    connectMongo(function () {
      PodcastModel.find({ClassNameCourseKey: course}, '_id PodcastImage PodcastName', function (err, podcasts){
        if (err) {
          console.error("Issue connecting to database");
          console.error(err);
        }
        else {
          callback(podcasts);
        }
      });
    });
  },
  addPodcast: function (obj, callback) {
    connectMongo(function () {
      PodcastModel.create(obj, function (err, podcasts){
        if (err) {
          console.error("Issue connecting to database");
          console.error(err);
        }
        else {
          callback(podcasts['_id']);
        }
      });
    });
  },
  addSlide: function (obj, callback) {
    connectMongo(function () {
      SlideModel.create(obj, function (err, slides){
        if (err) {
          console.error("Issue connecting to database");
          console.error(err);
        }
        else {
          callback(slides['_id']);
        }
      });
    });
  }
}
