const express = require("express");
const router = express.Router();
const ContactActions = require('../endpoints/PostMessageActionsEndpoints');
const { verifyRole } = require("../middlewares/Authorize");
const {
  verifyToken,
  verifyUserName,
} = require("../middlewares/TokenVerificationMiddlware");

router.post("/createMessage", verifyToken, verifyUserName ,ContactActions.createMessage);
router.post("/createAnonymousMessage", ContactActions.createAnonymousMessage);

router.get("/getMessages", verifyToken, verifyRole(process.env.role),ContactActions.getMessages);
router.get("/getMessage/:id", verifyToken, ContactActions.getMessage);

router.post("/createPost", verifyToken, verifyRole(process.env.role), ContactActions.createPost);
router.get("/getPosts", ContactActions.getPosts);
router.get("/getPost/:id", verifyToken, ContactActions.getPost);
router.put("/editPost", verifyToken, verifyRole(process.env.role), ContactActions.editPost);
router.delete("/deletePost/:id", verifyToken, verifyRole(process.env.role), ContactActions.deletePost);

router.get("/getNewMesages", verifyToken, verifyRole(process.env.role), ContactActions.getNewMesages);



module.exports = router;
