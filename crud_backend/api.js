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
          /*
            request{
              CourseId :
              UpperLimit :
            }
          */
          /*findPodcastsByKeyword: function(courseKey,keywordParams,callback){
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
          },*/

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
            UserModel.create({Name:name, FBUserId: profileId}, function(err,users){
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
              console.log(courses);
              callback(courses);
            });

          },
          getCourseInfo : function(request,callback){
            CourseModel.findOne({CourseId : request.courseId},function(err,course){
              var response = {
                CourseName : course.Name,
                ClassQuarter : course.Quarter
              }
              callback(response);
            });
          }
        },
        postFunctions:{
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
          getPostsForLecture : function(request, callback){
            PostModel.find({PodcastId: request.podcastId , $orderby : {Time: -1}},function(err,posts){
              var response = {
                  Posts : posts
              };
              callback(response);
            });
          },
          getPostsByKeyword : function(request,callback){
            PostModel.find({PodcastId:request.PodcastId,CourseId:request.CourseId,
              $or : [{$elemMatch : {Content: {$in : request.Keywords}}},
              {Comments : {$elemMatch : {Content : {$in : request.Keywords}}}}]}, function (err, posts) {
              callback(posts);
            });
          },
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
