const jwt = require("jsonwebtoken");
const User = require("../models/User");


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
module.exports = authorize;
