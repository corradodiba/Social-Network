const express = require("express");
const multer = require("multer");

const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    callback(error, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {

  const URL = req.protocol + "://" + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: URL + "/images/" + req.file.filename
  });
  post.save().then((postCreated) => {
    res.status(201).json({
      message: "Post added successfully!",
      post: {
        id: postCreated._id,
        ...postCreated
      }
    });
  });
});

router.get("", (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post)
  .then(result => {
    res.status(200).json({
      message: 'Post updated successfully!'
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if(post){
      res.status(200).json({
        message: "Post found!",
        post
      });
    } else {
      res.status(404).json({
        message: "Post not found!"
      });
    }
  });
})

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then(result => {
      res.status(200).json({ message: "Post deleted!" });
    });
});

module.exports = router;
