const pool = require("../pgconnect");

const getUsers = async (req, res) => {
  const q = "SELECT * FROM users";

  try {
    const { rows } = await pool.query(q);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const makeUserAdmin = async (req, res) => {
  const { user } = req.params;
  const { id } = req.body;
  const q = "SELECT * FROM users WHERE userid = $1";
  pool.query(q, [user], (err, data) => {
    if (err) res.status(401).json({ message: "You can't access this service" });
    try {
      const qd = "UPDATE users SET isadmin = True WHERE userid = $1";
      const { rows } = pool.query(qd, [id]);
      res.status(200).json({ message: "success", rows });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

const removeUserAdmin = async (req, res) => {
  const admin = "ab3cb566-2de6-447a-b747-0719c2d56425";
  const { id } = req.body;
  const q = "SELECT * FROM users WHERE userid = $1";
  pool.query(q, [admin], (err, data) => {
    if (err) res.status(401).json({ message: "You can't access this service" });
    try {
      const qd = "UPDATE users SET isadmin = False WHERE userid = $1";
      const { rows } = pool.query(qd, [id]);
      res.status(200).json({ message: "success", rows });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

module.exports = { makeUserAdmin, getUsers, removeUserAdmin };
