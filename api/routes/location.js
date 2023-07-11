const express = require("express");
const router = express.Router();

const Location = require("../models/Location");

// create a location
router.post("/", async (req, res) => {
  const newLocation = new Location(req.body);
  console.log(req.body);
  try {
    const savedLocation = await newLocation.save();
    res.status(200).json(savedLocation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all locations
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update members of a location
router.put("/:id", async (req, res) => {
  try {
    await Location.findByIdAndUpdate( req.params.id,
        {
            $push: { members: req.body.members },
        }
    )
    const location = await Location.findById(req.params.id);
    res.status(200).json(location);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;