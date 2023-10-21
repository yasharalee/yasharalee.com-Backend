const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const RequestIp = new mongoose.Schema({
    IpAddress: {
        type: String,
        trim: true,
        default: ''
    },
    Count: {
        type: Number
    },
}, {
    timestamps: true
});

const RequesterIp = mongoose.model('RequestIp', RequestIp);

module.exports = RequesterIp;