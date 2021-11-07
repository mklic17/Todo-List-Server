var express = require("express");
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const privateKey = process.env.PRIVATE_KEY;
const saltRounds = 10;

router.use(function (req, res, next) {
	bcrypt.genSalt(saltRounds, function (err, salt) {
    	bcrypt.hash(req.body.password, salt, function (err, hash) {
      		req.hashedPassword = hash;
      		next();
   		});
  	});
});

/* POST login */
/* requires the either the username or password with a Password to login. */
router.post("/login", async function (req, res, next) {
	if((req.body.username || req.body.email) && req.body.password) {
		let user;
		if(req.body.username) {
			console.log('Username is given for Login');
			user = await User.findOne().where('username').equals(req.body.username).exec();
		} else if(req.body.email) {
			console.log('email is given for Login');
			user = await User.findOne().where('email').equals(req.body.email).exec();
		} else {
			res.status(400).json({ error: "username or email is incorrect" });
		}

	if (user) {
		console.log('User found: ' + user.username);
		return bcrypt.compare(req.body.password, user.password).then(result => {
			if (result === true) {
				console.log('Result = true');
				const token = jwt.sign({ id: user._id }, privateKey, { algorithm: 'RS256' });
				return res.status(200).json({"access_token": token});
			} else {
				return res.status(401).json({"error": "Invalid credentials."})
			}
		}).catch(error => {
			return res.status(500).json({"error": error.message})
		});
		}
		return res.status(401).json({"error": "Invalid credentials."})	
	} else {
		res.status(400).json({ error: "username or password is missing" });
	}
});

/* POST register */
/* requires username, email and password to signup. email and username have a unique constraint. 
   If you try to create a 2nd user an expected error is thrown */
router.post("/register", async function (req, res, next) {
	if (req.body.username && req.body.password && req.body.email && req.body.passwordConfirmation && isValidEmail(req.body.email)) {
		if (req.body.passwordConfirmation === req.body.password) {
			const user = new User({
				username: req.body.username,
				email: req.body.email,
				password: req.hashedPassword
			});
			
			// Insertion into the MongoDB
			await user.save().then((savedUser) => {
				return res.status(201).json({
					id: savedUser._id,
					username: savedUser.username
				});
			}).catch((error) => {
				return res.status(500).json({ error: error.message });
			});
		} else {
			return res.status(401).json({ error: "Passwords do not Match " });
		}
	} else {
		return res.status(401).json({ error: "Invalid " });
	}
});

// source: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function isValidEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

module.exports = router;
