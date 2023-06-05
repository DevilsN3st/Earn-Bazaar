const Notification = require("../models/Notification");

const addNewNotification = async (req, res) => {
  try {
    const { userFrom, userTo, chatRoomId } = req.body;
    const alreadyExist = await Notification.findOneAndDelete({
      chatRoomId: chatRoomId,
    });

    const newNotification = new Notification ({
      userFrom,
      userTo,
      chatRoomId
    });
    newNotification.save();
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
};

const deleteNotification = async (req, res) => {
  try {
    var newNotification = await Notification.findOneAndDelete({
      userTo: req.userId,
    });
    res.status(202).json(newNotification);
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
};

const getNotification = async (req, res) => {
  try {
    console.log("getNotification");
    const notificationItem = await Notification.find({
      userTo: req.params.notificationId,
    }).sort({ createdAt: -1 })
    res.status(200).json(notificationItem);
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
};
module.exports = { addNewNotification, deleteNotification, getNotification };
