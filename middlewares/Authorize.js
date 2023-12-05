const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const basicAuth = require("basic-auth");
const { getSecret } = require("../utils/secretsUtil");
const crypto = require("crypto");
const AccessCode = require("../models/AccessCodeSchema");
const jwtCookie = require("../utils/tokenUtils");

const verifyRole = (role) => {
  return function (req, res, next) {
    try {
      if (req.user && req.user.role.includes(role)) {
        next();
      } else {
        return res
          .status(403)
          .send({ err: "You are unauthorised to perform this action" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err: "Server Error" });
    }
  };
};

const verifyAccountOwnerShip = (userId, sourceRequested) => {
  try {
    if (sourceRequested.author === userId) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const safeCompare = (a, b) => {
  const bufferA = Buffer.from(a, "utf-8");
  const bufferB = Buffer.from(b, "utf-8");
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufferA, bufferB);
};


async function checkAccessCode(code, requiredScope) {
  try {
    const accessToken = await AccessCode.findOne({ token: code });
    if (
      accessToken &&
      accessToken.expiresAt > new Date() &&
      accessToken.scope.includes(requiredScope)
    ) {
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error validating access token:", err);
    return false;
  }
}

async function verifyCredentials(userName, passWord) {
  try {
    const username = await getSecret("BASIC_AUTH_USERNAME");
    const password = await getSecret("BASIC_AUTH_PASSWORD");
    const userMatches = safeCompare(userName, username);
    const passwordMatches = safeCompare(passWord, password);

    return userMatches && passwordMatches;
  } catch (error) {
    console.error("Error in verifyCredentials:", error);
    return false;
  }
}


const swaggerCreds = async (req, res, next) => {
  const { username, password, accessCode } = req.body;

  if (accessCode) {
    const isValidAccessCode = await checkAccessCode(accessCode, "swagger");
    if (isValidAccessCode) {
      req.isAuthenticated = true;
      return next();
    } else {
      return res.status(403).send("Invalid access code");
    }
  } else if (username && password) {
    const isValidCredentials = await verifyCredentials(username, password);
    if (isValidCredentials) {
      req.isAuthenticated = true;
      return next();
    } else {
      return res.status(401).send("Invalid credentials");
    }
  }

  return res.status(400).send("Credentials or access code required");
};

const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated) {
    return res.redirect("/swagger-access");
  }
  next();
};



module.exports = {
  verifyRole,
  verifyAccountOwnerShip,
  swaggerCreds,
  isAuthenticated,
};
