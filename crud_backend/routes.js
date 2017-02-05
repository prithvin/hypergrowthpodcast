var express = require('express');
var router = express.Router();
var apiFunctions = require('./api.js');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', function(req,res){
  res.send("Routed to main page");
});

router.get('/courses/:course/:keywords',function(req,res){
  console.log(req.params);
  console.log(req.params.course + "" + req.params.keywords);
  apiFunctions.podcastFunctions.findPodcastsByKeyword(req.params.course ,req.params.keywords, function(response){
    res.send(response);
  });
});


module.exports = router;
