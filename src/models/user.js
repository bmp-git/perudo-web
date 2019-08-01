var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  username: {
    type: String,
    required: 'The username is required'
	},
  email: {
    type: String,
    required: 'Email address is required'
  },
  password: {
    type: String,
    required: 'Password address is required'
  },
  salt: {
    type: String,
    required: ''
  }
});

module.exports = mongoose.model('User', UserSchema);
