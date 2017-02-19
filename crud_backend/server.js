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
var path = require('path');
var fs = require('fs');

app.use(session({
    secret: 'cse110secretstring',
    resave: true,
    saveUninitialized: true,
    maxAge: 86400000 // 24 hours in milliseconds
}));
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

/******************************************************************ROUTES*******************************************************************/

app.get('/', apiFunctions.userFunctions.isLoggedIn,function(req,res){
  res.send("MAIN PAGE ROUTE");
});

app.get('/login', function(req,res){
  if(req.user){
    res.redirect("/");
  }
  else {
    res.sendfile('./index.html', {root: __dirname });
  }
});


app.get('/getPostsForLecture',apiFunctions.userFunctions.isLoggedIn,function(req,res){
  var request = {
    PodcastId : req.query.PodcastId
  };
  /*use response.posts to get an array of post objects*/
  apiFunctions.postFunctions.getPostsForLecture(request, function(response){
    res.send(response);
  });
});

app.get('/getPostsForCourse',apiFunctions.userFunctions.isLoggedIn,function(req,res){
  var request = {
    CourseId : req.query.CourseId,
    UpperLimit : 20
  };
  /*use response.posts to get an array of post objects*/
  apiFunctions.postFunctions.getPostsForCourse(request, function(response){
    res.send(response);
  });
});

//request format should pass in a course id and an array of keywords
app.get('/getPostsByKeyword',apiFunctions.userFunctions.isLoggedIn,function(req,res){
  var request = {
    CourseId : req.query.CourseId,
    Keywords : req.query.Keywords
  };
  apiFunctions.postFunctions.getPostsByKeyword(request,function(posts){
    res.send(posts);
  });
});

/*returns entire user object*/
app.get('/getCurrentUser',apiFunctions.userFunctions.isLoggedIn,function(req,res){
  res.send(req.user);
});

app.get('/getNotesForUser',apiFunctions.userFunctions.isLoggedIn,function(req,res){
  var request = {
    UserId : req.user._id,
    PodcastId : req.query.PodcastId
  };
  console.log("The user is outside is" + req.user._id);
  apiFunctions.userFunctions.getNotesForUser(request,function(notes){
    res.send(notes);
  });
});

app.get('/getVideoInfo',apiFunctions.userFunctions.isLoggedIn,function(req,res){
  var request = {
    PodcastId : req.query.PodcastId
  };

  apiFunctions.podcastFunctions.getVideoInfo(request,function(podcast){
    res.send(podcast);
  });
});

app.get('/getCourseInfo',apiFunctions.userFunctions.isLoggedIn, function(req,res){
  var request = {
    CourseId : req.query.CourseId
  };
  api.courseFunctions.getCourseInfo(request,function(course){
    res.send(course);
  });
});

app.post('/createPost',apiFunctions.userFunctions.isLoggedIn,function(req,res){
  res.send("CREATING POST");
});

app.post('/createComment',apiFunctions.userFunctions.isLoggedIn,function(req,res){
  res.send("Creating Comment");
});

app.get('/markWatchedLater',apiFunctions.userFunctions.isLoggedIn,function(req,res){
  res.send("watch later marked");
});


app.post('/login',function(req,res){
  res.redirect("/auth/facebook?callbackURL=" + req.query.callbackURL + "&errorCallbackURL=/login");
});

app.get('/isUserLoggedIn',function(req,res){
  if(req.isAuthenticated()){
    res.send(200, {"result": true});
  }
  else{
    res.send(200,{"result" : false});
  }
});

app.get('/logout',function(req,res){
  req.logout();
  res.send("LOGGED OUT");
});

/***************************************FACEBOOK AUTH****************************************************/
// MAT <TODO> USE THIS TO CALL THE API
// http://localhost:3000/auth/facebook?callbackURL=http://www.google.com&errorCallbackURL=http://yahoo.com
// Google.com id parameter will be the user fb auth id
// yahoo.com will have no id parameter
// After calling this api, call another api to generate a session
// Then work on the get courses api for the next page while cody does the frontend
app.get('/auth/facebook', function(req,res,next){
  if (req.query.callbackURL == null || req.query.errorCallbackURL == null)  {
    res.send("Error. Invalid params");
    return;
  }
  auth.callbackURL = req.query.callbackURL;
  auth.errorCallback = req.query.errorCallbackURL;
  next();
},
  passport.authenticate('facebook',
  {
      display: 'popup',
      scope: [ 'email', 'basic_info'],
      profileFields: ['id', 'displayName', 'photos', 'email', 'birthday']
  }
));


app.get("/auth/facebook/callback",
  passport.authenticate('facebook', {
    failureRedirect : auth.errorCallbackURL,
  }),
  /*ON SUCCESS*/
  function(req,res){
    res.redirect(auth.callbackURL);
  },
  /*NEED TO BYPASS AUTHORIZATION TOKEN HAS BEEN USED ISSUE*/
  function(err,req,res,next) {
        if(err) {
            res.redirect('/auth/facebook?callbackURL=' + auth.callbackURL);
        }
  });
