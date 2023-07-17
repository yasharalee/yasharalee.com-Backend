const express = require("express");
const router = express.Router();
const authController = require("../endPoints/authController");
const { verifyToken } = require("../utils/JwtUtils");
const { authorizeRole } = require("../middleware/authorize");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/check", authController.check);

router.get(
  "/checkt",
  authorizeRole("owner"),
  verifyToken,
  authController.checkt
);

module.exports = router;

/*
/auth/register
/auth/login
/auth/check
/auth/checkt
*/
