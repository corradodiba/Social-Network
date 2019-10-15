const path = require("path");
const express = require("express");
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const postsRoutes = require("./router/posts");
const authRoutes = require("./router/auth");


// mongoose.connect("mongodb+srv://corrado:yhhGomWiaUGUNX9I@cluster0-f6xao.mongodb.net/social-network?retryWrites=true&w=majority")

mongoose.connect("mongodb://localhost:27017/weather", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database")
  })
  .catch(() => {
    console.log("Connection failed")
  })

const app = express();

app.use(bodyParse.json());

app.use("/images", express.static(
  path.join("backend/images")
));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
