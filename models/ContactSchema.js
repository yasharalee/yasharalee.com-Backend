const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      default: "",
    },
    companyName: {
      type: String,
      trim: true,
      default: "",
    },
    normalizedEmail: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    links: {
      type: String,
      trim: true,
      default: "",
    },
    preferredContactMethods: {
      type: [String],
      enum: ["email", "phone"],
      default: ["email"],
    },
    anonymous: {
      type: Boolean,
      default: true,
      immutable: true,
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;