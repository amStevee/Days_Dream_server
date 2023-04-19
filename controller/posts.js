const pool = require("../pgconnect");
const createError = require("../utils/error");
const dotenv = require("dotenv");
dotenv.config();

const getPosts = async (req, res, next) => {
  const { page, limit } = req.query;
  const offset = (page - 1) * limit;
  try {
    if (req.query.category) {
      const q = "SELECT * FROM posts WHERE category = $1";
      pool.query(q, [req.query.category], (err, data) => {
        if (err) return res.status(500).json(err.message);
        //
        if (data) return res.status(200).json(data.rows);
      });
    } else {
      const q = "SELECT * FROM posts ORDER BY id LIMIT $1 OFFSET $2";
      const { rows, rowCount } = await pool.query(q, [limit, offset]);
      const totalPage = Math.ceil(rowCount / limit);
      res.status(200).json({ rows, totalPage });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(createError(401, "internal server err", error.stack));
  }
};

const getPostsAsid = async (req, res, next) => {
  const q = "SELECT * FROM posts WHERE category = $1 AND title != $2";
  try {
    pool.query(q, [req.query.category, req.query.title], (err, data) => {
      if (err) return res.status(500).json({ msg: err.message });

      return res.status(200).json(data.rows);
    });
  } catch (error) {
    
    console.error(error.message);
  }
};

const getPost = async (req, res) => {
  const pId = Number(req.params.id);
  const q =
    "SELECT posts.id, username, title, description, users.user_image, posts.image, category, posts.created_at FROM posts JOIN users ON posts.userid = users.userid WHERE posts.id = $1 ORDER BY posts.created_at DESC;";
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

  const q = "DELETE FROM posts WHERE id = $1 AND userid = $2";
  pool.query(q, [postId, req.query.uid], (err, qdata) => {
    if (err) {
      return res.status(400).json({ msg: "You can not delete this post" });
    }
    res.status(200).json({ msg: "Post has been deleted successfully" });
  });
};

const updatePosts = async (req, res) => {
  const { title, description, category, image, userid } = req.body;
  const postId = req.query.edit;

  const q =
    "UPDATE posts SET title = $1, description = $2, image = $3, category = $4 WHERE id = $5 AND userid = $6";
  pool.query(
    q,
    [title, description, image, category, postId, userid],
    (err, qdata) => {
      if (err) {
        return res.status(400).json({ msg: "You can not update this post" });
      }
      res.status(200).json({ msg: "Post has been updated successfully" });
    }
  );
};

module.exports = {
  getPosts,
  getPostsAsid,
  getPost,
  addPosts,
  deletePosts,
  updatePosts,
};
