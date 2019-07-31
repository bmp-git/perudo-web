var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MovieSchema = new Schema({
  homepage: {
    type: String
	},
  overview: {
    type: String,
    required: 'A brief description is required'
  },
  poster_path: {
    type: String
  },
  release_date: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: 'A title is required'
  },
});

module.exports = mongoose.model('Movies', MovieSchema);
