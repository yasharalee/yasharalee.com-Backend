const express = require("express");
const router = express.Router();
const ContactActions = require ('../endPoints/yasContactActions');
const { authorizeRole } = require("../middleware/authorize");
const { verifyToken } = require("../utils/JwtUtils");

router.post("/yasmessage",  ContactActions.createMessage);
router.get("/yasmessages",verifyToken ,authorizeRole("owner"),  ContactActions.getMessages);
router.get("/yasmessage/:id",verifyToken ,authorizeRole("owner"),  ContactActions.getMessage);

module.exports = router;
