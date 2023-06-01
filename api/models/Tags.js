const mongoose = require("mongoose");

const TagsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tagId: {
      type: String,
      required: true,
    },
    postId: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tags", TagsSchema);
