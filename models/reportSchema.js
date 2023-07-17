const mongoose = require("mongoose");
const BlogPost = require("./blogPost");
const Comment = require("./comment");
const LikeDislike = require("./likeDislike");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
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
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  role: {
    type: String,
    enum: ["first-admin", "second-admin", "third-admin", "owner", "user"],
    default: "user",
  },
  accountStatus: {
    type: String,
    enum: ["active", "suspended", "terminated"],
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
  blogPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likesDislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "LikeDislike" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
