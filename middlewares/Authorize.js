const mongoose = require("mongoose");



const authorizeRole = (requiredRole) => {
    return (req, res, next) => {

        try {
            const role  = req.user.role;

            if (role !== requiredRole) {
                return res.status(403).json({ error: "Forbidden" });
            }

            next();
        } catch (err) {
            console.error(err);
            res.status(401).json({ err });
        }
    };
};



module.exports = { authorizeRole };
