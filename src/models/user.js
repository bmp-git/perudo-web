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
  },
  registeredDate: {
    type: Date,
    default: Date.now
  },
  lastReset: {
    type: Date,
    default: Date.now
  },
  points: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  playTime: {
    type: Number,
    default: 0
  },
  totalPlayTime: {
    type: Number,
    default: 0
  },
  avatar: {
    type: String,
    default: ""
  }

});

module.exports = mongoose.model('User', UserSchema);
