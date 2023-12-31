const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { promisify } = require("util");
const jwtVerify = promisify(jwt.verify);
const {getSecret} = require("../utils/secretsUtil");

const verifyToken = async (req, res, next) => {
  try {
    const JWT_Secret = await getSecret("JWT_SECRET");
    const tokenFromCookie = req.cookies ? req.cookies["access-token"] : null;
    const tokenFromHeader =
      req.headers && req.headers["authorization"]
        ? req.headers["authorization"].split(" ")[1]
        : null;
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      console.log("No token has been sent along with request");
      return res.status(401).json({ err: "Unable to authenticate" });
    }

    const decodedToken = await jwtVerify(token, JWT_Secret);

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
    if (err.name === "JsonWebTokenError") {
      console.log("Token is wrong");
      return res.status(401).json({ err: "Unauthorized user" });
    }
    return res.status(500).json({ err: "Server Error. Please retry later" });
  }
};


const justAddUserIfAny = async (req, res, next) => {
  try {
    const JWT_Secret = await getSecret("JWT_SECRET");
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

    const decodedToken = await jwtVerify(token, JWT_Secret);

    const userId = decodedToken.userId || decodedToken.payload.userId;
    const user = await User.findById(userId);

    if (user) {
      req.user = user;
      req.token = token;
    }

    next();
  } catch (err) {
    console.error(err);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ err: "Unable to authenticate" });
    }
    return res.status(500).json({ err: "Server Error. Please retry later" });
  }
};

const verifyUserName = (req, res, next) => {
  const { fullName, normalizedEmail } = req.user;
  const userName = req.body.fullName;
  const email = req.body.normalizedEmail;
  try {
    if (fullName !== userName || normalizedEmail !== email) {
      req.userNameVerified = false;

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
