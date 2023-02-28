const jwt = require("jsonwebtoken");
const createError = require("./error");

const verifyToken = (req, res, next) => {
  console.log(req.headers);
  const token = req.cookies["access_token"];
  if (!token) return next(createError(401, "you are not authenticated"));
  jwt.verify(token, process.env.JWTHASH, (err, user) => {
    if (err) return next(createError(403, "Token not valid"));
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
