const mongoose = require("mongoose");

const AccessCodeSchema = new mongoose.Schema(
  {
    AC: {
      type: String,
      required: true,
    },
    scope: {
      type: [String],
      required: true,
      enum: ["swagger", "admin", "visitor"],
    }
  },
  {
    timestamps: true,
  }
);

const AccessCode = mongoose.model("AccessToken", AccessCodeSchema);

module.exports = AccessCode;
