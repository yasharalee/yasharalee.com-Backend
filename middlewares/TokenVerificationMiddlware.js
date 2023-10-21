const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (req, res, next) => {

    const token = req.cookies["access-token"] || req.headers['authorization'].split(' ')[1] ;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token", err });
        }

        try {
            const { userId } = decodedToken;

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
