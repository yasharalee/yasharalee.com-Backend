const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/JwtUtils");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { findUserByEmailOrUsername } = require("../utils/DbUtils");


const register = async (req, res, next) => {
  const originalEmail = req.body.email;

  try {
    await Promise.all([
      body("username").notEmpty().trim().escape().run(req),
      body("email").isEmail().normalizeEmail().run(req),
      body("password").isLength({ min: 8 }).run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username } = req.body;
    const normalizedEmail = email;

    // if (
    //   role === "first-admin" ||
    //   role === "second-admin" ||
    //   role === "third-admin" ||
    //   role === "owner"
    // ) {
    //   return res
    //     .status(403)
    //     .json({ error: "Registration is not allowed for " + role + " role" });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailExist = await findUserByEmailOrUsername({ normalizedEmail });
    const usernameExist = await findUserByEmailOrUsername({ username });

    if (emailExist || usernameExist) {
      return res.status(409).json({ error: "User already exists" });
    }

    const user = await User.create({
      ...req.body,
      originalEmail,
      normalizedEmail,
      password: hashedPassword,
    });

    try {
      const findUser = await User.findOne({
        $or: [{ normalizedEmail: user.email }, { username: user.username }],
      });

      const payload = {
        userId: findUser._id.toString(),
        userEmail: findUser.normalizedEmail,
        userUsername: findUser.username,
      };

      const token = jwtUtils.generateToken(payload);

      jwtUtils.setHttpOnlyCookie(
        res,
        "access-token",
        token,
        new Date(Date.now() + 1 * 60 * 60 * 1000), // Expires in 1 hour
        "/auth/register"
      );

      res.status(201).json({ user:findUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to register user" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register user" });
  }
};


const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (emailOrUsername.includes("@")) {
      await Promise.all([
        body("emailOrUsername").isEmail().normalizeEmail().run(req),
        body("password").notEmpty().run(req),
      ]);
    } else {
      await Promise.all([
        body("emailOrUsername").notEmpty().trim().escape().run(req),
        body("password").notEmpty().run(req),
      ]);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({
      $or: [
        { normalizedEmail: emailOrUsername },
        { username: emailOrUsername },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = {
      userId: user._id.toString(),
      userEmail: user.email,
      userUsername: user.username,
      role: user.role,
    };

    const token = jwtUtils.generateToken(payload);

    jwtUtils.setHttpOnlyCookie(
      res,
      "access-token",
      token,
      new Date(Date.now() + 1 * 60 * 60 * 1000), // Expires in 1 hour
      "/",
    );

    const loginHistory = {
      ipAddress: req.ip,
      timestamp: Date.now(),
    };

    user.loginHistory.push(loginHistory);

    if (user.loginHistory.length > 20) {
      user.loginHistory.shift();
    }

    await user.save();

    res.json({ user});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log in" });
  }
};

const check = async (req, res) => {

  const isLogged = !!req.user;

  res.status(200).json({ isLogged });
};



const signOut = async (req, res) => {

  try{
    const httpOnlyOptions = {
      secure: true,
      httpOnly: true,
      sameSite: "None",

    };

    res.clearCookie('access-token', httpOnlyOptions);

    return res.status(200).json({ message: 'Logged out successfully' });
  }catch(err){
    return res.status(500).json({err});
  }

};

module.exports = {
  login,
  register,
  check,
  signOut,
};
