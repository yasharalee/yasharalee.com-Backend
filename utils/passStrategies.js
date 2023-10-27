const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const OutlookStrategy = require('passport-outlook');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GoogleClintID,
    clientSecret: process.env.GoogleClientSecret,
    callbackURL: process.env.Environment+'/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
       
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = new User({
                fullName: profile.displayName,
                googleId: profile.id,
                originalEmail: profile.emails[0].value,
                normalizedEmail: profile.emails[0].value.toLowerCase()
            });
           user = await user.save();
        }
 

        const token = jwt.sign({ userId: user._id, fullName: user.fullName, role: user.role }, process.env.JWT_SECRET);
        done(null, { user, token });
    } catch (error) {
        console.log("Error", error);
        done(error);
    }
}));


passport.use(
  new OutlookStrategy(
    {
      clientID: process.env.OutlookClientID,
      clientSecret: process.env.OutlookSecretValue,
      callbackURL: process.env.Environment + "/auth/outlook/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ outlookId: profile.id });
        if (!user) {
          user = new User({
            fullName: profile.displayName,
            outlookId: profile.id,
            originalEmail: profile.emails[0].value,
            normalizedEmail: profile.emails[0].value.toLowerCase(),
          });
          await user.save();
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        done(null, { user, token });
      } catch (err) {
        done(err);
      }
    }
  )
);

