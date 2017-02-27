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
    getRecommendations : function(request,callback){
      PodcastModel.findById(request.PodcastId,"Recommendations Time",function(err,info){
        callback(info);
      });
    },
    getVideosForCourse: function(request, callback){
      CourseModel.findById( request.CourseId, function(err,course){
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
                            'SRTBlob PodcastUrl Time AudioTranscript NextVideo PrevVideo Slides',
                            function(err,podcast) {
        if(err || podcast == null) {
          console.log("error");
          callback("ERROR");
          return;
        } else {
          srt2vtt(podcast.SRTBlob, function(err, vttData) {
            if (err)
              console.log("ERROR" + err);
            var response = {
              VideoURL : podcast.PodcastUrl,
              VideoDate : podcast.Time,
              SRTFile : vttData.toString('utf8'),
              ParsedAudioTranscriptForSearch : podcast.AudioTranscript,
              Slides : podcast.Slides,
              NextVideo: podcast.NextVideo,
              PrevVideo: podcast.PrevVideo
            };
            callback(response);
          });
        }
      })
    },

    getKeywordSuggestions: function(request, callback) {
      CourseModel.findById(request.CourseId, 'Podcasts', function(err, course) {
        var keywordSuggestions = [];

        for (var i = 0; i < course.Podcasts.length; i++) {
          var arr = course.Podcasts[i].OCRKeywords;
          for (var x = 0; x < arr.length; x++) keywordSuggestions.push(arr[x]);
        }

        var frequency = {};
        keywordSuggestions.forEach((value) => {frequency[value] = 0;});

        keywordSuggestions = keywordSuggestions.filter(
          (value) => {
            return value != undefined && value.length >= request.minKeywordLength && ++frequency[value] == 1;
          }
        );

        keywordSuggestions = keywordSuggestions.sort(
          (a, b) => {return frequency[b] - frequency[a];}
        );

        keywordSuggestions = keywordSuggestions.slice(0, request.count);
        callback(keywordSuggestions);
      });
    },

    searchByKeywords: function(request, callback){
      console.log(new Date());
      CourseModel.findById(request.CourseId,
                          'Podcasts',
                          function(err, course) {
        var results = [];
        var keywordsArr = request.Keywords.split(' ');

        for (let i = 0; i < course.Podcasts.length; i++) {
          for (let j = 0; j < keywordsArr.length; j++) {
            if (keywordsArr[j].length < 1) continue;
            if (course.Podcasts[i].OCRKeywords.indexOf(keywordsArr[j]) != -1) {
              delete course.Podcasts[i].OCRKeywords;
              results.push(course.Podcasts[i]);
              break;
            }
          }
          if (results.length >= request.count) break;
        }

        console.log(new Date());
        callback(results);
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
          return callback({Notes : ""});
        var response = {
          Notes : notes[0].Notes[0].Content
        };
        callback(response);
      });
    },
    createNotes : function(request,callback){
      UserModel.findOne({_id : request.UserId, "Notes.PodcastId" : request.PodcastId}, function(err,user){
        if(user){
          UserModel.update({_id : request.UserId, "Notes.PodcastId" : request.PodcastId}, {"Notes.$.Content" : request.Content},function(err){
            return callback(true);
          });
        }
        else{
          UserModel.update({_id : request.UserId},{$push : {"Notes" : {"PodcastId" : request.PodcastId, "Content" : request.Content}}},function(err){
            return callback(true);
          });
        }
      });
    },
    addUser : function(name,profileId,callback){
      UserModel.create({Name:name, FBUserId: profileId, Notes : [],ProfilePicture : 'http://graph.facebook.com/'+ profileId +'/picture?type=square'}, function(err,users){
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
    getCourseInfo : function(request,callback, neverBefore){
      CourseModel.findById(request.CourseId, '_id Name Quarter', function(err,course){
          if (course == null) {
            this.getPodcastInfo(request, callback, neverBefore);
            return;
          }
          var courseToRet = {
            Id : course._id,
            Course : course.Name,
            Quarter : course.Quarter
          };

        callback(courseToRet);
      }.bind(this));
    },
    getPodcastInfo: function (request, callback, neverBefore) {
      if (neverBefore) {
        callback({});
        return;
      }

      PodcastModel.findById(request.CourseId, '_id CourseId', function(err,course){
        console.log(err);
        console.log(course);
        if (course == null) {
          callback({});
          return;
        }
        request.CourseId = course['CourseId'];
        this.getCourseInfo(request, callback, true);
      }.bind(this));
    }
  },
  postFunctions:{
    getPostsForCourse : function(request, callback){
      PostModel.find({'CourseId': request.CourseId}).sort({TimeOfPost: -1}).exec(function(err,posts){
        if (!posts) {
          callback([]);
          return;
        }
        if(posts.length >= request.UpperLimit){
            posts = posts.slice(0,request.UpperLimit);
        }
        var podcastids = [];
        for(var i = 0; i < posts.length; i++){
          podcastids.push(posts[i].PodcastId);
        }
        PodcastModel.find({"_id" : {$in : podcastids}},"Time",function(err,podcastInfo){
          for(var i = 0; i < posts.length; i++){
            var copy = JSON.parse(JSON.stringify(posts[i]));
            copy.PostId = copy._id;
            delete copy._id;
            delete copy.CourseId;
            posts[i] = copy;
          }
          for(var k = 0; k < podcastInfo.length; k++){
            for(var j = 0; j < posts.length; j++){
              if(posts[j].PodcastId == podcastInfo[k]._id){
                delete posts[j].PodcastId;
                posts[j].LectureDate = podcastInfo[k].Time;
              }
            }
          }
          callback(posts);
        });
      });
    },
    getPostsForLecture : function(request, callback){
      PostModel.find({'PodcastId': request.PodcastId}).sort({TimeOfPost: -1}).exec(function(err,posts){
        if (!posts) {
          callback([]);
          return;
        }
        var podcastids = [];
        for(var i = 0; i < posts.length; i++){
          podcastids.push(posts[i].PodcastId);
        }
        PodcastModel.findById(request.PodcastId,"Time",function(err,podcast){
          for(var i = 0; i < posts.length; i++){
            var copy = JSON.parse(JSON.stringify(posts[i]));
            copy.PostId = copy._id;
            copy.LectureDate = podcast.Time;
            delete copy.PodcastId;
            delete copy._id;
            delete copy.CourseId;
            posts[i] = copy;
          }
          callback(posts);
        });
      });
    },
    getPostsByKeyword : function(request,callback){
      PostModel.find({'CourseId' : request.CourseId,
        $or : [{Content: {$regex : request.Keywords, $options: 'i'}},
        {Comments : {$elemMatch : {Content : {$regex : request.Keywords, $options: 'i'}}}}]}).sort(
        {TimeOfPost: -1}).exec(function (err, posts) {
            if (!posts) {
              callback([]);
              return;
            }
            var podcastids = [];
            for(var i = 0; i < posts.length; i++){
              podcastids.push(posts[i].PodcastId);
            }
            PodcastModel.find({"_id" : {$in : podcastids}},"Time",function(err,podcastInfo){
              for(var i = 0; i < posts.length; i++){
                var copy = JSON.parse(JSON.stringify(posts[i]));
                copy.PostId = copy._id;
                delete copy._id;
                delete copy.CourseId;
                posts[i] = copy;
              }
              for(var k = 0; k < podcastInfo.length; k++){
                for(var j = 0; j < posts.length; j++){
                  if(posts[j].PodcastId == podcastInfo[k]._id){
                    delete posts[j].PodcastId;
                    posts[j].LectureDate = podcastInfo[k].Time;
                  }
                }
              }
              callback(posts);
            });
      });
    },
    createPost: function(request,callback) {
      PodcastModel.findById(request.PodcastId,"CourseId", function(err,podcast){
        PostModel.create({PodcastId : request.PodcastId, SlideOfPost : request.SlideOfPost, TimeOfPost : request.TimeOfPost,
        Content : request.Content, CourseId : podcast.CourseId, Name : request.Name, ProfilePic : request.ProfilePic},function(err,post){
          if(err)
            return callback(false);
          else {
            return callback(post._id);
          }
        });
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
