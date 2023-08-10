const mongoose = require("mongoose");
const Comment = require("./commentSchema");

const profileSchema = new mongoose.Schema({
  profileOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: {
    type: String,
  },
  lastname: { type: String },
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
  contactInformation: [
    {
      type: {
        type: String,
        enum: ["phone", "address"],
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    }
  ], 
  socialMediaLinks: [
    {
      type: {
        type: String,
        enum: ["Twitter", "Instagram", "Facebook", "LinkedIn", "Telegram", "Other"], 
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    }
  ],
  verificationCode: {
    type: Number
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  makeMeVisibaleInSearch: {
    type: Boolean,
    default: false,
  },

  privateFieldsInProfile: [{ type: String }],

  userFollowsThem: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  onlyUsersAllowedToSeeMe: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  favioriteUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followersOfThisUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const profile = mongoose.model("profile", profileSchema);

module.exports = profile;
