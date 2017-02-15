var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
var apiFunctions = require('./api.js');
var routes = require('./routes.js');
var passport = require('passport');
var cors = require('cors');
var session = require('express-session');
var auth = require('./config/auth.js');

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

app.use(cors());

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

app.get('/course',apiFunctions.userFunctions.isLoggedIn, function(req, res){
  if(res.locals.stats == 401){
    res.redirect("/auth/facebook");
  }
  else{
  apiFunctions.userFunctions.getCourses(function(courses){
    res.send(courses);
  });
  }
});

// MAT <TODO> USE THIS TO CALL THE API
// http://localhost:3000/auth/facebook?callbackURL=http://www.google.com&errorCallbackURL=http://yahoo.com
// Google.com id parameter will be the user fb auth id
// yahoo.com will have no id parameter
// After calling this api, call another api to generate a session 
// Then work on the get courses api for the next page while cody does the frontend
app.get('/auth/facebook', function(req, res, next) {
  if (req.query.callbackURL == null || req.query.errorCallbackURL == null)  {
    res.send("Error. Invalid params");
    return;
  }
  auth.callbackURL = req.query.callbackURL;
  auth.errorCallback = req.query.errorCallbackURL;
  passport.authenticate('facebook',
    {
      display: 'popup',
      scope: [ 'email', 'basic_info'],
      profileFields: ['id', 'displayName', 'photos', 'email', 'birthday']
  })(req, res, next);
});



app.get("/auth/facebook/callback", function (req, res) {
  passport.authenticate('facebook', function(err, user, info) {
    if (err || !user) {
      res.redirect(auth.errorCallback);
    }
    else {
      var retUrl = auth.callbackURL + "?id=" + user[0].FacebookAuthToken;
      res.redirect(retUrl);
    }

  })(req, res);
});
