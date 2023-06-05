const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  latestNotification:{
    type: Date,
    default: Date.now(),
  },
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
},{ timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
