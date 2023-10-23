const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (req, res, next) => {

    const tokenFromCookie = req.cookies ? req.cookies["access-token"] : null;
    const tokenFromHeader = req.headers && req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized or no token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token", err });
        }

        try {
            const userId = decodedToken.userId || decodedToken.payload.userId;

            const user = await User.findById(userId);


            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            req.user = user;
            req.token = token;

            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
};
module.exports = {
    verifyToken
};
