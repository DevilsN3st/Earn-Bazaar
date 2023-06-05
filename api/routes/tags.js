const router = require("express").Router();

const { addTag, getTag } = require("../controllers/tags");  

router.post("/", addTag);

router.get("/", getTag);

module.exports = router;
