var express = require("express");
const jwt = require('jsonwebtoken');
var router = express.Router();
const User = require("../models/User");
const privateKey = process.env.PRIVATE_KEY;


// forces the people accessing to have Authorized user accounts
router.use(function(req, res, next) {
    if (req.header("Authorization")) {
        try {
            req.payload = jwt.verify(req.header("Authorization"), privateKey, { algorithms: ['RS256'] });
        } catch(error) {
            return res.status(401).json({"error": error.message});
        }
    } else {
        return res.status(401).json({"error": "Unauthorized"});
    }
    next();
});


// GET: /user/:id
router.get('/:id', async function(req, res, next) {
    const myUser = await User.findById(req.params.id).exec();
    return res.status(200).json({
        name: myUser.name,
        username: myUser.username,
        email: myUser.email,
        profileImage: myUser.profileImage
    });
});


// GET /user/
router.get('/', async function(req, res, next) {
    const allUsers = await User.find({}, 'id name profileImage username').exec();
    res.status(200).json(allUsers);
});

module.exports = router;