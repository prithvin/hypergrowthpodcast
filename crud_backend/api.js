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
          /*
          request{
            CourseId
          }
          */
          getVideosForCourse: function(request, callback){
            CourseModel.findOne({_id:response.CourseId}, function(err,course){
              if(err) {
                console.log("error finding course");
              } else {
                var response = {
                  Podcasts : course.Podcasts
                };
                callback(response)
              }
            });

          },


          getVideosByKeyword : function(request, callback){

          },
          /*
            request{
              CourseId :
              UpperLimit :
            }
          */
          getPostsForCourse : function(request, callback){
            PostModel.find({CourseId: request.CourseId , $orderby : {Time: -1}},function(err,posts){
              var response;
              if(posts.length >= request.UpperLimit){
                response = {
                  Posts : posts.slice(0,request.UpperLimit)
                };
              }
              else{
                response = {
                  Posts : posts
                };
              }
              callback(response);
            });
          },
          getPostsByKeyword : function(request,callback){

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

          /*
            request{
              PodcastId : podcastId
            }
          */
          getVideoInfo: function(request, callback) {
            PodcastModel.findOne({_id : request.PodcastId}, function(err,podcast) {
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
