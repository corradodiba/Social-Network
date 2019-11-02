const express = require("express");
const multer = require("multer");
const checkAuth = require('../lib/check-auth');

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

router.post("", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {

  const URL = req.protocol + "://" + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: URL + "/images/" + req.file.filename,
    author: req.userData.id
  });
  post.save().then((postCreated) => {
    res.status(201).json({
      message: "Post added successfully!",
      post: {
        id: postCreated._id,
        ...postCreated
      }
    });
  })
  .catch(() => {
    res.status(500).json({
      message: 'Creating a post failed!'
    });
  });
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        counterPosts: count
      });
    })
    .catch(() => {
      res.status(500).json({
        message: 'Fetched posts failed!'
      })
    });
});

router.put("/:id", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {

  let imagePath = req.body.imagePath;

  if (req.file) {
    const URL = req.protocol + "://" + req.get('host');
    imagePath = URL + "/images/" + req.file.filename
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    author: req.userData.id
  });
  Post.updateOne({_id: req.params.id, author: req.userData.id}, post)
  .then(result => {
    if(result.nModified > 0) {
      res.status(200).json({
        message: 'Post updated successfully!'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized!'
      });
    }
  })
  .catch(() => {
    res.status(500).json({
      message: "Couldn't update post!"
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
  })
  .catch(() => {
    res.status(500).json({
      message: 'Fetched post failed!'
    })
  });
})

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, author: req.userData.id })
    .then(result => {
      if(result.n > 0) {
        res.status(200).json({
          message: 'Post deleted!'
        });
      } else {
        res.status(401).json({
          message: 'Not authorized!'
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Fetched post or deleting failed!'
      })
    });
});

module.exports = router;
