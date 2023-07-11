const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    name:{
      type: String,
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", LocationSchema);
