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
router.post('/login', async function(req, res, next) {
	if (req.body.username && req.body.password) {
	  
	  const user = await User.findOne().where('username').equals(req.body.username).exec()
  
	  if (user) {
		return bcrypt.compare(req.body.password, user.password).then(result => {
		  if (result === true) {
			const token = jwt.sign({ id: user._id }, privateKey, { algorithm: 'RS256' });
			return res.status(200).json({"access_token": token, "id": user._id});
		} else {
			return res.status(401).json({"error": "Invalid credentials."})
		  }
		}).catch(error => {
		  return res.status(500).json({"error": error.message})
		});
	  }
  
	  return res.status(401).json({"error": "Invalid credentials."})
  
	} else {
	  res.status(400).json({"error": "Username or Password Missing"})
	}
  });





/* POST register /auth/register/ */
/* requires username, email and password to signup. email and username have a unique constraint. 
   If you try to create a 2nd user an expected error is thrown */
router.post("/register", async function (req, res, next) {
	if (req.body.name && req.body.username && req.body.password && req.body.email && req.body.passwordConfirmation) {
		// if(isValidEmail(req.body.email) {}
		if (req.body.passwordConfirmation === req.body.password) {
			const user = new User({
				name: req.body.name,
				username: req.body.username,
				email: req.body.email,
				password: req.hashedPassword
			});

			if(req.body.profileImage){
				user.profileImage = req.body.profileImage;
			}

			// Insertion into the MongoDB
			return await user.save().then((savedUser) => {
				const token = jwt.sign({ id: user._id }, privateKey, { algorithm: 'RS256' });
				return res.status(201).json({
					id: savedUser._id,
					username: savedUser.username,
					"access_token": token
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


router.patch("/update", async function(req, res, next) {
	// need to validate the user making the request is the same as the user you are trying to update
});

// source: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function isValidEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

module.exports = router;
