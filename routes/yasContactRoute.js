const express = require("express");
const router = express.Router();
const ContactActions = require ('../endPoints/yasContactActions');

router.post("/yasmessage",  ContactActions.createMessage);
router.get("/yasmessages",  ContactActions.getMessages);
router.get("/yasmessage/:id",  ContactActions.getMessage);

module.exports = router;
