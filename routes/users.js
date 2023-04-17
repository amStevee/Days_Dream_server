const express = require("express");
const { makeUserAdmin, getUsers } = require("../controller/users");
const router = express.Router();

router.route("/").get(getUsers);
router.route("/").post(makeUserAdmin);

module.exports = router;
