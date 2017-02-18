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

app.post('/login',function(req,res){
  res.redirect("/auth/facebook");
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
app.get('/auth/facebook', function(req, res, next) {
  /*if (req.query.callbackURL == null || req.query.errorCallbackURL == null)  {
    res.send("Error. Invalid params");
    return;
  }
  auth.callbackURL = req.query.callbackURL;
  auth.errorCallback = req.query.errorCallbackURL;
  */
  passport.authenticate('facebook',
    {
      display: 'popup',
      scope: [ 'email', 'basic_info'],
      profileFields: ['id', 'displayName', 'photos', 'email', 'birthday']
  })(req, res, next);
});



app.get("/auth/facebook/callback",
  passport.authenticate('facebook', {
  successRedirect : '/', // redirect to the secure profile section
  failureRedirect : '/login'
  }),
  function(err, user, info) {
    /*if (err || !user) {
      res.redirect(auth.errorCallback);
    }
    else {
      var retUrl = auth.callbackURL + "?id=" + user[0].FacebookAuthToken;
      res.redirect(retUrl);
    }*/
  },
  /*NEED TO BYPASS AUTHORIZATION TOKEN HAS BEEN USED ISSUE*/
  function(err,req,res,next) {
        if(err) {
          console.log("THE ERROR" + err);
            res.redirect('/auth/facebook');
        }
    }
);
