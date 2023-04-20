const express = require("express");
const { register, login, logout, updateUser } = require("../controller/auth");
const router = express.Router();

router.post("/register", register);
router.post('/login', login);
router.post("/logout", logout);
router.put('/update', updateUser);

module.exports = router;
