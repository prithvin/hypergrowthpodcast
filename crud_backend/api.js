var PodcastModel = require('./models/podcastModel.js').PodcastModel;
var UserModel = require('./models/userModel.js').UserModel;
var SlideModel = require('./models/slideModel.js').SlideModel;
var PostModel = require('./models/PostModel.js').PostModel;
var mongoose = require('mongoose');

//API Functions
var apiFunctions = {
        //API Functions for podcast schema
        coursePageFunctions:{
          //dummy functions
          createPodcasts: function(){
            PodcastModel.create({ClassName: "CSE100", QuarterOfCourse: "Winter", ClassNameCourseKey:"CSE100" + "Winter", PodcastUrl:'https://podcast.ucsd.edu/podcasts/default.aspx?PodcastId=3743&l=6&v=1',
            OCRTranscriptionFreq: [{word:'BST', freq: 2}, {word: "Iterator", freq: 3}]}, function(err, podcasts){
            if(err) console.log(err);
              else console.log(podcasts);
            });
          },
          findPodcastsByKeyword: function(courseKey,keywordParams){
            PodcastModel.find({ClassNameCourseKey:courseKey, OCRTranscriptionFreq:{$elemMatch : {word: {$in : keywordParams.split(" ")}}}}, function (err, podcasts) {
                console.log(podcasts);
            });
          }
        },
        userFunctions:{

        },
        slideFunctions:{

        },
        postFunctions:{

        }
}

module.exports = apiFunctions;
