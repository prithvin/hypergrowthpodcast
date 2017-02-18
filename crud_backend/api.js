var PodcastModel = require('./models/podcastModel.js');
var UserModel = require('./models/userModel.js');
var PostModel = require('./models/postModel.js');
var CourseModel = require('./models/courseModel.js');
var mongoose = require('mongoose');

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
          getRecentPostsForCourse : function(request,callback){
            PodcastModel.findOne({ClassNameCourseKey:request.ClassNameCourseKey},function(err,podcast){
              var postIds = podcast.LecturePost;
              PostModel.find({_id : {$id : postIds}}, function(err,posts){
                  if(err)
                    console.log("error finding posts");
                  callback(posts);
              });7
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

          getVideoInfo: function(cnameckey, callback) {
            PodcastModel.findOne({ClassNameCourseKey:cnameckey}, function(err,podcast) {
              if(err) {
                console.log("error");
              } else {
                callback(podcast);
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
          getUserInfo: function(profileId,callback){
            UserModel.findOne({ProfileId:profileId},function(err,user){
              if(err)
              console.log("ERROR GETTING USER INFO");
              callback(err,user);
            });
          },
          isLoggedIn : function(req,res,next){
            if (req.isAuthenticated()){
                return next();
                console.log(res);
            }
            else {
                res.redirect('/login');
            }

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
          /*getUserData : function(email, callback){
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
          },*/
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

          createPost: function(classnamecoursekey,fbauthid,commentCont,callback) {
              var cnameckey = classnamecoursekey;
              var FBAuthID = fbauthid;
              var postContent = postContent;

              PodcastModel.findOne({ClassNameCourseKey : cnameckey}, function(err,podcast){
                PostModel.create({Content: postContent}, function(err,post){
                  apiFunctions.userFunctions.getUserInfo(FBAuthID,function(user){
                    post.NameOfUser = user.Name;
                    post.ProfilePicture = user.ProfilePicture;
                    post.Content = postContent;
                    podcast.LecturePost.push(post);
                    callback({successful:true});
                  });
                });
              });

              // @response should be true or false on successful/unsuccessful comment
          },

          createComment: function(postid,fbauthid,content,callback) {
            var postID = postid;
            var FBAuthID = fbauthid;
            var commentContent = content;

            PodcastModel.findOne({ClassNameCourseKey : cnameckey}, function(err,podcast){
              PostModel.create({Content: postContent}, function(err,post){
                apiFunctions.userFunctions.getUserInfo(FBAuthID,function(user){
                  post.NameOfUser = user.Name;
                  post.ProfilePicture = user.ProfilePicture;
                  post.Content = postContent;
                  podcast.LecturePost.push(post);
                  callback({successful:true});
                });
              });
            });
            // @response should be true or false on successful/unsuccessful post
          }
        }
}

module.exports = apiFunctions;
