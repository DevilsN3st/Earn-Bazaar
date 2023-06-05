const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userFrom: {
    type: String,
    required: true,
  },
  userTo: {
    type: String,
    required: true,
  },
  latestNotification:{
    type: Date,
    default: Date.now(),
  },
  chatRoomId: {
    type: String,
    required: true,
  },
},{ timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
