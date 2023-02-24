const pool = require("../pgconnect");
const createError = require("../utils/error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const register = (req, res, next) => {
  // CHECK EXISTING user
  const q = "SELECT * FROM users WHERE email = $1 OR username = $2";
  pool.query(q, [req.body.input.email, req.body.input.name], (err, data) => {
    if (err) return next(createError(404));
    if (data.rows.length) {
      return res.status(409).json({ msg: "User alraeady exists" });
    } else {
      // HASH PASSWORD
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.input.password, salt);

      // CREATE USER
      const userId = uuidv4();
      const qq =
        "INSERT INTO users(userid, username, email, password, user_image) VALUES($1, $2, $3, $4, $5)";
      pool.query(
        qq,
        [
          userId,
          req.body.input.username,
          req.body.input.email,
          hash,
          req.body.image,
        ],
        (err, data) => {
          if (err) return res.json(err.message);
          return res
            .status(200)
            .json({ msg: "you have been registered successfully" });
        }
      );
    }
  });
};

// const login = async (req, res, next) => {
//   const q = "SELECT * FROM users WHERE username = $1";
//   try {
//     const isUser = await pool.query(q, [req.body.username]);

//     if (!isUser.rows[0]) return res.status(404).json({ msg: "usernot found" });
//     if (req.body.username === {} || req.body.password === {}) {
//       return res
//         .status(400)
//         .json({ msg: "please fill out the fileds in other to login" });
//     }

//     // COMPARE PASSWORD
//     const cPassword = await bcrypt.compare(
//       req.body.password,
//       isUser.rows[0].password
//     );
//     if (!cPassword) {
//       return res.status(400).json({ msg: "incorrect username or password" });
//     }
//     const token = jwt.sign({ id: isUser.rows[0].id }, process.env.JWTHASH, {
//       expiresIn: "24h",
//     });
//     const { password, ...others } = isUser.rows[0];

//     res
//       .cookie("jwt", token, {
//         httpOnly: true,
//       })
//       .status(200)
//       .json({ ...others });
//   } catch (error) {
//     next(createError(401, "invalid cridentials", error.stack));
//   }
// };

const login = async (req, res, next) => {
  const q = "SELECT * FROM users WHERE username = $1";

  try {
    const user = await pool.query(q, [req.body.username]);
    if (!user) {
      return res.status(404).json({ msg: "usernot found" });
    }

    const passwordCompare = await bcrypt.compare(
      req.body.password,
      user.rows[0].password
    );

    if (!passwordCompare)
      return next(createError(400, "incorrect password or username"));

    const token = jwt.sign(
      {
        id: user.rows[0].id,
      },
      process.env.JWT,
      { expiresIn: "24h" }
    );
    const { password, ...otherDetails } = user.rows[0];

    res
      .cookie("jwt", token, { httpOnly: true })
      .status(200)
      .json({ ...otherDetails });
  } catch (error) {
    next(createError(401, "invalid cridentials", error.stack));
  }
};

const logout = (req, res) => {
  res
    .clearCookie("jwt", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json({ msg: "user has been loged out" });
};

module.exports = { register, login, logout };
