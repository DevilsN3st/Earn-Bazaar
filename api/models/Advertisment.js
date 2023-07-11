const mongoose = require("mongoose");

const AdvertismentSchema = new mongoose.Schema(
  {
    locationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Advertisment", AdvertismentSchema);
