var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
var apiFunctions = require('./api.js');
var routes = require('./routes.js');
var passport = require('passport');
var session = require('express-session');
app.use(session({
    secret: 'cse110secretstring',
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
var myPassport = require('./config/passport.js');


mongoose.connect('mongodb://testUser:testUser@ds139899.mlab.com:39899/testdbnaruto', function(error){
  if(error){
    console.log("Error Connecting" + error);
  }
  else{
    console.log("Connection Successful");
    apiFunctions.podcastFunctions.createPodcasts();
  }
});

app.listen(3000, function() {
  console.log('listening on 3000')
})

app.get('/', function(req,res){
  res.send("Routed to main page");
});

app.get('/courses/:course/:keywords',function(req,res){
  console.log(req.params);
  console.log(req.params.course + "" + req.params.keywords);
  apiFunctions.podcastFunctions.findPodcastsByKeyword(req.params.course ,req.params.keywords, function(response){
    res.send(response);
  });
});

app.get('/course',myPassport.isLoggedIn, function(req, res){
  apiFunctions.userFunctions.getCourses(function(courses){
    res.send(courses);
  });
});

app.get("/auth/facebook", passport.authenticate("facebook", { scope : ['email'] }));

app.get("/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect : "/course",
        failureRedirect : "/",
}));
