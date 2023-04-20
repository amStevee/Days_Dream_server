const express = require("express");
const {
  makeUserAdmin,
  getUsers,
  removeUserAdmin,
} = require("../controller/users");
const verifyToken = require('../utils/verifyToken')
const router = express.Router();

router.get("/", getUsers);
router.post("/", makeUserAdmin);
router.put("/", removeUserAdmin);

module.exports = router;
