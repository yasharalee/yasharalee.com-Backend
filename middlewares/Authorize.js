const mongoose = require("mongoose");
const basicAuth = require("basic-auth");
const { getSecret } = require('../utils/secretsUtil');
const crypto = require("crypto");



const verifyRole = (role) => {
    return function (req, res, next) {
        try {
            if (req.user && req.user.role.includes(role)) {
                next();
            } else {
                return res.status(403).send({err:'You are unauthorised to perform this action'});
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err: "Server Error" });
        }
    }
}


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

}

const safeCompare = (a, b) => {
  const bufferA = Buffer.from(a, "utf-8");
  const bufferB = Buffer.from(b, "utf-8");
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufferA, bufferB);
};

const basicAuthorizer = async (req, res, next) => {
  const credentials = basicAuth(req);

  if (!credentials) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Swagger"');
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const username = await getSecret("BASIC_AUTH_USERNAME");
    const password = await getSecret("BASIC_AUTH_PASSWORD");
    const userMatches = safeCompare(credentials.name, username);
    const passwordMatches = safeCompare(credentials.pass, password);

    if (userMatches && passwordMatches) {
      next();
    } else {
      res.setHeader("WWW-Authenticate", 'Basic realm="Swagger"');
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = { verifyRole, verifyAccountOwnerShip, basicAuthorizer };
