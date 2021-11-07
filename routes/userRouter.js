var express = require("express");
var router = express.Router();
const User = require("../models/User");

router.get('/', async function(req, res, next) {
    // if() { // validate user accessing to make sure they have the correct access
        const allUsers = await User.find({}, 'username').exec();
        res.status(200).json({users: allUsers});
    // }
});

module.exports = router;