const jwt = require("jsonwebtoken");
const User = require("../models/User");
const blogPost = require("../models/blogPost");
const comment = require("../models/comment");

// Middleware to verify JWT and check user's role
const authorize = (requiredRole) => {
  return (req, res, next) => {
    // Get the JWT token from the request headers, cookies, or query parameters
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      // Verify the token and decode the payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { userId, role } = decoded;

      // Check if the user's role matches the required role
      if (role !== requiredRole) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // Add the user ID and role to the request object for further use
      req.userId = userId;
      req.role = role;

      // Call the next middleware or route handler
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: "Unauthorized" });
    }
  };
};

const makeSureIsOwner = (paramName) => {
  return async (req, res, next) => {
    let isAuthorisedToEditOrDeleteThisPost = false;

    if (paramName === "postId") {
      const { _id } = req.user;
      const { postId } = req.body;

      try {
        const userId = _id;
        const thePost = await blogPost.findOne({ _id: postId });

        if (!thePost) {
          return res.status(404).json({ error: "Post not found" });
        }

        if (String(userId) === String(thePost.author)) {
          isAuthorisedToEditOrDeleteThisPost = true;
        } else {
          return res.status(401).json({ error: "You are not authorized" });
        }
      } catch (err) {
        return res.status(403).json({ error: err.message });
      }
    } else if (paramName === "commentId") {
      const { _id } = req.user;
      const { commentId } = req.params;

      const theComment = await comment.findOne({ _id: commentId });

      if (!theComment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (String(_id) === String(theComment.author)) {
        isAuthorisedToEditOrDeleteThisPost = true;
      } else {
        return res.status(401).json({ error: "You are not authorized" });
      }
    } else {
      return res.status(400).json({ error: "Invalid request" });
    }

    if (isAuthorisedToEditOrDeleteThisPost) {
      next();
    } else {
      return res.status(403).json({ error: "Not authorized for this action" });
    }
  };
};

module.exports = { authorize, makeSureIsOwner };
