var express = require('express');
var router = express.Router();
var apiFunctions = require('./api.js');

router.get('/', function(req,res){
  res.send("Routed to main page");
});

router.get('/search/:keywords',function(req,res){
  console.log(req.params.keywords);
  apiFunctions.podcastFunctions.findPodcasts(req.params.keywords);
});


module.exports = router;
