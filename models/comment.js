const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  blogPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogPost",
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
