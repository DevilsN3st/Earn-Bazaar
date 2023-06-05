const router = require("express").Router();
const { newRegister, login } = require("../controllers/auth");


//REGISTER
router.post("/register", newRegister);

//LOGIN
router.post("/login", login);

module.exports = router;
