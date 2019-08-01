module.exports = function(app) {
	var moviesController = require('../controllers/moviesController');
	var loginController = require('../controllers/loginController');
	
	app.route('/')
		.get(moviesController.show_index);

	/* Login / Signup */
	app.route('/login').get(loginController.show_login);
	app.route('/signup').get(loginController.show_signup);
	

	app.route('/api/users')
		.post(loginController.user_signup)
	app.route('/api/users/:email')
		//.put(loginController.update_user)

	app.route('/api/users/:email/session')
		.post(loginController.user_login)
		.delete(loginController.user_logout)


		
	app.route('/api/movies')
		.get(moviesController.list_movies)
		.post(moviesController.create_movie);
	
	app.route('/api/movies/:id')
		.get(moviesController.read_movie)
		.put(moviesController.update_movie)
		.delete(moviesController.delete_movie);

	app.use(moviesController.show_index);
};

