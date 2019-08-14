const mongoose = require('mongoose');
const User = mongoose.model('User');

var examples = require('./exampleInstances');

const pl = ['5d4bd25fb9976803582381a5', '5d4c5775dfcf490e889e66ca'];

exports.on_game_finish = function (game, game_action) {
    for(let i = 0; i < game_action.length; i++) {
        //console.log(game_action[i]);
    }
};

exports.update_profile_stats = function (players) {
    console.log("Update profile stats called!");
    User.find({ _id : { $in : players }}).exec(function (err, result) {
        //console.log(result);
    })
};

exports.on_game_finish(examples.example_game, examples.example_actions);