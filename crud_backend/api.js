var PodcastModel = require('./models/PodcastModel.js').PodcastModel;
var mongoose = require('mongoose');

//API Functions
var apiFunctions = {
        //API Functions for podcast schema
        createPodcasts: function(){
          PodcastModel.create({podcastName:'BSTPodcast', podcastUrl:'https://podcast.ucsd.edu/podcasts/default.aspx?PodcastId=3743&l=6&v=1',
          keywords: ['BST', 'Iterator']}, function(err, podcasts){
            if(err) console.log(err);
            else console.log(podcasts);
          });

        },
        findPodcasts: function(keywordParams){
          PodcastModel.find({keywords: {$in : keywordParams.split(" ")}}, function (err, podcasts) {
              console.log(podcasts);
            });
        }
}

module.exports = apiFunctions;
