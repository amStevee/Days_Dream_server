const express = require("express");
const { makeUserAdmin } = require("../controller/users");
const router = express.Router();

router.route("/").post(makeUserAdmin);

module.exports = router;
