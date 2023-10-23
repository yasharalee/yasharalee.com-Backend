const bcrypt = require("bcrypt");
const passportSetup = require('../utils/passStrategies');
const passport = require('passport');
const jwtCookie = require("../utils/tokenUtils");
const mailit = require("../utils/emailUtils");


const google = (req, res, next) => {
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        failureRedirect: 'https://yaslanding.com/auth/Gcancelled'
    })(req, res, next);
};

const googleCanceled = (req, res, next) => {
    res.redirect('https://yaslanding.com/auth-cancelled');
};


const googleCallback = (req, res, next) => {
    passport.authenticate('google', async (err, { user, token }) => {
        if (err) {
            return res.status(500).json({ message: 'An error occurred' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const ipAddress = req.connection.remoteAddress || null;

        user.loginHistory.push({
            ipAddress,
            timestamp: new Date()
        });

        await user.save();

        // const recipientEmail =  user.normalizedEmail;
        // const subject = "Signed in";
        // const messageBody = `Dear ${user.fullName} \n This Email has been sent to let you know that your account has been logged in.\n\n https://yasharalee.com \n\n IP: ${user.loginHistory[user.loginHistory.length - 1].ipAddress} \n At: ${user.loginHistory[user.loginHistory.length - 1].timestamp}`;
        // mailit.sendEmail(recipientEmail, subject, messageBody);


        res.redirect('https://yasalee-qa.com/redirect/' + token);


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

const getUserData = (req, res) => {
    try {
        res.status(200);
        const token = jwtCookie.generateToken({ userId: req.user._id, fullName: req.user.fullName, role: req.user.role });
        jwtCookie.setHttpOnlyCookie(res, "access-token", token, new Date(Date.now() + 2 * 60 * 60 * 1000), "/");
        return res.json({ user: req.user });
    } catch (err) {
        console.error(err);
    }
}
const gooleLogOut = (req, res) => {
    try {
        const httpOnlyOptions = {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: "None",
            expires: new Date(0),

        };
        console.log("cookie is:: ", httpOnlyOptions);

        res.clearCookie('access-token', httpOnlyOptions);

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.log("error in logout is:: " + err)
        return res.status(500).json({ err });
    }
}


module.exports = {
    google,
    googleCanceled,
    googleCallback,
    outlook,
    outlookCallback,
    getUserData,
    gooleLogOut
};
