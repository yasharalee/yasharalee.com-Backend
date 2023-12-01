const express = require("express");
const router = express.Router();
const PostActions = require('../endpoints/PostEndpoints');
const { verifyRole } = require("../middlewares/Authorize");
const {
  verifyToken,
} = require("../middlewares/TokenVerificationMiddlware");

router.post("/createPost", verifyToken, verifyRole(process.env.role), PostActions.createPost);
router.get("/getPosts", PostActions.getPosts);
router.get("/getPost/:id", verifyToken, PostActions.getPost);
router.put("/editPost", verifyToken, verifyRole(process.env.role), PostActions.editPost);
router.delete("/deletePost/:id", verifyToken, verifyRole(process.env.role), PostActions.deletePost);



module.exports = router;