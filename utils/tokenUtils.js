const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { getSecret } = require("./secretsUtil");


const generateToken =  (payload) => {
    const secret = process.env.JWT_SECRET;

    return jwt.sign({ payload }, secret, {
        expiresIn: "3h",
    });
};



const setHttpOnlyCookie = (res, name, value, expiration, Path) => {
    const options = {
      path: Path,
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
