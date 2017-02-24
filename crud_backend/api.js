var PodcastModel = require('./models/podcastModel.js');
var UserModel = require('./models/userModel.js');
var PostModel = require('./models/postModel.js');
var CourseModel = require('./models/courseModel.js');
var mongoose = require('mongoose');
var fs = require('fs');
var srt2vtt = require('srt2vtt');

//API Functions
var apiFunctions = {
        //API Functions for podcast schema
        podcastFunctions:{
          //dummy function
          createPodcasts: function(){/*
            PodcastModel.create({ClassName: "CSE100", QuarterOfCourse: "Winter", ClassNameCourseKey:"CSE100" + "Winter", PodcastUrl:'https://podcast.ucsd.edu/podcasts/default.aspx?PodcastId=3743&l=6&v=1',
            OCRTranscriptionFreq: [{word:'BST', freq: 2}, {word: "Iterator", freq: 3}]}, function(err, podcasts){
            if(err) console.log(err);
              else console.log(podcasts);
            });*/
          },
          //get all posts for course sorted
          /*
          var response{
            ClassNameCourseKey : value
          }

        }*/
          /*
          request{
            CourseId
          }
          */
          getVideosForCourse: function(request, callback){
            CourseModel.findOne({_id: request.CourseId}, function(err,course){
              if(err) {
                console.log("error finding course");
              } else {
                var copy = [];
                for(var i = 0; i < course.Podcasts.length; i++){
                  var arrayObject = {
                    Id : course.Podcasts[i].PodcastId,
                    Time : course.Podcasts[i].Time,
                    PreviewImage : course.Podcasts[i].PodcastImage
                  };
                  copy.push(arrayObject);
                }
                var response = {
                  CourseTitle : course.Name + " " + course.Quarter,
                  Videos : copy
                };
                callback(response)
              }
            });

          },

          /*
            request{
              PodcastId : podcastId
            }
          */
          getVideoInfo: function(request, callback) {
            PodcastModel.findOne({"_id" : request.PodcastId}, function(err,podcast) {
              if(err) {
                console.log("error");
              } else {
                srt2vtt(podcast.SRTBlob, function(err, vttData) {
                  if (err)
                    console.log("ERROR" + err);
                  var response = {
                    VideoURL : podcast.PodcastUrl,
                    VideoDate : podcast.Time,
                    SRTFile : vttData.toString('utf8'),
                    ParsedAudioTranscriptForSearch : podcast.AudioTranscript,
                    Slides : podcast.Slides
                  };
                  callback(response);
                });
              }
            })
          },
        },

        //functions to retrieve and create user information
        userFunctions:{
          //middleware do not remove
          isLoggedIn : function(req,res,next){
            if (req.isAuthenticated()){
                return next();
                console.log(res);
            }
            else {
                console.log("HERE'S THE REDIRECT URL" + req.url);
                res.redirect('/login?callbackURL=' + req.url);
            }

          },
          getUser : function(req,callback){
            UserModel.findOne({"_id":req.UserId},function(err,user){
              var response = {
                Name : user.Name,
                Pic : user.ProfilePicture
              }

              callback(response);
            });
          },
          getNotesForUser : function(req,callback){
              console.log("The user is inside is" + req.UserId);
              //query commented out, don't remove
              UserModel.find({_id : req.UserId, "Notes.PodcastId" : req.PodcastId},{"Notes.Content" : 1},function(err,notes){
              if(notes.length == 0)
                return callback({Content : ""});
              var response = {
                Content : notes[0].Notes[0].Content
              };
              callback(reponse);
            });
          },
          addUser : function(name,profileId,callback){
            UserModel.create({Name:name, FBUserId: profileId, ProfilePicture : 'http://graph.facebook.com/'+ profileId +'/picture?type=square'}, function(err,users){
            if(err) {
            console.log(err);
            }
            else{
                console.log("HERE ARE THE USERS" + users);
                callback(err,users);
            }
            });
          },
          //adds courses for the user
          addCoursesForUser : function(request,callback){
            var FBAuthID = request.FBAuthID;
            var ClassNameCourseKey = request.ClassNameCourseKey;

          },
        },
        courseFunctions :{
          getCourses : function(callback){
            CourseModel.find({},function(err,courses){
              for(var i = 0; i < courses.length; i++){
                var object = {
                  Id : courses[i]._id,
                  Course : courses[i].Name,
                  Quarter : courses[i].Quarter
                };
                courses[i] = object;
              }
              callback(courses);
            });

          },
          getCourseInfo : function(request,callback){
            CourseModel.findOne({CourseId : request.courseId},function(err,course){
                var courseToRet = {
                  Id : course._id,
                  Course : course.Name,
                  Quarter : course.Quarter
                };

              callback(courseToRet);
            });
          }
        },
        postFunctions:{
          getPostsForCourse : function(request, callback){
            PostModel.find({/*CourseId: request.CourseId ,*/$query : {},$orderby : {TimeOfPost: -1}},function(err,posts){
              var response;
              if(posts.length >= request.UpperLimit){
                  posts = posts.slice(0,request.UpperLimit);
              }

              for(var i = 0; i < posts.length; i++){
                var copy = JSON.parse(JSON.stringify(posts[i]));
                copy.PostId = copy._id;
                delete copy._id;
                copy.PodcastId = undefined;
                copy.CourseId = undefined;
                posts[i] = copy;
                console.log(posts[i]);
              }
              callback(posts);
            });
          },
          getPostsForLecture : function(request, callback){
            PostModel.find({$query : {PodcastId: request.podcastId} , $orderby : {TimeOfPost: -1}},function(err,posts){
              for(var i = 0; i < posts.length; i++){
                var copy = JSON.parse(JSON.stringify(posts[i]));
                copy.PostId = copy._id;
                delete copy._id;
                copy.PodcastId = undefined;
                copy.CourseId = undefined;
                posts[i] = copy;
                console.log(posts[i]);
              }
              callback(posts);
            });
          },
          getPostsByKeyword : function(request,callback){
            PostModel.find({$query : {PodcastId:request.PodcastId,CourseId:request.CourseId,
              $or : [{$elemMatch : {Content: {$in : request.Keywords}}},
              {Comments : {$elemMatch : {Content : {$in : request.Keywords}}}}]}, $orderby : {TimeOfPost: -1}}, function (err, posts) {
                for(var i = 0; i < posts.length; i++){
                  var copy = JSON.parse(JSON.stringify(posts[i]));
                  copy.PostId = copy._id;
                  delete copy._id;
                  copy.PodcastId = undefined;
                  copy.CourseId = undefined;
                  posts[i] = copy;
                  console.log(posts[i]);
                }
                callback(posts);
            });
          },
          createPost: function(request,callback) {
            PostModel.create({PodcastId : request.PodcastId, SlideOfPost : request.SlideOfPost, TimeOfPost : request.TimeOfPost,
            Content : request.Content, CourseId : request.CourseId, Name : request.Name, ProfilePic : request.ProfilePic},function(err,post){
              if(err)
                callback(false);
              else {
                callback(true);
              }
            });
          },

          createComment: function(request,callback) {
            PostModel.find({"_id" : request.PostId}, function(err, post){
                if(err)
                  return callback(false);
                var commentObject = {
                  Pic : request.Pic,
                  PosterName : request.PosterName,
                  Time  : request.Time,
                  Content : request.Content
                };

                post.Comments.push(commentObject);
                return callback(true);
            });
          }
        }
}

module.exports = apiFunctions;
