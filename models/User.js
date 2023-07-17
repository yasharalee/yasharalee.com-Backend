const mongoose = require("mongoose");
const BlogPost = require("./blogPostSchema");
const Comment = require("./commentSchema");

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
    default: 30,
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
  },
  passwordResetToken: {
    type: String,
  },

  loginHistory: [loginHistorySchema],
  // blogPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
  // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
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
