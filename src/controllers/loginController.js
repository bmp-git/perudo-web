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
	User.exists({ email: req.body.email }, function(err, found) { 
		if(found) {
			res.send('Email already used');
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
	});
}

exports.user_login = function(req, res) {
	var email = req.body.email;
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
					res.send('Incorrect Email and/or Password!');
				}			
				res.end();
			} else {
				console.log('[user_auth] Auth of: ' + email + ' failed');
				res.send('Incorrect Email and/or Password!');
			}	
		});
	} else {
		res.send('Please enter Email and Password!');
		res.end();
	}
}

exports.user_logout = function(req, res) {
    if(req.session.loggedin) {
        console.log("[user_logout]" + req.session.user.email + " logout");
        req.session.loggedin = false;				
        res.send("Loggout ok");
    } else {
        res.send("Need to login first");
    }
    res.end();
}