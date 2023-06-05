const router = require("express").Router();
const { addConversation, getConversationsOfAUser, getConversationsOfTwoUsers } = require("../controllers/conversations");

//new conv

router.post("/", addConversation);

//get conv of a user

router.get("/:userId", getConversationsOfAUser );

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", getConversationsOfTwoUsers );

module.exports = router;
