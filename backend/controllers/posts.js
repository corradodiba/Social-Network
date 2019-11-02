const Post = require("../models/post");

exports.createPost = (req, res, next) => {

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
}

exports.getPosts = (req, res, next) => {
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
}

exports.getPostById = (req, res, next) => {
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
}

exports.editPostById = (req, res, next) => {

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
}

exports.deletePostById = (req, res, next) => {
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
}
