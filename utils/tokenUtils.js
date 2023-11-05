const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {getSecret} = require('./secretsUtil');


const generateToken = async (payload) => {
  const JWT_SECRET = await getSecret("JWT_SECRET");

  console.log( "in generate token:secret is :: ", JWT_SECRET)

  console.log("Jwt-secret:: generate token" + JWT_SECRET);
  console.log("this is payload in generate token:: " + payload);

  return jwt.sign({ payload }, JWT_SECRET, {
    expiresIn: "3h",
  });
};


const setHttpOnlyCookie = (res, name, value, expiration, Path) => {
    const options = {

        Path,
        secure: true,
        httpOnly: true,
        sameSite: "None",
        expires: expiration,
    };

    res.cookie(name, value, options);
}



module.exports = {
    generateToken,
    setHttpOnlyCookie,
};
