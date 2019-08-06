const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const genRandomString = function (length) {
	return crypto.randomBytes(Math.ceil(length / 2))
		.toString('hex')
		.slice(0, length)
};
const saltPassword = function (password, salt) {
	const hash = crypto.createHmac('sha512', salt);
	hash.update(password);
	return hash.digest('hex');
};
const validator = require("email-validator");

exports.user_signup = function (req, res) {
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	if (!username || username.length < 3 || username.length > 15) {
		res.status(400).send({ message: "The username must consist of 3 to 15 characters." }).end();
	} else if (!validator.validate(email)) {
		res.status(400).send({ message: "Email not valid." }).end();
	} else if (!password || password.length < 5 || password.length > 30) {
		res.status(400).send({ message: "The password must consist of 5 to 30 characters." }).end();
	} else {
		User.exists({ email: email }, function (err, found) {
			if (err) {
				res.status(500).send({ message: err });
			} else if (found) {
				res.status(409).send({ message: "Email already used." }).end();
				console.log('[user_signup] Email ' + email + ' already in use');
			} else {
				const salt = genRandomString(128);
				const hashedPassword = saltPassword(password, salt);
				const new_user = new User({ email: email, username: username, password: hashedPassword, salt: salt });
				console.log('[user_signup] New user: ' + new_user);
				new_user.save(function (err, user) {
					if (err) {
						res.status(500).send({ message: err });
					}
					res.status(201).send({ message: 'Sign up completed.' }).end();
				});
			}
		});
	}
}

exports.user_login = function (req, res) {
	const email = req.params.email;
	const password = req.body.password;
	if (email && password) {
		User.findOne({ email: email }, function (err, user) {
			if (err) {
				res.status(500).send({ message: err });
			} else if (user) {
				const hashedPassword = saltPassword(password, user.salt);
				if (hashedPassword == user.password) {
					console.log('[user_auth] Auth of: ' + email + ' success!');
					jwt.sign({ user: { _id: user._id, email: user.email, username: user.username } }, 'secretkey', { expiresIn: '2 days' }, (err, token) => {
						res.json({ token: token }).end();
					});
				} else {
					console.log('[user_auth] Auth of: ' + email + ' failed');
					res.status(401).send({ message: 'Incorrect Email and/or Password!' }).end();
				}
			} else {
				console.log('[user_auth] Auth of: ' + email + ' failed');
				res.status(401).send({ message: 'Incorrect Email and/or Password!' }).end();
			}
		});
	} else {
		res.status(401).send({ message: 'Please enter Email and Password!' }).end();
	}
}

exports.refresh_token = function (req, res) {
	var id = req.params.id;
	var tokenId = req.authData.user._id;
	if (tokenId !== id) {
		res.status(400).send({message: "Id and token aren't compatible."}).end();
	} else {
		User.findById(id, function (err, user) {
			if (err) {
				res.status(500).send({message: err});
			} else if (user) {
				jwt.sign({ user: { _id: user._id, email: user.email, username: user.username } }, 'secretkey', { expiresIn: '2 days' }, (err, token) => {
					if(err) {
						res.status(500).send({ message: err });
					} else {
						res.json({token: token}).end();
					}
				});
			} else {
				res.status(401).send({message: 'Incorrect user id'}).end();
			}
		});
	}
};

exports.change_user_password = function (req, res) {
	const id = req.params.id;
	const tokenId = req.authData.user._id;
	const password = req.body.password;
	if (tokenId != id) {
		res.status(400).send({ message: "Id and token aren't compatible." }).end();
	} else if (!password || password.length < 5 || password.length > 30) {
		res.status(400).send({ message: "The password must consist of 5 to 30 characters." }).end();
	} else {
		const salt = genRandomString(128);
		const hashedPassword = saltPassword(password, salt);
		User.findByIdAndUpdate(id, { password: hashedPassword, salt: salt }, function (err, result) {
			if (err) {
				res.status(500).send({ message: err }).end();
			} else if (result) {
				res.status(200).send({ message: "Password changed" }).end();
			} else {
				res.status(401).send({ message: "Incorrect user id." }).end();
			}
		});
	}
}

