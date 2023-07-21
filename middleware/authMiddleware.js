const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {
  const token = req.cookies["access-token"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.payload.userId;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
