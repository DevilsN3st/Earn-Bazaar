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
      type: String,
      required: true,
    },
    reward: {
      type: String,
    },
    category: {
      type: String,
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
    username: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
    },
    userCategory:{
      type: String,
      required: true,
    },
    isAdmin:{
      type: Boolean,
      required: true,
      default: false,
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
