const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/JwtUtils");
const postActions = require("../controllers/postActions");
const commentActions = require("../controllers/commentActions");


// must make sure the user is him/her self
router.post("/sendPost", verifyToken, postActions.sendPost);

// must make sure the user is him/herself
router.get("/MyPosts", verifyToken, postActions.MyPosts);

router.post("/postReactions", verifyToken, postActions.postReactions);

router.get("/getAPost", verifyToken, postActions.getAPost);

router.delete("/deleteAPost", verifyToken, postActions.deleteAPost);

router.post("/addComment", verifyToken, commentActions.addComment);

router.get("/getComments/:blogPostId", verifyToken, commentActions.getComments);

router.delete("/deleteComment/:commentId",verifyToken,commentActions.deleteComment);

router.post("/commentReactions", verifyToken, commentActions.commentReactions);



module.exports = router;

/*
/posts/sendPost
/posts//MyPosts
/posts/postReactions
/posts/getAPost
/posts/deleteAPost
/posts/addComment
 /posts/getComments/:blogPostId  (path parameter name should be:  (blogPostId: something as value))
 /posts/deleteComment/:commentId  (path parameter name should be:  (commentId: something as value))
 /posts/commentReactions
*/
