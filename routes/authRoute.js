const express = require("express");
const router = express.Router();
const authController = require("../endPoints/authController");
const { verifyToken } = require("../utils/JwtUtils");
const { authorizeRole } = require("../middleware/authorize");
// const cors = require("cors");

// router.use(cors());

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/check",verifyToken, authController.check);

router.post(
  "/signOut",
  authController.signOut
);

module.exports = router;

/*
/auth/register
/auth/login
/auth/check (to check if user is already logged in)
/auth/signOut
*/
