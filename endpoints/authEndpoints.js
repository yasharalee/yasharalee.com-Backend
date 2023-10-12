const bcrypt = require("bcrypt");
const passportSetup = require('../utils/passStrategies'); 
const passport = require('passport');
const jwtCookie = require("../utils/tokenUtils");
const mailit = require("../utils/emailUtils");


const google = (req, res, next) => {
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })(req, res, next);
};


const googleCallback = (req, res, next) => {
    passport.authenticate('google', async (err, { user, token }) => {
        if (err) {
            return res.status(500).json({ message: 'An error occurred' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        const recipientEmail = "yasharalee@hotmail.com";
        const subject = "just for testing";
        const messageBody = "This is the message body in text format.";
        mailit.sendEmail(recipientEmail, subject, messageBody);


        jwtCookie.setHttpOnlyCookie(res, "access-token", token, new Date(Date.now() + 1 * 60 * 60 * 1000),"/")
        res.redirect('https://localhost/test'); 
    })(req, res, next);
};



const outlook = (req, res, next) => {
    passport.authenticate('windowslive', {
        scope: [
            'openid',
            'profile',
            'offline_access',
            'https://outlook.office.com/mail.read'
        ]
    })(req, res, next);
};

const outlookCallback = (req, res, next) => {
    passport.authenticate('windowslive', async (err, { user, token }) => {
        if (err) {
            return res.status(500).json({ message: 'An error occurred' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
       
        jwtCookie.setHttpOnlyCookie(res, "access-token", token, new Date(Date.now() + 1 * 60 * 60 * 1000), "/")
        res.redirect('https://localhost:443/test');
    })(req, res, next);
};


module.exports = {
    google,
    googleCallback,
    outlook,
    outlookCallback
};
