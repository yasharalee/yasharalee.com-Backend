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

async function checkAccessCode(accessCode, requiredScope) {

  try {
    const accessToken = await AccessCode.findOne({ AC: accessCode });

    if (
      accessToken &&
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
    const userMatches = userName === username;
    const passwordMatches = passWord === password;
    
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
      const token = await jwtCookie.generateToken({ accessCode });

       jwtCookie.setHttpOnlyCookie(
        res,
        "access-token",
        token,
        new Date(Date.now() + 2 * 60 * 60 * 1000),
        "/"
      );
      return res.status(200).json({ success: true });
    } else {
      return res.status(403).send("Invalid access code");
    }
  } else if (username && password) {
    const isValidCredentials = await verifyCredentials(username, password);

    if (isValidCredentials) {
      const token = await jwtCookie.generateToken({ username, password });

      jwtCookie.setHttpOnlyCookie(
        res,
        "access-token",
        token,
        new Date(Date.now() + 2 * 60 * 60 * 1000),
        "/"
      );
       return res.status(200).json({success: true});
    } else {
      return res.status(401).send("Invalid credentials 116");
    }
  }

  return res.status(400).send("Credentials or access code required");
};

const isAuthenticated = (req, res, next) => {
  const tokenFromCookie = req.cookies ? req.cookies["access-token"] : null;

   if (!tokenFromCookie) {
     return res.redirect("/swagger-access");
   }
  jwt.verify(
    tokenFromCookie,
    process.env.JWT_SECRET,
    async (err, decodedToken) => {
      if (err) {
        console.log("Token is wrong");
        return res.status(401).json({ err: "Unauthorized user" });
      }

      try {
        const access = decodedToken.payload.accessCode;
        const creds = decodedToken.payload.username;

        if (access !== undefined) {
          const verified = checkAccessCode(access);
          if (verified) {
            next();
          }
        } else if (creds !== undefined) {
          const verified = verifyCredentials(
            decodedToken.payload.username,
            decodedToken.payload.password
          );
          if (verified) {
            next();
          }
        } else {
          throw new Error("No Access Code and No Credentials");
        }
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ err: "Server Error. Please retry later" });
      }
    }
  );
};

module.exports = {
  verifyRole,
  verifyAccountOwnerShip,
  swaggerCreds,
  isAuthenticated,
};
