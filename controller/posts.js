const pool = require("../pgconnect");
const createError = require("../utils/error");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const getPosts = async (req, res, next) => {
  try {
    if (req.query.category) {
      const q = "SELECT * FROM posts WHERE category = $1";
      await pool.query(q, [req.query.category], (err, data) => {
        if (err) return res.status(500).json(err);
        //
        if (data) return res.status(200).json(data.rows);
      });
    } else {
      const q = "SELECT * FROM posts";
      await pool.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        //
        if (data) return res.status(200).json(data.rows);
      });
    }
  } catch (error) {
    next(createError(401, "invalid cridentials", error.stack));
  }
};

const getPost = async (req, res) => {
  const pId = Number(req.params.id);
  const q =
    "SELECT posts.id, username, title, description, user_image, posts.image, category, posts.created_at FROM users JOIN posts ON users.userid = posts.userid WHERE posts.id = $1";
  const { rows } = await pool.query(q, [pId]);

  res.status(200).json(rows[0]);
};

const addPosts = async (req, res) => {
  const { userid, title, description, category, image } = req.body;
  try {
    const q =
      "INSERT INTO posts(title, description, image, userid, category) VALUES($1, $2, $3, $4, $5)";
    await pool.query(q, [title, description, image, userid, category]);
    return res.status(200).json({ msg: "This is a addPosts" });
  } catch (err) {
    console.log(err);
  }
};

const deletePosts = async (req, res) => {
  const postId = req.params.id;
  console.log(postId);
  console.log(req.body.userid);

  const q = "DELETE FROM posts WHERE id = $1 AND userid = $2";
  pool.query(q, [postId, req.body.userid], (err, qdata) => {
    if (err) {
      return res.status(400).json({ msg: "You can not delete this post" });
    }
    res.status(200).json({ msg: "Post has been deleted successfully" });
  });
};

const updatePosts = async (req, res) => {
  const { userid, title, description, category, image } = req.body;

  const postId = Number(req.params.edit);

  const q =
    "UPDATE posts SET title = $1, description = $2, image = $3, category = $4 WHERE id = $5";
  pool.query(q, [title, description, image, category, postId], (err, qdata) => {
    if (err) {
      return res.status(400).json({ msg: "You can not update this post" });
    }
    res.status(200).json({ msg: "Post has been updated successfully" });
  });
};

module.exports = { getPosts, getPost, addPosts, deletePosts, updatePosts };
