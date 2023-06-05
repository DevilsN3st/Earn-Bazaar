const router = require("express").Router();
const { addMessage, getConversation } = require("../controllers/messages");
const auth = require("../middleware/auth");

//add

router.post("/", auth, addMessage );

//get

router.get("/:conversationId", getConversation);

module.exports = router;
