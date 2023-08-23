const express = require("express");
const router = express.Router();
const ContactActions = require ('../endPoints/yasContactActions');
const { authorizeRole } = require("../middleware/authorize");
const { verifyToken } = require("../utils/JwtUtils");

router.post("/yasmessage",  ContactActions.createMessage);
router.get("/yasmessages",verifyToken ,authorizeRole("owner"),  ContactActions.getMessages);
router.get("/yasmessage/:id",verifyToken ,authorizeRole("owner"),  ContactActions.getMessage);

router.post("/createYasPost", verifyToken, authorizeRole("owner"), ContactActions.createYasPost);
router.get("/getYasPosts", verifyToken, authorizeRole("owner"), ContactActions.getYasPosts);
router.get("/getYasPost/:id", verifyToken, authorizeRole("owner"), ContactActions.getYasPost);
router.put("/editYasPost", verifyToken, authorizeRole("owner"), ContactActions.editYasPost);
router.delete("/deleteYasPost/:id", verifyToken, authorizeRole("owner"), ContactActions.deleteYasPost);



module.exports = router;
