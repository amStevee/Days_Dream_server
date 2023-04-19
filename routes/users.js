const express = require("express");
const { makeUserAdmin, getUsers } = require("../controller/users");
const router = express.Router();

router.route("/").get(getUsers);
router.route("/").post(makeUserAdmin);
router.route("/").put(makeUserAdmin);

module.exports = router;
