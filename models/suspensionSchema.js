const mongoose = require("mongoose");

const suspensionSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Suspension = mongoose.model("Suspension", suspensionSchema);

module.exports = Suspension;
