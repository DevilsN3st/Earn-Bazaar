const express = require("express");
const router = express.Router();
const Advertisment = require("../models/Advertisment");
const Post = require("../models/Post");
const LocationSchema = require("../models/Location");

// create a advertisment
router.post("/", async (req, res) => {
  const newAdvertisment = new Advertisment(req.body);
  try {
    const savedAdvertisment = await newAdvertisment.save();
    res.status(200).json(savedAdvertisment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all advertisments of a location
router.get("/", async (req, res) => {
  const location = req.query.location;
  try {
    if (location) {
        let advertisments = await Advertisment.find({ locationId: location })
        .populate({
            path: "post",
            })
        .populate({
            path: "post",
            populate: {
                path: "author",
                select: "username _id userCategory",
            },
        });
        if( advertisments.length === 0 ) {
            return res.status(200).json("No advertisments on this location found");
        }
        return res.status(200).json(advertisments);
    }
    else {
        return res.status(500).json("No location found");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});


module.exports = router;