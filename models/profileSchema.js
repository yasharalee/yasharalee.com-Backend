const mongoose = require("mongoose");
const Comment = require("./commentSchema");

const profileSchema = new mongoose.Schema({
  profileOwner: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
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
