const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
// const path = require("path");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const multer = require("multer");
// 
const { S3 } = require("aws-sdk");
const auths = require("./routes/auth");
const users = require("./routes/users");
const posts = require("./routes/posts");
const port = process.env.PORT || 3001;
dotenv.config();

app.use(morgan("dev"));

const whitelist = [
  "https://daydreamblog.netlify.app",
  "https://s3.console.aws.amazon.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
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

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5, // max requests
  message: "Too many requests to this endpoint. Please try again later.",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/uploads", express.static("uploads"));

const s3 = new S3({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/v1/upload", upload.single("file"), async (req, res) => {
  const { originalname, buffer } = req.file;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: originalname,
    Body: buffer,
    ACL: "public-read",
  };

  try {
    const data = await s3
      .upload(params)
      .on("httpUploadProgress", (progress) => {
        console.log(
          `Progress: ${progress.loaded} bytes of ${progress.total} bytes`
        );
      })
      .promise();
    
    const imageUrl = data.Location;
    const filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    res.send(filename);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while uploading the file");
  }
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
app.use("/api/v1/user", users);
app.use("/api/v1/posts", posts);

app.all("*", (req, res) => {
  res.status(404).json("routh not found, please use /api/v1/posts");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
