const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    id:{
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    coords: {
      type: Object,
    },
    reward: {
      type: String,
    },
    category: {
      type: String,
    },
    tags: {
      type: [Object],
    },
    guest: {
      type: String,
    },
    photo: {
      type: String,
    },
    brochure: {
      type: String,
    },
    categories: {
      type: Array,
    },
    author:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
