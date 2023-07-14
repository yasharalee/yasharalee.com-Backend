const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/JwtUtils");
const postActions = require("../controllers/postActions");

// must make sure the user is him/her self
router.post("/sendPost", verifyToken, postActions.sendPost);

// must make sure the user is him/herself
router.get("/MyPosts", verifyToken, postActions.MyPosts);

router.post("/postReactions", verifyToken, postActions.postReactions);

router.get("/getAPost", verifyToken, postActions.getAPost);

router.delete("/deleteAPost", verifyToken, postActions.deleteAPost);

module.exports = router;

/*
/posts/sendPost
/posts//MyPosts
/posts/postReactions
/posts/getAPost
/posts/deleteAPost
*/
