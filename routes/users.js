const express = require("express");
const {
  makeUserAdmin,
  getUsers,
  removeUserAdmin,
} = require("../controller/users");
const verifyToken = require('../utils/verifyToken')
const router = express.Router();

router.get("/", getUsers);
router.post("/", verifyToken, makeUserAdmin);
router.put("/", verifyToken, removeUserAdmin);

module.exports = router;
