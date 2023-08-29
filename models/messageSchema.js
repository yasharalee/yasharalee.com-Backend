const mongoose = require('mongoose');

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

const ContactMessageSchema = mongoose.model('ContactMessage', contactMessageSchema);

module.exports = ContactMessageSchema;
