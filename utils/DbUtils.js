const User = require("../models/User");
const { body } = require("express-validator");

const findUserByEmailOrUsername = async (value) => {
  try {
    const user = await User.findOne(value);
    return user;
  } catch (error) {
    // Handle the error
    console.error(error);
    throw new Error("Failed to find user");
  }
};

const validateAndNormalizeEmail = (field) => {
  return [body(field).isEmail().normalizeEmail().run()];
};

module.exports = { 
    findUserByEmailOrUsername, 
    validateAndNormalizeEmail 
};
