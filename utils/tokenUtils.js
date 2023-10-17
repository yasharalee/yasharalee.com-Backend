const jwt = require("jsonwebtoken");
const User = require("../models/User");



const generateToken = (payload) => {
    return jwt.sign({ payload }, process.env.JWT_SECRET, {
        expiresIn: "3h",
    });
};



const setHttpOnlyCookie = (res, name, value, expiration, Path) => {
    const options = {

        Path,
        secure: true,
        httpOnly: true,
        sameSite: "None",
        expires: expiration

    };

    res.cookie(name, value, options);
}



module.exports = {
    generateToken,
    setHttpOnlyCookie,
};
