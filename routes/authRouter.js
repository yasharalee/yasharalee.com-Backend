const express = require("express");
const router = express.Router();
const authEndpoints = require("../endpoints/authEndpoints");
const {
  verifyToken,
  justAddUserIfAny,
} = require("../middlewares/TokenVerificationMiddlware");

router.get("/google", authEndpoints.google);
router.get("/google/callback", authEndpoints.googleCallback);
router.get("/google/Canceled", authEndpoints.googleCanceled);
router.post("/google/gooleLogOut", authEndpoints.gooleLogOut);
router.get("/google/isSignedin", justAddUserIfAny, authEndpoints.isSignedin);

router.get("/outlook", authEndpoints.outlook);
router.get("/outlook/callback", authEndpoints.outlookCallback);

router.get("/getUserData", verifyToken, authEndpoints.getUserData);
router.get("/getMesagesByUser", verifyToken, authEndpoints.getMesagesByUser);
router.get("/getPermission", verifyToken, authEndpoints.getPermission);

module.exports = router;