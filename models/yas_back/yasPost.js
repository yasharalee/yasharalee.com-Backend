const mongoose = require("mongoose");

const yasPostSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    published: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const YasPost = mongoose.model("yasPost", yasPostSchema);

module.exports = YasPost;
