module.exports = function(app) {
	var moviesController = require('../controllers/moviesController');
	var loginController = require('../controllers/loginController');
	
	/* Login / Signup */
	app.route('/login').get(loginController.show_login);
	app.route('/signup').get(loginController.show_signup);
	

	app.route('/api/login/:email').post(loginController.user_login);
	app.route('/api/logout').post(loginController.user_logout);
	app.route('/api/signup/:email').post(loginController.user_signup);

	
	app.route('/')
		.get(moviesController.show_index);

	app.route('/api/movies')
		.get(moviesController.list_movies)
		.post(moviesController.create_movie);

	
	app.route('/api/movies/:id')
		.get(moviesController.read_movie)
		.put(moviesController.update_movie)
		.delete(moviesController.delete_movie);

	app.use(moviesController.show_index);
};

