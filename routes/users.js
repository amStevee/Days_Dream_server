const express = require("express");
const {
  makeUserAdmin,
  getUsers,
  removeUserAdmin,
} = require("../controller/users");
const router = express.Router();

router.route("/").get(getUsers);
router.route("/").post(makeUserAdmin);
router.route("/").put(removeUserAdmin);

module.exports = router;
