const {
  addNewNotification,
  deleteNotification,
  getNotification,
} = require("../controllers/notification");
const Notification = require("../models/Notification");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const addMessage = async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    const conversationUsers = await Conversation.findById(
      req.body.conversationId
    );
    const otherUser = conversationUsers.members.filter(
      (member) => member !== req.userId
    );
    req.body = {
      userFrom: req.userId,
      userTo: otherUser[0],
      chatRoomId: req.body.conversationId,
    };
    // console.log(req.body);
    addNewNotification(req, res);
    return res.status(200).json(savedMessage);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { addMessage, getConversation };
