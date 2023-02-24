const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const auths = require("./routes/auth");
const users = require("./routes/users");
const posts = require("./routes/posts");
const port = process.env.PORT || 3001;
dotenv.config();
let dir = path.join(__dirname, "uploads");

app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://daydreamblog.netlify.app"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
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

app.use("/api/v1/auth", auths);
app.use("/api/v1/user", users);
app.use("/api/v1/posts", posts);

app.all("*", (req, res) => {
  res.status(404).json("routh not found, please use /api/v1/posts");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
