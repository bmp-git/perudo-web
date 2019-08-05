var mongoose = require('mongoose');
var User = mongoose.model('User');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var genRandomString = function(length){
	return crypto.randomBytes(Math.ceil(length/2))
			.toString('hex')
			.slice(0,length)
};
var saltPassword = function(password, salt){
	var hash = crypto.createHmac('sha512', salt);
	hash.update(password);
	return hash.digest('hex');
};
var validator = require("email-validator");

exports.show_login = function(req, res) {
	if(req.session.loggedin) {
		res.redirect('/');
	} else {
		res.sendFile(appRoot  + '/www/login.html');
	}
};

exports.show_signup = function(req, res) {
	if(req.session.loggedin) {
		res.redirect('/');
	} else {
		res.sendFile(appRoot  + '/www/signup.html');
	}
};

exports.user_signup = function(req, res) {
	var username = req.body.username;
	var email = req.body.email;
    var password = req.body.password;
    if(!username || username.length < 3 || username.length > 15) {
        res.status(400).send({message: "The username must consist of 3 to 15 characters."}).end();
    } else if(!validator.validate(email)) {
        res.status(400).send({message: "Email not valid."}).end();
    } else if(!password || password.length < 5 || password.length > 30) {
        res.status(400).send({message: "The password must consist of 5 to 30 characters."}).end();
	} else {
		User.exists({ email: email }, function(err, found) { 
			if(err) {
				res.status(500).send({message: err});
			} else if(found) {
				res.status(409).send({message: "Email already used."}).end();
				console.log('[user_signup] Email ' + email + ' already in use');
			} else {
				var salt = genRandomString(128);
				var hashedPassword = saltPassword(password, salt);
				var new_user = new User({email: email, username: username, password: hashedPassword, salt: salt});
				console.log('[user_signup] New user: ' + new_user);
				new_user.save(function(err, user) {
					if (err) {
						res.status(500).send({message: err});
					}
					res.status(201).send({message: 'Sign up completed.'}).end();
				});
			}
		});
	}
}

exports.user_login = function(req, res) {
	var email = req.params.email;
	var password = req.body.password;
	if (email && password) {
		User.findOne({ email: email }, function(err, user) { 
			if(err) {
				res.status(500).send({message: err});
			} else if(user) {
				var hashedPassword = saltPassword(password, user.salt);
				if(hashedPassword == user.password) {
                    console.log('[user_auth] Auth of: ' + email + ' success!');
                    jwt.sign({user: {_id: user._id, email: user.email, username: user.username}}, 'secretkey', { expiresIn: '2 days' }, (err, token) => {
                        res.json({ token: token }).end();
                    });
				} else {
					console.log('[user_auth] Auth of: ' + email + ' failed');
                    res.status(401).send({message: 'Incorrect Email and/or Password!'}).end();
				}			
			} else {
				console.log('[user_auth] Auth of: ' + email + ' failed');
                res.status(401).send({message: 'Incorrect Email and/or Password!'}).end();
            }	
		});
	} else {
		res.status(401).send({message: 'Please enter Email and Password!'}).end();
	}
}