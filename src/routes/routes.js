var jwt = require('jsonwebtoken');

module.exports = function (app) {
	var loginController = require('../controllers/loginController');
	var userController = require('../controllers/userController');
	var gameController = require('../controllers/gameController');

	app.route('/').get(function (req, res) {
		res.sendFile(appRoot + '/www/index.html');
	});

	//Login apis
	app.route('/api/users')
		.post(loginController.user_signup);
	app.route('/api/users/:email/token')
		.post(loginController.user_login);

	app.route('/api/users/:id/token')
		.get(autheticate, loginController.refresh_token);
	//Logout non server più: il token scade da solo dopo 2 giorni


	//User apis
	app.route('/api/users/:id/password')
		.put(autheticate, loginController.change_user_password);

	app.route('/api/users/:id/username')
		.put(autheticate, userController.change_user_username);

	app.route('/api/users/:id/email')
		.put(autheticate, userController.change_user_email);

	app.route('/api/users/:id/avatar')
		.put(autheticate, userController.change_user_avatar)
		.get(userController.get_user_avatar);

	app.route('/api/users/:id/username')
		.get(userController.get_user_name);

	app.route('/api/users/:id')
		.get(autheticate, userController.get_user_personal_info)

	app.route('/api/users/:id/info')
		.get(userController.get_user_info);

	app.route('/api/users/:id/info')
		.delete(autheticate, userController.reset_user_stats);


	app.route('/api/leaderboard')
		.get(userController.get_leaderboard);



	app.route('/api/games')
		.post(autheticate, gameController.create_game)
		.get(gameController.get_games);

	app.route('/api/games/:id')
		.get(gameController.get_game)
		.put(autheticate, gameController.join_start_game)
		.delete(autheticate, gameController.leave_game);

	app.route('/api/games/:id/tick')
		.get(gameController.get_game_tick);

	app.route('/api/games/:id/actions/messages')
		.post(autheticate, gameController.action_message);

	app.route('/api/games/:id/actions/bids')
		.post(autheticate, gameController.action_bid);

	app.route('/api/games/:id/actions/doubt')
		.post(autheticate, gameController.action_doubt);

	app.route('/api/games/:id/actions/palifico')
		.post(autheticate, gameController.action_palifico);

	app.route('/api/games/:id/actions/spoton')
		.post(autheticate, gameController.action_spoton);

	app.route('/api/games/:id/actions')
		.get(autheticate, gameController.get_actions);

	app.route('/api/games/:id/dice')
		.get(autheticate, gameController.get_dice);

	//Esempio: per richiedere la lista delle lobby non server l'authentication code.
	//		   per aggiungere una lobby invece serve, quindi: "autheticate"
	app.route('/api/lobby')
		.get((req, res) => {
			res.send("Lobbies list");
		})
		.post(autheticate, (req, res) => {
			res.send("Hello " + req.user.email + "!");
		});

	app.route('/img/avatar').get((req, res) => {
		res.sendFile(appRoot + '/www/img/avatar.png');
	});

	app.use(function (req, res) {
		res.sendFile(appRoot + '/www/index.html');
	});

	function autheticate(req, res, next) {
		const bearerHeader = req.headers['authorization'];
		if (typeof bearerHeader !== 'undefined') {
			const bearer = bearerHeader.split(' ');
			const bearerToken = bearer[1];
			req.token = bearerToken;
			jwt.verify(req.token, 'secretkey', (err, authData) => {
				if (err) {
					res.status(403).send({ message: 'Authentication token is not valid.' }).end();
				} else {
					req.authData = authData;
					req.user = authData.user;
					next();
				}
			});
		} else {
			res.status(403).send({ message: 'Authentication token undefined.' }).end();
		}
	}
};

