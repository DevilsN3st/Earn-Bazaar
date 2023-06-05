const Conversation = require("../models/Conversation");


const addConversation = async (req, res) => {

    try {       
        const newConversation = new Conversation({
          members: [req.body.senderId, req.body.receiverId],
        });
      const savedConversation = await newConversation.save();
      return res.status(200).json(savedConversation);
    } catch (err) {
      return res.status(500).json(err);
    }


}

const getConversationsOfAUser = async (req, res) => {
    try {
      const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      return res.status(200).json(conversation);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

const getConversationsOfTwoUsers = async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      return res.status(200).json(conversation);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
module.exports = { addConversation, getConversationsOfAUser, getConversationsOfTwoUsers };
