var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var UserModel = require("../models/userModel.js");
var configAuth = require("./auth.js");
var passport = require('passport');
var bodyParser = require('body-parser');
var apiFunctions = require('../api.js');
passport.use(bodyParser.urlencoded({ extended: false }));

passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    passReqToCallback: true,
  },
  function(req,token, refreshToken, profile, done) {
    console.log("UP HERE");
    process.nextTick(function() {
      UserModel.findOne({ FBUserId : profile.id}, function(err, user) {
        if (err){
          console.log("ERROR ENCOUNTERED");
          return done(err);
        }
        if (user) {
          console.log("USER FOUND");
          return done(null, user);
        }else{
          apiFunctions.userFunctions.addUser(profile.displayName, profile.id, function(err,newUser){
            if (err)
              throw err;
            console.log("USER ADDED NEWLY");
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.serializeUser(function (user, done) {
      done(null, user);
  });
  passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function(err, user) {
      done(err, user);
    });
  });
