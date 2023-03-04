const express = require("express");
const verifyToken = require("../utils/verifyToken");
const {
  getPosts,
  getPost,
  addPosts,
  deletePosts,
  updatePosts,
} = require("../controller/posts");
const router = express.Router();

router.route("/").get(getPosts).post(addPosts);
router.route("/:id").get(getPost);
router.delete("/:id", verifyToken, deletePosts);
router.put("/write", verifyToken, updatePosts);

module.exports = router;
