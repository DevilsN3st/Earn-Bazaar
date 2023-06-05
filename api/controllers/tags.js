
const Tags = require("../models/Tags");

const getTag = async (req, res) => {
    try {
      const cats = await Tags.find();
      return res.status(200).json(cats);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  const addTag = async (req, res) => {
    const newTag = new Tags(req.body);
    try {
      const savedTag = await newTag.save();
      return res.status(200).json(savedTag);
    } catch (err) {
      return res.status(500).json(err);
    }
  }


module.exports = { addTag, getTag };