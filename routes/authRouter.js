const express = require("express");
const router = express.Router();
const authEndpoints = require("../endpoints/authEndpoints");

router.get("/google", authEndpoints.google);
router.get('/google/callback', authEndpoints.googleCallback);
router.get('/google/Canceled', authEndpoints.googleCanceled);
router.get("/outlook", authEndpoints.outlook);
router.get('/outlook/callback', authEndpoints.outlookCallback);


module.exports = router;