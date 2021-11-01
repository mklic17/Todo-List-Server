var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');

const saltRounds = 10;


router.use(function(req, res, next) {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      req.hashedPassword = hash;
      next();
    });
  })
});

/* POST login */
router.post('/login', function(req, res, next) {
  if(req.body.username && req.body.password) {
    res.send('Valid data');
  } else {
    res.status(400).json({'error': 'username or password is missing'})
  }
});

/* POST register */
router.post('/register', function(req, res, next) {
  console.log(req.body);
  res.send('register endpoint');
  if(req.body.username && req.body.password && req.body.email) {
    //
  }
});

module.exports = router;
