const express = require("express");
const checkAuth = require('../lib/check-auth');
const checkFile = require('../lib/check-file');

const PostsController = require('../controllers/posts');

const router = express.Router();



router.post(
  "",
  checkAuth,
  checkFile,
  PostsController.createPost
);

router.get(
  "",
  PostsController.getPosts
);

router.get(
  "/:id",
  PostsController.getPostById
);

router.put(
  "/:id",
  checkAuth,
  checkFile,
  PostsController.editPostById
);

router.delete(
  "/:id",
  checkAuth,
  PostsController.deletePostById
);

module.exports = router;
