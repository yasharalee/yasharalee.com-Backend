const mongoose = require("mongoose");



const verifyRole = (role) => {
    return function (req, res, next) {
        try {
            if (req.user && req.user.role.includes(role)) {
                next();
            } else {
                return res.status(403).send({err:'You are unauthorised to perform this action'});
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err: "Server Error" });
        }
    }
}


const verifyAccountOwnerShip = (userId, sourceRequested) => {

    try {
        if (sourceRequested.author === userId) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }

}






module.exports = { verifyRole, verifyAccountOwnerShip };
