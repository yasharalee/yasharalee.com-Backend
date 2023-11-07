const mongoose = require("mongoose");

const aboutMePostSchema = new mongoose.Schema({
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

const AboutMePost = mongoose.model("AboutMePost", aboutMePostSchema);

module.exports = AboutMePost;