const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (req, res, next) => {
  const tokenFromCookie = req.cookies ? req.cookies["access-token"] : null;
  const tokenFromHeader =
    req.headers && req.headers["authorization"]
      ? req.headers["authorization"].split(" ")[1]
      : null;
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ err: "Unauthorized or no token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ err: "Invalid token", err });
    }

    try {
      const userId = decodedToken.userId || decodedToken.payload.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ err: "User not found" });
      }

      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ err: "Internal server error" });
    }
  });
};

const justAddUserIfAny = (req, res, next) => {
  const tokenFromCookie = req.cookies ? req.cookies["access-token"] : null;
  const tokenFromHeader =
    req.headers && req.headers["authorization"]
      ? req.headers["authorization"].split(" ")[1]
      : null;
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    next();
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ err: "Invalid token", err });
    }

    try {
      const userId = decodedToken.userId || decodedToken.payload.userId;

      const user = await User.findById(userId);

      if (!user) {
        next();
        return res.status(404).json({ err: "User not found" });
      }

      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ err: "Internal server error" });
    }
  });
};

const verifyUserName = (req, res, next) => {
  const { fullName, normalizedEmail } = req.user;
  const userName = req.body.fullName;
  const email = req.body.normalizedEmail;
  try {
    if (fullName !== userName || normalizedEmail !== email) {
      req.userNameVerified = false;
      console.log("The users Name or Email in form has been modyfied");
      return res
        .status(400)
        .json({
          success: false,
          err: "The users Name or Email in form has been modyfied",
        });
    }
    req.userNameVerified = true;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, err: "Internal server error" });
  }
};

module.exports = {
  verifyToken,
  justAddUserIfAny,
  verifyUserName,
};
