const bodyParser = require("body-parser");
const express = require("express");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //  for authentication with JWTs
const cookieParser = require("cookie-parser");
const multer = require("multer"); // using for handling image uploads
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

const user = {};

// creating an endpoint for user registration and authentication
app.post("/authentication", async (req, res) => {
  const { username, email, password } = req.body;

  //regex required for validating email and password
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passwordregex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (!emailRegex.test(email) || !passwordregex.test(password)) {
    return res.status(401).json({ message: "Incorrect value" });
  }

  const encryptedPassword = await bycrypt.hashSync(password, 10); // hash the user password before storing it
  user[email] = { username, email, password: encryptedPassword };
  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Success" });
});

//setting up the image storage system
const imgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // will save file to uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

//initailizing multer for storage
const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  //handling file upload
  if (!req.file) {
    return res.status(401).json({ message: "Upload failure" });
  }
  //success scenario
  return res.status(200).json({ message: "Upload successfull" });
});

const port = 3000;
app.listen(3000, () => {
  console.log(`Server running at port ${port}`);
});
