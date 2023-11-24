const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/verify-recaptcha", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "reCAPTCHA token is missing." });
  }

  try {
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const response = await axios.post(googleVerifyUrl, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      },
    });

    const data = response.data;
    if (!data.success) {
      return res
        .status(401)
        .json({ message: "Failed reCAPTCHA verification.", data });
    }

  
    res.json({ message: "reCAPTCHA verified successfully.", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying reCAPTCHA.", error: error.toString() });
  }
});

module.exports = router;
