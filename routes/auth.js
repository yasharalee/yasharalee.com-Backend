const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken} = require("../utils/JwtUtils")
const authorize = require("../middleware/authorize");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/check", authController.check);

router.get("/checkt", authorize("owner"), verifyToken, authController.checkt);

module.exports = router;
