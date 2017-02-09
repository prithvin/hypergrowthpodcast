var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var UserModel = require("../models/userModel.js").UserModel;
var configAuth = require("./auth.js");
passport = require('passport');
var bodyParser = require('body-parser');
passport.use(bodyParser.urlencoded({ extended: false }));
// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function (user, done) {
    console.log("HERE IS THE USER" + user);
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
  UserModel.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'first_name', 'last_name'],
    enableProof: true,
  },
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      UserModel.find({ ProfileId : profile.id}, function(err, user) {
        console.log("HELLOOOOOOO" + profile.id);
        if (err){
          console.log("ERROR in LOCAL STRATEGY");
          return done(err);
        }
        if (user.length != 0) {
          console.log("USER ALREADY EXISTS");
          return done(null, user);
        }else{
          console.log("USER DOESN'T EXIST");
          var newUser = new UserModel();
          newUser.ProfileId = profile.id;
          newUser.FacebookAuthToken = token;
          newUser.Name = profile.name.givenName + ' ' + profile.name.familyName;
          newUser.Email = (profile.emails[0].value || '').toLowerCase();

          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

module.exports = {
  isLoggedIn : function(req, res, next) {
      if (req.isAuthenticated())
          return next();

      res.sendStatus(401);
  }
}
