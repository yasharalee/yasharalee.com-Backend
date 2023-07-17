const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);

module.exports = LoginHistory;
