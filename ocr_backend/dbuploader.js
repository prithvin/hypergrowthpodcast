var mongoose = require('mongoose');
var PodcastModel = require('./podcastModel.js').PodcastModel;
var CourseModel = require('./courseModel.js').CourseModel;

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
      CourseModel.findOne({_id: course}, 'Podcasts', function (err, podcasts){
        if (err) {
          console.error("Issue connecting to database");
          console.error(err);
        }
        else {
          callback(podcasts.Podcasts);
        }
      });
    });
  },
  setRecommendations: function (id, recommendations, prevId, nextId, callback) {
    connectMongo(function () {
      PodcastModel.update({_id: id}, {$set: {Recommendations: recommendations, PrevVideo: prevId, NextVideo: nextId}},
                          function (err, podcast){
        if (err) {
          console.error("Issue connecting to database");
          console.error(err);
        }
        else {
          callback();
        }
      });
    });
  },
  addPodcast: function (obj, callback) {
    connectMongo(function () {
      module.exports.getCourseList(function(courseList) {
        var i;
        var index = -1;
        var course;
        var tmpImage = obj.Image;
        delete obj.Image;
        var tmpKeywords = obj.OCRKeywords;
        delete obj.OCRKeywords;

        for (i = 0; i < courseList.length; i++) {
          if (courseList[i]['Name'] == obj['Name'] && courseList[i]['Quarter'] == obj['Quarter']) {
            index = i;
            break;
          }
        }

        if (index < 0) {
          module.exports.addCourse(obj, function(newCourseId) {
            delete obj.Name;
            delete obj.Quarter;
            obj.CourseId = newCourseId;

            PodcastModel.create(obj, function (err, podcast){
              if (err) {
                console.error("Issue connecting to database");
                console.error(err);
              }
              else {
                CourseModel.findById(newCourseId, function(err, course) {
                  course.Podcasts.push({
                    PodcastId: podcast['_id'],
                    PodcastImage: tmpImage,
                    OCRKeywords: tmpKeywords,
                    Time: obj.Time
                  });
                  course.save();
                });

                callback(podcast['_id'], obj.CourseId);
              }
            });
          });
        }

        else {
          delete obj.Name;
          delete obj.Quarter;
          obj.CourseId = courseList[index]._id;

          PodcastModel.create(obj, function (err, podcast){
            if (err) {
              console.error("Issue connecting to database");
              console.error(err);
            }
            else {
              CourseModel.findById(obj.CourseId, function(err, course) {
                course.Podcasts.push({
                  PodcastId: podcast['_id'],
                  PodcastImage: tmpImage,
                  OCRKeywords: tmpKeywords,
                  Time: obj.Time
                });
                course.save();
              });

              callback(podcast['_id'], obj.CourseId);
            }
          });
        }
      });
    });
  },
  addCourse: function(obj, callback) {
    connectMongo(function () {
      CourseModel.create({Name: obj.Name, Quarter: obj.Quarter, Podcasts: []}, function(err, course) {
        if (err) {
          console.error("Issue connecting to database");
          console.error(err);
        }
        else {
          callback(course['_id']);
        }
      });
    });
  },
  getCourseList: function (callback) {
    connectMongo(function () {
      CourseModel.find({}, '_id Name Quarter', function (err, courses){
        if (err) {
          console.error("Issue connecting to database");
          console.error(err);
        }
        else {
          callback(courses);
        }
      });
    });
  }
}
