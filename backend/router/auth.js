const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: err
        });
      });
  });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }).then(user => {
    if (!user) {
      res.status(401).json({
        message: 'Auth Failed!'
      });
    }
    fetchedUser = user;
    return bcrypt.compare(password, user.password);
  })
  .then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Auth Failed!'
      });
    }
    const buffer = '#k5vdo%GhWm^EbNB&!adCYFb*RPM$gjXmNOJ02%ZphyY&lh$cWbCz9Kl1Q!8*Q7qb81E335BqXMC6^#owkHmWDm9z62PhD%3fU%';
    const token = jwt.sign({
      email: fetchedUser.email,
      id: fetchedUser._id
    }, buffer, { expiresIn: '1h'});
    res.status(200).json({
      token: token,
      expiresIn: 3600
    });
  })
  .catch(err => {
    res.status(401).json({
      message: 'Auth Failed!'
    });
  });
});




module.exports = router;
