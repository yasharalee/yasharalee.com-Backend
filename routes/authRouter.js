const express = require("express");
const router = express.Router();
const authEndpoints = require("../endpoints/authEndpoints");
const { verifyToken } = require("../middlewares/TokenVerificationMiddlware");

router.get("/google", authEndpoints.google);
router.get('/google/callback', authEndpoints.googleCallback);
router.get('/google/Canceled', authEndpoints.googleCanceled);
router.get("/outlook", authEndpoints.outlook);
router.get('/outlook/callback', authEndpoints.outlookCallback);

router.get('/outlook/getUserData', verifyToken ,authEndpoints.getUserData);


module.exports = router;