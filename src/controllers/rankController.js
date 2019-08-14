const mongoose = require('mongoose');
const User = mongoose.model('User');

var examples = require('./exampleInstances');


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
        player.delta_points = 0;

        let cp = current_points.find(e => e._id == player._id);
        cp = cp ? cp.points : 0;

        //i = place in ranking, last is the winner.
        player.delta_points =  i * 100 - cp * 0.10;
        pointsBid += cp * 0.10;

        //winner
        if(i === (players.length - 1)) {
            player.delta_points += pointsBid;
        }

        player.points = cp + Math.round(player.delta_points);

        result.push(player);
    }
    return result;
};

get_users = function(players_id) {
    return User.find({ _id : { $in : players_id }}).exec().then(res => res,  () => []);
};

update_user_stats = function(user, game, new_points, leaveDate) {
    if (!(leaveDate instanceof Date)) {
        leaveDate = new Date(leaveDate);
    }

    if (!(game.game_start_time instanceof Date)) {
        game.game_start_time = new Date(game.game_start_time);
    }
    return {
        _id: user._id,
        points: new_points,
        wins: game.winning_user == user._id ? user.wins + 1 : user.wins,
        losses: game.winning_user == user._id ? user.losses : user.losses + 1,
        playTime: user.playTime + Math.abs(leaveDate - game.game_start_time),
        totalPlayTime: user.totalPlayTime + Math.abs(leaveDate - game.game_start_time),
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
    return get_users(players.places.map(elem => elem._id)).then(res => {
        const currentPoints = res.map(elem => {
            return {_id: elem._id, points: elem.points};
        });

        const points = compute_points(players.places, currentPoints);
        for(let i = 0; i < points.length; i++) {
            const leaveDate = get_leave_date(points[i]._id, game_actions);
            const user = res.find(e => e._id == points[i]._id);

            if(!user) {
                continue; //If user not found in database.
            }

            const updated_user = update_user_stats(user, game, points[i].points,leaveDate);

            User.findByIdAndUpdate(user._id, updated_user, function (err, result) {
                if (err) {
                    console.log("Cannot update user " + user._id + " stats.");
                } else if (result) {
                    console.log("User "+ user._id + " stats updated.");
                } else {
                    console.log("User id not found during stats update.");
                }
            });
        }
        return points;
    });
};


//exports.on_game_finish(examples.example_game, examples.example_actions);