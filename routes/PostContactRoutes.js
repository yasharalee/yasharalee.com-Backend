const express = require("express");
const router = express.Router();
const ContactActions = require('../endpoints/AllActionsEndpoints');
const { verifyRole } = require("../middlewares/Authorize");
const { verifyToken } = require("../middlewares/TokenVerificationMiddlware");

router.post("/createMessage", verifyToken ,ContactActions.createMessage);
router.get("/getMessages", verifyToken, verifyRole("owner"),ContactActions.getMessages);
router.get("/getMessage/:id", verifyToken, ContactActions.getMessage);

router.post("/createPost", verifyToken, verifyRole("owner"), ContactActions.createPost);
router.get("/getPosts", ContactActions.getPosts);
router.get("/getPost/:id", verifyToken, ContactActions.getPost);
router.put("/editPost", verifyToken, verifyRole("owner"), ContactActions.editPost);
router.delete("/deletePost/:id", verifyToken, verifyRole("owner"), ContactActions.deletePost);



module.exports = router;
