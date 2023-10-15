const express = require("express");
const router = express.Router();
const ContactActions = require('../endpoints/AllActionsEndpoints');
const { authorizeRole } = require("../middlewares/Authorize");
const { verifyToken } = require("../middlewares/TokenVerificationMiddlware");

router.post("/createMessage", ContactActions.createMessage);
router.get("/getMessages", verifyToken, ContactActions.getMessages);
router.get("/getMessage/:id", verifyToken, ContactActions.getMessage);

router.post("/createPost", verifyToken, authorizeRole("owner"), ContactActions.createPost);
router.get("/getPosts", ContactActions.getPosts);
router.get("/getPost/:id", verifyToken, ContactActions.getPost);
router.put("/editPost", verifyToken, authorizeRole("owner"), ContactActions.editPost);
router.delete("/deletePost/:id", verifyToken, authorizeRole("owner"), ContactActions.deletePost);



module.exports = router;
