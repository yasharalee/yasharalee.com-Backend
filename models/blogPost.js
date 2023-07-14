const mongoose = require("mongoose");
const Comment = require("./comment");

const blogPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reported: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
