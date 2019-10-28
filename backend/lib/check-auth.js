const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, '#k5vdo%GhWm^EbNB&!adCYFb*RPM$gjXmNOJ02%ZphyY&lh$cWbCz9Kl1Q!8*Q7qb81E335BqXMC6^#owkHmWDm9z62PhD%3fU%');
    req.userData = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth Failed'
    });
  }
}
