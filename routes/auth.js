const express = require("express");
const { register, login, logout, updateUser } = require("../controller/auth");
const { verify } = require("jsonwebtoken");
const router = express.Router();

router.post("/register", register);
router.post('/login', login);
router.post("/logout", logout);
router.put('/update', verify, updateUser);

module.exports = router;
