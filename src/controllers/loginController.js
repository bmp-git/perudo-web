var mongoose = require('mongoose');
var User = mongoose.model('User');
var crypto = require('crypto');
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
	var email = req.params.email;
    var password = req.body.password;
    if(!username || username.length < 3 || username.length > 15) {
        res.status(400).send("The username must consist of 3 to 15 characters");
        res.end();
        return;
    }
    if(!validator.validate(email)) {
        res.status(400).send("Email not valid");
        res.end();
        return;
    }
    if(!password || password.length < 5 || password.length > 30) {
        res.status(400).send("The password must consist of 5 to 30 characters");
        res.end();
        return;
    }
	User.exists({ email: req.body.email }, function(err, found) { 
		if(found) {
			res.status(409).send('Email already used');
			console.log('[user_signup] Email ' + email + ' already in use');
		} else {
			var salt = genRandomString(128);
			var hashedPassword = saltPassword(password, salt);
			var new_user = new User({email: email, username: username, password: hashedPassword, salt: salt});
			console.log('[user_signup] New user: ' + new_user);
			new_user.save(function(err, user) {
				if (err) {
					res.send(err);
				}
				delete user.password;
				delete user.salt;
				res.status(201).json(user);
			});
        }
        res.end();
	});
}

exports.user_login = function(req, res) {
    if(req.session.loggedin) {
        res.status(405).send('Already logged in');
        res.end();
        return;
    }
	var email = req.params.email;
	var password = req.body.password;
	if (email && password) {
		User.findOne({ email: email }, function(err, user) { 
			if(user) {
				var hashedPassword = saltPassword(password, user.salt);
				if(hashedPassword == user.password) {
					console.log('[user_auth] Auth of: ' + email + ' success!');
					req.session.loggedin = true;
					req.session.user = user;
					res.send('Ok');
				} else {
					console.log('[user_auth] Auth of: ' + email + ' failed');
					res.status(401).send('Incorrect Email and/or Password!');
				}			
			} else {
				console.log('[user_auth] Auth of: ' + email + ' failed');
				res.status(401).send('Incorrect Email and/or Password!');
            }	
            res.end();
		});
	} else {
		res.status(401).send('Please enter Email and Password!');
		res.end();
	}
}

exports.user_logout = function(req, res) {
    if(req.session.loggedin) {
        console.log("[user_logout]" + req.session.user.email + " logout");
        req.session.loggedin = false;				
        res.status(200).send("Loggout ok");
    } else {
        res.status(405).send("Need to login first");
    }
    res.end();
}