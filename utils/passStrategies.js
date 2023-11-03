const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const OutlookStrategy = require("passport-outlook");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { getSecret } = require("./secretsUtil");

const initializeStrategies = async () => {
  const googleClientID = await getSecret("GoogleClintID");
  const JWT_SECRET = await getSecret("JWT_SECRET");
  const OutlookSecretValue = await getSecret("OutlookSecretValue");
  const OutlookClientID = await getSecret("OutlookClientID");
  const GoogleClientSecret = await getSecret("GoogleClientSecret");

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: GoogleClientSecret,
        callbackURL: process.env.Environment + "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = new User({
              fullName: profile.displayName,
              googleId: profile.id,
              originalEmail: profile.emails[0].value,
              normalizedEmail: profile.emails[0].value.toLowerCase(),
            });
            user = await user.save();
          }

          const token = jwt.sign(
            { userId: user._id, fullName: user.fullName, role: user.role },
            JWT_SECRET
          );
          done(null, { user, token });
        } catch (error) {
          console.log("Error", error);
          done(error);
        }
      }
    )
  );

  passport.use(
    new OutlookStrategy(
      {
        clientID: OutlookClientID,
        clientSecret: OutlookSecretValue,
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

          const token = jwt.sign(
            { userId: user._id, fullName: user.fullName, role: user.role },
            JWT_SECRET
          );
          done(null, { user, token });
        } catch (error) {
          console.log("Error", error);
          done(error);
        }
      }
    )
  );
};


initializeStrategies().catch((err) => {
  console.error("Failed to initialize passport strategies:", err);
});