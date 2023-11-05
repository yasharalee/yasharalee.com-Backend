const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {getSecret} = require("../utils/secretsUtil");

const verifyToken = async (req, res, next) => {
  const JWT_SECRET = await getSecret("JWT_SECRET")+"";
  console.log("JWT-secter::verifyToken " + JWT_SECRET);

  console.log("request is:: " + req.headers["authorization"]);

  const tokenFromCookie = req.cookies ? req.cookies["access-token"] : null;
  const tokenFromHeader =
    req.headers && req.headers["authorization"] ? req.headers["authorization"].split(" ")[1] : null;

   const token = tokenFromCookie || tokenFromHeader;
   console.log(token);
   const token1 = token.split(" ")[1];


  if (!token) {
    console.log("No token has been sent along with request");
    return res.status(401).json({ err: "Unable to authenticate" });
  }

  jwt.verify(token1, JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.error("Error verifying JWT:", err.message);
      console.log("Received token:", token);
      console.log("Token is wrong");
      return res.status(401).json({ err: "Unauthorized user" });
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
      return res.status(500).json({ err: "Server Error. Please retry later" });
    }
  });
};

const justAddUserIfAny = async (req, res, next) => {

 console.log("request is:: " + req.headers["authorization"]);


    const JWT_SECRET = await getSecret("JWT_SECRET")+"";
    console.log("JWT-secter AddAny:: " + JWT_SECRET);

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

  jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.error("Error verifying JWT:", err.message);
      console.log("Received token:", token);
      return res.status(401).json({ err: "Unable to authenticate" });
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
      return res.status(500).json({ err: "Server Error. Please retry later" });
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
      console.log("Please keep name and email unchanged to proceed.");
      return res.status(400).json({
        success: false,
        err: "Please keep name and email unchanged to proceed.",
      });
    }
    req.userNameVerified = true;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, err: "Server Error. Please retry later" });
  }
};

module.exports = {
  verifyToken,
  justAddUserIfAny,
  verifyUserName,
};
