var PodcastModel = require('./models/podcastModel.js').PodcastModel;
var UserModel = require('./models/userModel.js').UserModel;
var SlideModel = require('./models/slideModel.js').SlideModel;
var PostModel = require('./models/PostModel.js').PostModel;
var mongoose = require('mongoose');

//API Functions
var apiFunctions = {
        //API Functions for podcast schema
        podcastFunctions:{
          //dummy function
          createPodcasts: function(){
            PodcastModel.create({ClassName: "CSE100", QuarterOfCourse: "Winter", ClassNameCourseKey:"CSE100" + "Winter", PodcastUrl:'https://podcast.ucsd.edu/podcasts/default.aspx?PodcastId=3743&l=6&v=1',
            OCRTranscriptionFreq: [{word:'BST', freq: 2}, {word: "Iterator", freq: 3}]}, function(err, podcasts){
            if(err) console.log(err);
              else console.log(podcasts);
            });
          },

          getRecentPostsForCourse : function(cnameckey,callback){
            PodcastModel.findOne({ClassNameCourseKey:cnameckey},function(err,podcast){
              var postIds = podcast.LecturePost;
              PostModel.find({_id : {$id : postIds[i]}}, function(err,posts){
                  if(err)
                    console.log("error finding posts");
                  callback(posts);
              });
            });
          },

          getRecentVideosForCourse : function(){
            PodcastModel.find({ClassNameCourseKey:cnameckey}, function(err,podcasts){
              if(err) {
                console.log("error finding course");
              } else {
                var arrayOfPodcasts = [];
                for(var i = 0; i < podcasts.length; i++) {
                  var responseData = {
                    //TODO-lectureId: podcasts[0].LectureId (from search)
                    lectureImage: podcasts[i].PodcastImage,
                    courseQtr: podcasts[i].QuarterOfCourse,
                    lectureName: podcasts[i].ClassName,
                    lectureDate: podcasts[i].VideoDate
                  };
                  arrayOfPodcasts.push(responseData);
                }

                callback({ Podcasts : arrayOfPodcasts });
              }
            });

          },

          findPodcastsByKeyword: function(courseKey,keywordParams,callback){
            PodcastModel.find({ClassNameCourseKey:courseKey, OCRTranscriptionFreq:{$elemMatch : {word: {$in : keywordParams.split(" ")}}}}, function (err, podcasts) {
              var arrayOfPodcasts = [];
              for(var i = 0; i < podcasts.length; i++){
                var podcastObject = {
                  //Todo
                }
                arrayOfPodcasts.push(podcastObject);
              }
              callback({
                Podcasts : arrayOfPodcasts
              });
            });
          },

          getVideoInfo: function(lectureId, callback) {
            PodcastModel.find({_id:lectureId}, function(err,podcast) {
              if(err) {
                console.log("error");
              } else {
                var response = {
                  lectureDate: podcast[0].VideoDate,
                  prevVideoId: podcast[0].PrevVideo,
                  nextVideoId: podcast[0].NextVideo,
                  podcastURL: podcast[0].PodcastUrl,
                  audioTranscipt: podcast[0].AudioTranscription,
                  slideTimings: podcast[0].Slides,
                };
              }
            })
          },

          getVideoForUser: function(lectureId, fbAuthId, callback) {
            UserModel.find({FacebookAuthToken:fbAuthId}, function(err, users) {
              if(err) {
                console.log("error");
              } else {
                var response = {
                  NotesForLecture: users[0].WatchHistory
                };
                callback(response);
              }
            });
          }
        },

        //functions to retrieve and create user information
        userFunctions:{
          getUserInfo: function(fbtoken,callback){
            UserModel.findOne({FacebookAuthToken:fbtoken},function(err,user){
              if(err)
              console.log("ERROR GETTING USER INFO");
              callback(err,user);
            });
          },
          isLoggedIn : function(req,res,next){
            if (req.isAuthenticated()){
                res.locals.stats = 200;
                return next();
            }

            res.locals.stats = 401;
            return next();
          },
          addUser : function(name,token,profileId,callback){
            UserModel.create({Name:name, ProfileId: profileId, FacebookAuthToken:token}, function(err,users){
            if(err) {
            console.log(err);
            }
            else{
                console.log("HERE ARE THE USERS" + users);
                callback(err,users);
            }
            });
          },
          //gets user profile picture and user information
          getUserData : function(email, callback){
            UserModel.find({Email:email}, function(err,users){
              if(users.length > 1){
                console.log("USER NOT UNIQUE");
              }
              else if(users.length == 0){
                console.log("INVALID USER");
              }
              var response = {
                ProfilePicture: users[0].ProfilePicture,
                Name:users[0].Name
              };
              callback(response);
            });
          },
          //Gets unique courses
          getCourses : function(callback){
            PodcastModel.aggregate({ $group: { _id: { ClassName: "$ClassName", QuarterOfCourse: "$QuarterOfCourse" , ClassNameCourseKey: "$ClassNameCourseKey"} } },function(err,uniqueCourses){
              console.log(uniqueCourses);
              callback(uniqueCourses);
            });

          },

          //adds courses for the user
          addCoursesForUser : function(request,callback){
            var FBAuthID = request.FBAuthID;
            var ClassNameCourseKey = request.ClassNameCourseKey;

          }
        },
        slideFunctions:{

        },
        postFunctions:{
          createComment: function(request, callback) {
              var postID = request.postID;
              var FBAuthID = request.FBAuthID;
              var commentContent = request.commentContent;

              // @response should be true or false on successful/unsuccessful comment
          },

          createPost: function(request, callback) {
            var postID = request.postID;
            var FBAuthID = request.FBAuthID;
            var postContent = request.postContent;

            // @response should be true or false on successful/unsuccessful post
          }
        }
}

module.exports = apiFunctions;
