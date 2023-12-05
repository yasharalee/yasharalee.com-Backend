const mongoose = require("mongoose");

const AccessCodeSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  scope: {
    type: [String],
    required: true,
    enum: ["swagger", "admin", "visitor"]
  },
  
},
  {
    timestamps: true,
  }
);

const AccessCode = mongoose.model("AccessToken", AccessCodeSchema);

module.exports = AccessCode;
