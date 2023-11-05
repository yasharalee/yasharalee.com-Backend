const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {getSecret} = require('./secretsUtil');


const generateToken = async (payload) => {
  const JWT_SECRET = await getSecret("JWT_SECRET");
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
