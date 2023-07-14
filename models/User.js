const mongoose = require("mongoose");
const BlogPost = require("./blogPost");
const Comment = require("./comment");

const loginHistorySchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  normalizedEmail: {
    type: String,
    required: true,
    unique: true,
  },
  originalEmail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["female", "male", "transgender", "prefer not to declare", "other"],
    default: "prefer not to declare",
  },
  profilePicture: {
    type: String,
  },
  biography: {
    type: String,
  },
  contactInformation: {
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  socialMediaLinks: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  role: {
    type: String,
    enum: ["first-admin", "second-admin", "third-admin", "owner", "user"],
    default: "user",
  },
  accountStatus: {
    type: String,
    enum: ["active", "suspended", "terminated", "deleted", "onhold"],
    default: "active",
  },
  violations: {
    type: Number,
    default: 0,
  },
  reportCount: {
    type: Number,
    default: 0,
  },
  reportThreshold: {
    type: Number,
    default: 3,
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
  },
  passwordResetToken: {
    type: String,
  },
  loginHistory: [loginHistorySchema],
  blogPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
 createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
