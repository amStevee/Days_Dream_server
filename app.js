const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const multer = require("multer");
const auths = require("./routes/auth");
const users = require("./routes/users");
const posts = require("./routes/posts");
const port = process.env.PORT || 3001;
dotenv.config();
let dir = path.join(__dirname, "uploads");

app.use(morgan("dev"));
app.use(
  cors({
    origin: "https://daydreamblog.netlify.app",
    credentials: true,
  })
);
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );
// app.use((req, res, next) => {
//   const url = req.headers.origin || "http://localhost:3000";

//   res.setHeader("Access-Control-Allow-Origin", url);
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept,Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,POST,PATCH,DELETE,OPTIONS"
//   );
//   next();
// });
app.use(cookieParser());
const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5, // max requests
  message: "Too many requests to this endpoint. Please try again later.",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(dir));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage });

app.post("/api/v1/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = `this is the unexpected field -> ${error.field}`;
  console.log(errorMessage);
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: error.stack,
  });
});

app.use("/api/v1/auth", limiter, auths);
app.use("/api/v1/user", limiter, users);
app.use("/api/v1/posts", posts);

app.all("*", (req, res) => {
  res.status(404).json("routh not found, please use /api/v1/posts");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
