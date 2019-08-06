var jwt = require('jsonwebtoken');

module.exports = function(app) {
	var loginController = require('../controllers/loginController');
	var userController = require('../controllers/userController');

	app.route('/').get(function(req, res) {
			res.sendFile(appRoot  + '/www/index.html');
	});

	//Login apis
	app.route('/api/users')
		.post(loginController.user_signup);
	app.route('/api/users/:email/token')
		.post(loginController.user_login);
	//Logout non server più: il token scade da solo dopo 2 giorni

	//User apis
	app.route('/api/users/:id/password')
		.put(autheticate, loginController.change_user_password);
	
	app.route('/api/users/:id/username')
		.put(autheticate, userController.change_user_username);

	app.route('/api/users/:id/avatar')
		.put(autheticate, userController.change_user_avatar);

	app.route('/api/users/:id')
		.get(autheticate, userController.get_user_personal_info)
	
    app.route('/api/users/:id/info')
		.get(userController.get_user_info);
	
	//Esempio: per richiedere la lista delle lobby non server l'authentication code.
	//		   per aggiungere una lobby invece serve, quindi: "autheticate"
	app.route('/api/lobby')
		.get((req, res) => {
			res.send("Lobbies list");
		})
		.post(autheticate, (req, res) => {
			res.send("Hello " + req.user.email + "!");
		});

	app.use(function(req, res) {
            res.sendFile(appRoot  + '/www/index.html');
	});
	
	function autheticate(req, res, next) {
		const bearerHeader = req.headers['authorization'];
		if(typeof bearerHeader !== 'undefined') {
			const bearer = bearerHeader.split(' ');
			const bearerToken = bearer[1];
			req.token = bearerToken;
			jwt.verify(req.token, 'secretkey', (err, authData) => {
				if(err) {
					res.status(403).send({message: 'Authentication token is not valid.'}).end();
				} else {
					req.authData = authData;
					req.user = authData.user;
					next();
				}
			});
		} else {
		  res.status(403).send({message: 'Authentication token undefined.'}).end();
		}
	}
};

