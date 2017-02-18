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
    process.nextTick(function() {
      UserModel.find({ ProfileId : profile.id}, function(err, user) {
        if (err){
          return done(err);
        }
        if (user.length != 0) {
          return done(null, user);
        }else{
          apiFunctions.userFunctions.addUser(profile.displayName,
          token, profile.id, function(err,newUser){
            if (err)
              throw err;
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
