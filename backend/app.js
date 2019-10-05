const express = require("express");
const bodyParse = require("body-parser");
const mongoose = require("mongoose");

const postsRouter = require("./router/posts");


mongoose.connect("mongodb+srv://corrado:yhhGomWiaUGUNX9I@cluster0-f6xao.mongodb.net/social-network?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to database")
  })
  .catch(() => {
    console.log("Connection failed")
  })

const app = express();

app.use(bodyParse.json());

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

app.use("/api/posts", postsRouter);

module.exports = app;
