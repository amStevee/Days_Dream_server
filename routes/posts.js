const express = require("express");
const verifyToken = require("../utils/verifyToken");
const {
  getPosts,
  getPostsAsid,
  getPost,
  addPosts,
  deletePosts,
  updatePosts,
} = require("../controller/posts");
const router = express.Router();

router.route("/").get(getPosts).post(addPosts);
router.route("/aside").get(getPostsAsid);
router.route("/:id").get(getPost);
router.delete("/:id", deletePosts);
router.put("/write", updatePosts);

module.exports = router;
