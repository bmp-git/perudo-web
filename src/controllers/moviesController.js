var mongoose = require('mongoose');
var Movie = mongoose.model('Movies');


exports.show_index = function(req, res) {
	res.sendFile(appRoot  + '/www/index.html');
};

exports.list_movies = function(req, res) {
	Movie.find({}, function(err, movie) {
		if (err)
			res.send(err);
		res.json(movie);
	});
};

exports.read_movie = function(req, res) {
	/*
	In questo caso l'id è l'object id che viene assegnato ai documenti direttamente da MongoDB.
	L'id presente nel file mongo_shell è semplicemente un retaggio dell'esercitazione precedente (infatti non è stato incluso nello Schema Moongose che vi abbiamo fornito.
	*/
	Movie.findById(req.params.id, function(err, movie) {
		if (err)
			res.send(err);
		else{
			if(movie==null){
				res.status(404).send({
					description: 'Movie not found'
				});
			}
			else{
				res.json(movie);
			}			
		}
	});
};

exports.create_movie = function(req, res) {	
	var new_movie = new Movie(req.body);
	new_movie.save(function(err, movie) {
		if (err)
			res.send(err);
		res.status(201).json(movie);
	});
};

exports.update_movie = function(req, res) {	 
	Movie.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, movie) {
		if (err)
			res.send(err);
		else{
			if(movie==null){
				res.status(404).send({
					description: 'Movie not found'
				});
			}
			else{
				res.json(movie);
			}
		}
	});
};

exports.delete_movie = function(req, res) {	
	Movie.deleteOne({_id: req.params.id}, function(err, result) {
		if (err)
			res.send(err);
		else{
			if(result.deletedCount==0){
				res.status(404).send({
					description: 'Movie not found'
				});
			}
			else{
				res.json({ message: 'Task successfully deleted' });
			}			
		}
  });
};





