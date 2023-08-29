const mongoose = require("mongoose");

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

const contactMessageSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        default: ''
    },
    companyName: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
        default: ''
    },
    links: {
        type: String,
        trim: true,
        default: ''
    },
    preferredContactMethods: {
        type: [String],
        enum: ['email', 'phone'],
        default: ['email']
    },
    message: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true
});


const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    outlookId: {
        type: String,
        unique: true,
        sparse: true
    },
    fullName: {
        type: String,
        trim: true,
        default: ''
    },
    phoneNumber: {
        type: String,
        trim: true,
        default: ''
    },
    
    normalizedEmail: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },

    role: {
        type: String,
        enum: ["first-admin", "second-admin", "third-admin", "owner", "user"],
        default: "user",
    },
    passwordResetToken: {
        type: String,
    },
    messageingThread: [contactMessageSchema],
    

    loginHistory: [loginHistorySchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
