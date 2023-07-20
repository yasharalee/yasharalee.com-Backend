const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const blogPost = require("../models/blogPostSchema");
const comment = require("../models/commentSchema");
const profile = require("../models/profileSchema");

// Middleware to verify JWT and check user's role
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    const token = req.cookies["access-token"]; // Retrieve the JWT token from the cookies

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

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: "Unauthorized" });
    }
  };
};

const makeSureIsOwner = (modelName) => {
  return async (req, res, next) => {
    const userId = req.userId; // Retrieve the user ID from the request object

    const resourceIds = [
      req.body.resourceId,
      req.params.resourceId,
      req.query.resourceId,
    ].filter(Boolean);

    console.log(resourceIds);
    const message = "Not Authorized";
    try {
      if (modelName == "Post") {
        const foundBlog = await blogPost.findById(resourceIds[0]);

        if (!foundBlog) {
          return res.status(404).json({ error: "Not Found" });
        }

        if (foundBlog.author.equals(new mongoose.Types.ObjectId(userId))) {
          next();
        } else {
          return res.status(403).json({ error: message });
        }
      } else if (modelName == "Comment") {
        const foundComment = await comment.findById(resourceIds[0]);

        if (!foundComment) {
          return res.status(404).json({ error: "Not Found" });
        }

        if (foundComment.author.equals(new mongoose.Types.ObjectId(userId))) {
          next();
        } else {
          return res.status(403).json({ error: message });
        }
      } else if (modelName == "Profile") {
        const foundProfile = await profile.findById(resourceIds[0]);

        if (!foundProfile) {
          return res.status(404).json({ error: "Not Found" });
        }

        if (foundProfile.owner.equals(new mongoose.Types.ObjectId(userId))) {
          next();
        } else {
          return res.status(403).json({ error: message });
        }
      } else {
        return res.status(403).json({ error: " Not Authorized" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = { authorizeRole, makeSureIsOwner };
