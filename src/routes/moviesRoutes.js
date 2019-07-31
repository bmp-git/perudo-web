module.exports = function(app) {
	var moviesController = require('../controllers/moviesController');
	
	
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

