const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/JwtUtils");
const postActions = require("../endPoints/postActions");
const commentActions = require("../endPoints/commentActions");
const { makeSureIsOwner } = require("../middleware/authorize");


// must make sure the user is him/her self
router.post("/sendPost", verifyToken, postActions.sendPost);

// must make sure the user is him/herself
router.get("/MyPosts", verifyToken, postActions.MyPosts);

router.post("/postReactions", verifyToken, postActions.postReactions);

router.get("/getAPost", verifyToken, postActions.getAPost);

router.delete("/deleteAPost",verifyToken,makeSureIsOwner("Post"), postActions.deleteAPost);

router.post("/addComment", verifyToken, commentActions.addComment);

router.get("/getComments/:resourceId", verifyToken, commentActions.getComments);

router.delete("/deleteComment/:resourceId", verifyToken ,makeSureIsOwner("Comment"), commentActions.deleteComment);

router.post("/commentReactions", verifyToken, commentActions.commentReactions);

module.exports = router;
//,

/*
/posts/sendPost
/posts//MyPosts
/posts/postReactions
/posts/getAPost
/posts/deleteAPost
/posts/addComment
 /posts/getComments/:resourceId  (path parameter name should be:  (resourceId: something as value))
 /posts/deleteComment/:resourceId  (path parameter name should be:  (resourceId: something as value))
 /posts/commentReactions
*/
