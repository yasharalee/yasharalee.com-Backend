const Comment = require("../models/comment.js");

// Add a comment to a blog post
const addComment = async (req, res) => {
  try {
    const { blogPostId, content } = req.body;

    if (!blogPostId || !content) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const comment = await Comment.create({
      author: req.user._id,
      blogPost: blogPostId,
      content,
    });

    return res.status(201).json({ comment });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch comments for a blog post
const getComments = async (req, res) => {
  try {
    const { blogPostId } = req.params;

    const comments = await Comment.find({ blogPost: blogPostId })
      .populate("author", "_id username")
      .populate("likes") 
      .sort({ createdAt: -1 });

    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log("Error deleting comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Like/Dislike/Report a comment
const commentReactions = async (req, res) => {
  try {
    const { commentId, action } = req.body;
    const reactorId = req.user._id;

    if (!commentId || !action) {
      throw new Error("Invalid request");
    }

    const foundComment = await Comment.findById(commentId);

    if (!foundComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (action === "like") {
      if (!foundComment.likes.includes(reactorId)) {
        foundComment.likes.push(reactorId);

        // Remove the reactor's ID from dislikes if they had previously disliked the comment
        const reactorDisliked = foundComment.dislikes.includes(reactorId);
        if (reactorDisliked) {
          foundComment.dislikes.pull(reactorId);
        }
      } else {
        foundComment.likes.pull(reactorId);
      }
    } else if (action === "dislike") {
      if (!foundComment.dislikes.includes(reactorId)) {
        foundComment.dislikes.push(reactorId);

        // Remove the reactor's ID from likes if they had previously liked the comment
        const reactorLiked = foundComment.likes.includes(reactorId);
        if (reactorLiked) {
          foundComment.likes.pull(reactorId);
        }
      } else {
        foundComment.dislikes.pull(reactorId);
      }
    } else if (action === "report") {
      if (!foundComment.reported.includes(reactorId)) {
        foundComment.reported.push(reactorId);
      } else {
        foundComment.reported.pull(reactorId);
      }
    }

    await foundComment.save();
    return res.status(200).json({ comment: foundComment });
  } catch (error) {
    console.log("Error handling comment reaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
  commentReactions,
};