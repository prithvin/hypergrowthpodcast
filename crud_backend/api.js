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
          getVideosForCourse: function(request, callback){
            CourseModel.findById(request.CourseId, function(err,course){
              if(course == null) {
                callback({});
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
            PodcastModel.findById(request.PodcastId,
                                  'SRTBlob PodcastUrl Time AudioTranscript Slides',
                                  function(err,podcast) {
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

          searchByKeywords: function(request, callback){
            CourseModel.findById(request.CourseId,
                                'Podcasts',
                                function(err, course) {
              var callbackFired = false;
              var results = [];
              var count = 0;
              var keywordSuggestions = [];

              // Find the 6 most frequent keywords of length >= 5 for this course
              //////////////////////////////////////////////////////////////////
              for (var i = 0; i < course.Podcasts.length; i++) {
                var arr = course.Podcasts[i].OCRKeywords;
                for (var x = 0; x < 6; x++) keywordSuggestions.push(arr[i]);
              }
              var frequency = {};
              keywordSuggestions.forEach((value) => {frequency[value] = 0;});
              keywordSuggestions = keywordSuggestions.filter(
                (value) => {
                  return value != undefined && value.length >= 5 && ++frequency[value] == 1;
                }
              );
              keywordSuggestions = keywordSuggestions.sort(
                (a, b) => {return frequency[b] - frequency[a];}
              );
              keywordSuggestions = keywordSuggestions.slice(0, 6);
              //////////////////////////////////////////////////////////////////

              for(var i = 0; i < course.Podcasts.length; i++){
                PodcastModel.findById(course.Podcasts[i].PodcastId,
                                      '_id Slides AudioTranscript',
                                      function(err, podcast) {
                  for (var j = 0; j < podcast.Slides.length; j++) {
                    var slide = podcast.Slides[j];

                    if (slide.OCRTranscription.includes(request.Keywords)) {
                      results.push({
                        'PodcastID': podcast._id,
                        'Type': 'OCR',
                        'Data': slide
                      });

                      if (!callbackFired && results.length >= request.count) {
                        callback({'Keywords': keywordSuggestions, 'Results': results});
                        callbackFired = true;
                        return;
                      }
                    }
                  }

                  for (var k = 0; k < podcast.AudioTranscript.length; k++) {
                    var transcript = podcast.AudioTranscript[k];

                    if (transcript.Content.includes(request.Keywords)) {
                      results.push({
                        'PodcastID': podcast._id,
                        'Type': 'Audio',
                        'Data': transcript
                      });

                      if (!callbackFired && results.length >= request.count) {
                        callback({'Keywords': keywordSuggestions, 'Results': results});
                        callbackFired = true;
                        return;
                      }
                    }
                  }

                  count++;

                  // exhausted
                  if (!callbackFired && count == course.Podcasts.length) {
                    callback({'Keywords': keywordSuggestions, 'Results': results});
                    callbackFired = true;
                  }
                });
                if (callbackFired) break;
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
          getUser : function(req,callback){
            UserModel.findById(req.UserId, 'Name ProfilePicture', function(err,user){
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
            CourseModel.find({}, "_id Name Quarter", function(err,courses){
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
            CourseModel.findById(request.CourseId, '_id Name Quarter', function(err,course){
                if (course == null) {
                  callback({});
                  return;
                }

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
            PostModel.find({'CourseId': request.CourseId}, {TimeOfPost: -1}, function(err,posts){
              var response;
              if(posts.length >= request.UpperLimit){
                  posts = posts.slice(0,request.UpperLimit);
              }

              for(var i = 0; i < posts.length; i++){
                var copy = JSON.parse(JSON.stringify(posts[i]));
                copy.PostId = copy._id;
                delete copy._id;
                delete copy.PodcastId;
                delete copy.CourseId;
                posts[i] = copy;
                console.log(posts[i]);
              }
              callback(posts);
            });
          },
          getPostsForLecture : function(request, callback){
            PostModel.find({'PodcastId': request.PodcastId} , {TimeOfPost: -1}, function(err,posts){
              for(var i = 0; i < posts.length; i++){
                var copy = JSON.parse(JSON.stringify(posts[i]));
                copy.PostId = copy._id;
                delete copy._id;
                delete copy.PodcastId;
                delete copy.CourseId;
                posts[i] = copy;
                console.log(posts[i]);
              }
              callback(posts);
            });
          },
          getPostsByKeyword : function(request,callback){
            PostModel.find({'CourseId' : request.CourseId,
              $or : [{Content: {$regex : request.Keywords, $options: 'i'}},
              {Comments : {$elemMatch : {Content : {$regex : request.Keywords, $options: 'i'}}}}]},
              {TimeOfPost: -1}, function (err, posts) {
                if (!posts) {
                  callback([]);
                  return;
                }
                for(var i = 0; i < posts.length; i++){
                  var copy = JSON.parse(JSON.stringify(posts[i]));
                  copy.PostId = copy._id;
                  delete copy._id;
                  delete copy.PodcastId;
                  delete copy.CourseId;
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
            var commentObject = {
              Pic : request.Pic,
              PosterName : request.PosterName,
              Time  : request.Time,
              Content : request.Content
            };

            PostModel.findByIdAndUpdate(
              request.PostId,
              {$push: {'Comments': commentObject}},
              function(err, model) {
                if (err) return callback(false);
                else return callback(true);
              }
            );

          }
        }
}

module.exports = apiFunctions;
