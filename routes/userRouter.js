const express = require("express");
const router = express.Router();
const userActionEndpoints = require("../endpoints/userActionEndpoints");
const {
  verifyToken,
  justAddUserIfAny,
} = require("../middlewares/TokenVerificationMiddlware");
const { verifyRole } = require("../middlewares/Authorize");

router.get("/getUserById/:id", verifyToken, verifyRole(process.env.role), userActionEndpoints.getUserById);

module.exports = router;
