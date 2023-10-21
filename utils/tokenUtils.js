const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { path } = require("../app");



const generateToken = (payload) => {
    return jwt.sign({ payload }, process.env.JWT_SECRET, {
        expiresIn: "2h",
    });
};



const setHttpOnlyCookie = (res, name, value, expiration, path) => {
    const options = {

        httpOnly: true,
        expires: expiration,
        domain: '.yasalee-qa.com',
        Path: path,
        sameSite: 'none',
        secure: true

    };

    res.cookie(name, value, options);
}



module.exports = {
    generateToken,
    setHttpOnlyCookie,
};
