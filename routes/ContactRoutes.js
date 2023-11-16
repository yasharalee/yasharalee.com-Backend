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
router.post("/createAdminMessage", verifyToken, verifyRole(process.env.role), ContactActions.createAdminMessage);
router.get("/getMessages", verifyToken, verifyRole(process.env.role),ContactActions.getMessages);
router.get("/getMessage/:id", verifyToken, ContactActions.getMessage);
router.get("/getNewMesages", verifyToken, verifyRole(process.env.role), ContactActions.getNewMesages);



module.exports = router;
