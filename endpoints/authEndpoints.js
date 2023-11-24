const bcrypt = require("bcrypt");
const passportSetup = require("../utils/passStrategies");
const passport = require("passport");
const jwtCookie = require("../utils/tokenUtils");
const mailit = require("../utils/emailUtils");

const google = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    failureRedirect: process.env.Environment + "/auth/Gcancelled",
  })(req, res, next);
};

const isSignedin = (req, res, next) => {
  const getUser = req.headers["getuser"];
  try {
    if (req.user) {
      if (getUser) {
        const userToSend = {
          fullName: req.user.fullName,
          normalizedEmail: req.user.normalizedEmail,
          messageingThread: req.user.messageingThread,
        };
        return res.status(200).json({ signedIn: true, user: userToSend });
      } else {
        return res.status(200).json({ signedIn: true });
      }
    } else {
      return res.status(200).json({ signedIn: false });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Server Error. Please retry later." });
  }
};

const getPermission = (req, res) => {
  const { user } = req;
  try {
    if (user.role === process.env.role) {
      return res.status(200).send({ permited: true, err: null });
    } else {
      return res.status(403).send({
        permited: false,
        err: "You are not permited to do this action",
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ permited: false, err: "Server Error. Please retry later." });
  }
};

const googleCanceled = (req, res, next) => {
  res.redirect("https://yaslanding.com/auth-cancelled");
};

const googleCallback = (req, res, next) => {
  passport.authenticate("google", async (err, { user, token }) => {
    if (err) {
      return res.status(500).json({ message: "An error occurred" });
    }
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const ipAddress = req.connection.remoteAddress || null;

    user.loginHistory.push({
      ipAddress,
      timestamp: new Date(),
    });

    if (user.loginHistory.length > 5) {
      user.loginHistory = user.loginHistory.slice(-5);
    }

    await user.save();

    res.redirect(process.env.UI_Env + "/redirect/" + token);
  })(req, res, next);
};

const outlook = (req, res, next) => {
  passport.authenticate("windowslive", {
    scope: [
      "openid",
      "profile",
      "offline_access",
      "https://outlook.office.com/mail.read",
    ],
  })(req, res, next);
};

const outlookCallback = (req, res, next) => {
  passport.authenticate("windowslive", async (err, { user, token }) => {
    if (err) {
      return res.status(500).json({ message: "An error occurred" });
    }
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    jwtCookie.setHttpOnlyCookie(
      res,
      "access-token",
      token,
      new Date(Date.now() + 1 * 60 * 60 * 1000),
      "/"
    );
    res.redirect(process.env.UI_Env + "/redirect/" + token);
  })(req, res, next);
};

const getUserData = (req, res) => {
  try {
    const user = { ...req.user._doc };
    delete user.password;
    delete user.passwordResetToken;
    delete user.loginHistory;
    delete user.googleId;
    delete user.outlookId;

    const token = jwtCookie.generateToken({
      userId: req.user._id,
      fullName: req.user.fullName,
      role: req.user.role,
    });
    jwtCookie.setHttpOnlyCookie(
      res,
      "access-token",
      token,
      new Date(Date.now() + 2 * 60 * 60 * 1000),
      "/"
    );

    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error. Please retry later." });
  }
};
const gooleLogOut = (req, res) => {
  try {
    const httpOnlyOptions = {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "None",
      expires: new Date(0),
    };

    res.clearCookie("access-token", httpOnlyOptions);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const getMesagesByUser = (req, res) => {
  const { user } = req;
  try {
    if (user) {
      return res.status(200).json({
        success: true,
        messageingThread: user.messageingThread,
        err: null,
      });
    } else {
      throw "No User Found";
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({
        success: false,
        MessagingThread: null,
        err: "Something went wrong, please try again later",
      });
  }
};

module.exports = {
  google,
  googleCanceled,
  googleCallback,
  outlook,
  outlookCallback,
  getUserData,
  gooleLogOut,
  isSignedin,
  getPermission,
  getMesagesByUser,
};
