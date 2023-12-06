const express = require("express");
const axios = require("axios");
const { getSecret } = require("../utils/secretsUtil");
const router = express.Router();

router.post("/verify-recaptcha", async (req, res) => {
  try {
    let captchaSecret;
    if (process.env.IN_LOCAL === "local") {
      captchaSecret =  process.env.RECAPTCHA_SECRET_KEY;
    } else {
      captchaSecret = await getSecret("RECAPTCHA_SECRET_KEY");
    }

    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "reCAPTCHA token is missing." });
    }

    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: captchaSecret,
          response: token,
        },
      }
    );

    const data = response.data;
    if (!data.success) {
      return res
        .status(401)
        .json({ message: "Failed reCAPTCHA v3 verification.", data });
    }

    return res.json({ message: "reCAPTCHA v3 verified successfully.", data });
  } catch (error) {
    console.error("Error in /verify-recaptcha:", error);
    return res.status(500).json({
      message: "Error verifying reCAPTCHA v3.",
      error: error.toString(),
    });
  }
});

module.exports = router;
