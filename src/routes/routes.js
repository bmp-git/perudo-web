var jwt = require('jsonwebtoken');

module.exports = function(app) {
	var moviesController = require('../controllers/moviesController');
	var loginController = require('../controllers/loginController');
	
	app.route('/')
		.get(moviesController.show_index);

	/* Login / Signup */
	app.route('/login').get(loginController.show_login);
	app.route('/signup').get(loginController.show_signup);
	

	app.route('/api/users').post(loginController.user_signup)
	app.route('/api/users/:email/token').get(loginController.user_login)
	//Logout non server più: il token scade da solo dopo 2 giorni

	
	//Esempio: per richiedere la lista delle lobby non server l'authentication code.
	//		   per aggiungere una lobby invece serve, quindi: "autheticate"
	app.route('/api/lobby')
		.get((req, res) => {
			res.send("Lobbies list");
		})
		.post(autheticate, (req, res) => {
			res.send("Hello " + req.user.email + "!");
		});


	app.route('/api/movies')
		.get(moviesController.list_movies)
		.post(moviesController.create_movie);
	
	app.route('/api/movies/:id')
		.get(moviesController.read_movie)
		.put(moviesController.update_movie)
		.delete(moviesController.delete_movie);

	app.use(moviesController.show_index);



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

