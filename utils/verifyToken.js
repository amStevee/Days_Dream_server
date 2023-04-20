const jwt = require("jsonwebtoken");
const createError = require("./error");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1] || req.cookies.access_token;
    jwt.verify(token, 'access_token', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      res.user = user;
      next()
    });
  } else {
    res.sendStatus(401)
  }
};

module.exports = verifyToken;
