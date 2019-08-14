const mongoose = require('mongoose');
const User = mongoose.model('User');

var examples = require('./exampleInstances');

const pl = ['5d4bd25fb9976803582381a5', '5d4c5775dfcf490e889e66ca'];



get_users_place = function(game_actions) {
    let places = [];
    let leavers = [];
    for(let i = 0; i < game_actions.length; i++) {
        if(game_actions[i].type === 'lost') {
            places.push({ _id: game_actions[i].user_id});
        } else if(game_actions[i].type === 'leave') {
            places.push({ _id:game_actions[i].user_id});
            leavers.push({ _id:game_actions[i].user_id});
        }
    }

    return {places, leavers};
};

points_function = function(place, cp) {
    return cp - cp * 0.10 + place * 100;
};

compute_points = function(players, current_points) {
    let result = [];
    let pointsBid = 0;
    for(let i = 0; i < players.length; i++) {
        const player = players[i];
        let cp = current_points.find(e => e._id === player._id);
        cp = cp ? cp.points : 0;
        player.points = points_function(i, cp);
        pointsBid += cp * 0.10;

        //winner
        if(i === (players.length - 1)) {
            player.points += pointsBid;
        }

        result.push(player);
    }
    console.log(result);
    return result;
};

get_users = function(players_id) {
    return User.find({ _id : { $in : players_id }}).exec().then(res => res,  () => []);
};

update_user_stats = function(user, game, new_points, leaveDate) {
    return {
        _id: user._id,
        points: new_points,
        wins: game.winning_user === user._id ? user.wins + 1 : user.wins,
        losses: game.winning_user === user._id ? user.losses : user.losses + 1,
        playTime: user.playTime + leaveDate - game.game_start_time,
        totalPlayTime: user.totalPlayTime + leaveDate - game.game_start_time,
    };

};

get_leave_date = function(user_id, actions) {
    for(let i = 0; i < actions.length; i++) {
        if(actions[i].type === 'event' && actions[i].code === 3) {
            return actions[i].date;
        } else if(actions[i].type === 'leave' && actions[i].user_id === user_id) {
            return actions[i].date;
        }
    }
};

exports.on_game_finish = function (game, game_actions) {
    const winner = { _id:game.winning_user};
    const players = get_users_place(game_actions);
    players.places.push(winner);
    get_users(players.places.map(elem => elem._id)).then(res => {
        const currentPoints = res.map(elem => {
            return {_id: elem._id, points: elem.points};
        });

        const points = compute_points(players.places, currentPoints);
        for(let i = 0; i < points.length; i++) {
            const leaveDate = get_leave_date(points[i]._id, game_actions);
            //console.log(res);
            //console.log(res.find(e => e._id === points[i]._id));
            //console.log(update_user_stats(res.find(e => e._id === points[i]._id), game, points[i].points,leaveDate));
        }

    });
};

exports.update_profile_stats = function (players) {
    console.log("Update profile stats called!");
    User.find({ _id : { $in : players }}).exec(function (err, result) {
        //console.log(result);
    })
};

//exports.on_game_finish(examples.example_game, examples.example_actions);