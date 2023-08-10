const express = require("express");
const router = express.Router();
const profileActions = require("../endPoints/profileActions");
const { verifyToken } = require("../utils/JwtUtils");
const { makeSureIsOwner } = require("../middleware/authorize");


router.put("/editProfile", verifyToken, profileActions.editProfile);

router.get("/getProfileData/:profileId", verifyToken, profileActions.getProfileData);
router.get("/getAllUsers", verifyToken, profileActions.getAllUsers);

router.delete(
  "/deleteProfile",
  verifyToken,
  makeSureIsOwner("Profile"),
  profileActions.deleteProfile
);


module.exports = router;

/*

(Data will be received as json file in API)

/profile/editProfile
/profile/getProfileData/:profile
/profile/deleteProfile/:profile

*/
