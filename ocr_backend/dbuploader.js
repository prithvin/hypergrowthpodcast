var mongoose = require('mongoose');
var PodcastModel = require('./podcastModel.js').PodcastModel;
var CourseModel = require('./courseModel.js').CourseModel;
var base64resize = require('base64resize');
var PostModel = require('./postModel.js').PostModel;

var isMongoConnected = false;

function connectMongo (callback) {
  if (isMongoConnected)  {
    callback(); return;
  }

  //mongoose.connect('mongodb://testUser:testUser@ds139899.mlab.com:39899/testdbnaruto', function(error){
  mongoose.connect('mongodb://localhost:27017/testdbnaruto', function(error) {
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
  },

  getOneImage: function(id, callback) {
    connectMongo(function () {
      CourseModel.findById(id, 'Podcasts', function (err, course){
        if (err) {
          console.error("Issue connecting to database");
          console.error(err);
        }

        else {
          callback(course.Podcasts[0].PodcastImage);
        }
      });
    });
  },

  shrinkImages: function (id, callback) {
    connectMongo(function () {
      CourseModel.findById(id, 'Podcasts', function (err, course){
        if (err) {
          console.error("Issue connecting to database");
          console.error(err);
        }

        else {
          for (let i = 0; i < course.Podcasts.length; i++) {
            base64resize({
              'src': 'data:image/jpeg;base64,' + course.Podcasts[i].PodcastImage,
              'width': 160,
              'height': 100
            }, (e, s) => {
              course.Podcasts[i].PodcastImage = s;
              console.log(i);
              if (i == course.Podcasts.length - 1) {
                course.save((err, updated) => {callback();});
              }
            });
          }
        }
      });
    });
  },

  validateURLs: function (id, callback) {
    connectMongo(function () {
      PodcastModel.find({CourseId: id}, function (err, podcasts){
        if (err) {
          console.error("Issue connecting to database");
          console.error(err);
        }
        else {
          var prefix = 'http://podcast-media.ucsd.edu.s3-website-us-west-2.amazonaws.com/Podcasts/';
          for (let i = 0; i < podcasts.length; i++) {
            podcasts[i].PodcastUrl = prefix + podcasts[i].PodcastUrl.slice(34);
            console.log(podcasts[i].PodcastUrl);
            if (i == podcasts.length - 1) callback();
          }
        }
      });
    });
  },

  fixURLs: function (id, callback) {
    connectMongo(function () {
      PodcastModel.find({CourseId: id}, function (err, podcasts){
        if (err) {
          console.error("Issue connecting to database");
          console.error(err);
        }
        else {
          var prefix = 'http://podcast-media.ucsd.edu.s3-website-us-west-2.amazonaws.com/Podcasts/';
          for (let i = 0; i < podcasts.length; i++) {
            podcasts[i].PodcastUrl = prefix + podcasts[i].PodcastUrl.slice(34);
            podcasts[i].save((err, updated) => {console.log(i);});
            if (i == podcasts.length - 1) callback();
          }
        }
      });
    });
  },

  generateFakePosts: function (objects, callback) {
    connectMongo(function () {
      PodcastModel.find({}, '_id CourseId Time Slides', function(err, podcasts) {
        for (let i = 0; i < objects.length; i++) {
          var obj = objects[i];

          var chosenPodcast = podcasts[Math.floor(Math.random() * podcasts.length)];
          obj.PodcastId = chosenPodcast._id;
          obj.CourseId = chosenPodcast.CourseId;
          obj.SlideOfPost = Math.floor(Math.random() * chosenPodcast.Slides.length) + 1;

          var diff = new Date().getTime() - chosenPodcast.Time;

          obj.TimeOfPost = chosenPodcast.Time + diff * Math.random();
          var last = obj.TimeOfPost;
          diff = new Date().getTime() - last;
          for (let j = 0; j < obj.Comments.length; j++) {
            obj.Comments[j].Time = last + diff * Math.random();
            last = obj.Comments[j].Time;
            diff = new Date().getTime() - last;
          }

          PostModel.create(obj, function(err, post) {
            if (err) {
              console.error("Issue connecting to database");
              console.error(err);
            }
            else {
              callback(post.PodcastId);
            }
          });
        }
      });
    });
  },

  removeFakePosts: function (callback) {
    connectMongo(function () {
      PostModel.find({ $or: [
        {'Name': 'Elizabeth Bennet'},
        {'Name': 'Fitzwilliam Darcy'},
        {'Name': 'Jane Bennet'},
        {'Name': 'Charles Bingley'},
        {'Name': 'Mr Bennet'},
        {'Name': 'Mrs Bennet'},
        {'Name': 'Mary Bennet'},
        {'Name': 'Kitty Bennet'},
        {'Name': 'Lydia Bennet'},
        {'Name': 'Caroline Bingley'},
        {'Name': 'George Wickham'},
        {'Name': 'William Collins'},
        {'Name': 'Lady Catherine de Bourgh'},
        {'Name': 'Georgiana Darcy'},
        {'Name': 'Charlotte Lucas'},
      ]}).remove(callback);
    });
  },

  getNoRecommendations: function(callback) {
    connectMongo(function () {
      PodcastModel.find({"Recommendations": []}, 'CourseId', callback);
    });
  },

  makeHTTPS: function(callback) {
    connectMongo(function() {
      PodcastModel.find({}, '_id PodcastUrl', function(err, podcasts) {
        for (let i = 0; i < podcasts.length; i++) {
          var podcast = podcasts[i];
          if (podcast.PodcastUrl.indexOf('https') == -1 && podcast.PodcastUrl.indexOf('aws') == -1) {
            PodcastModel.update(
              {_id: podcast._id},
              {$set: {'PodcastUrl': 'https' + podcast.PodcastUrl.slice(4)}},
              function(a, b) {callback(podcast._id);}
            );
          }
        }
      });
    });
  }
}
