const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { v4 : uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
const { newRegister, login } = require("../controllers/auth");

//REGISTER
router.post("/register", newRegister);

//LOGIN
router.post("/login", login);

module.exports = router;
