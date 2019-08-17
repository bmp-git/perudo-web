const mongoose = require('mongoose');
const User = mongoose.model('User');
const RankHistory = mongoose.model('RankHistory');

var examples = require('./exampleInstances');


get_users_place = function(game_actions) {
    let ranks = [];
    let leavers = [];
    for(let i = 0; i < game_actions.length; i++) {
        const action = game_actions[i];
        if(action.type === 'lost') {
            ranks.push({ _id: action.user_id});
        } else if(action.type === 'left' && !ranks.find(e => e._id == action.user_id)) {
            ranks.push({ _id: action.user_id});
            leavers.push({ _id: action.user_id});
        }
    }

    return {ranks, leavers};
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

        player.delta_points = Math.round(player.delta_points);

        player.points = cp + player.delta_points;

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

function update_users_stats(points, users, game, game_actions) {
    const promises = [];
    for(let i = 0; i < points.length; i++) {
        const leaveDate = get_leave_date(points[i]._id, game_actions);
        const user = users.find(e => e._id == points[i]._id);

        if(!user) {
            continue; //If user not found in database.
        }

        const updated_user = update_user_stats(user, game, points[i].points,leaveDate);

        const promise = User.findByIdAndUpdate(user._id, updated_user).exec().then(() => {
            console.log("User "+ user._id + " stats updated.")
        }, err => {
            console.log("Cannot update user " + user._id + " stats." + err)
        });
        promises.push(promise);
    }
    return Promise.all(promises);
}


get_leave_date = function(user_id, actions) {
    for(let i = 0; i < actions.length; i++) {
        if(actions[i].type === 'event' && actions[i].code === 3) {
            return actions[i].date;
        } else if(actions[i].type === 'left' && actions[i].user_id == user_id) {
            return actions[i].date;
        }
    }
};



function todayDate() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return today;
}

function snapshotRanks() {
    return User.find({}, '_id points').sort({points: -1}).exec();
}

function updatePlayerRankHistory(user_id, rank, points, time_to_add = 0, wins_to_add = 0, losses_to_add = 0) {
    const today = todayDate();
    return RankHistory.bulkWrite([
        {
            updateOne: {
                filter: { user_id: user_id },
                update: {
                    $setOnInsert: {
                            user_id: user_id,
                            history: []
                        }
                },
                upsert: true
            }
        },
        {
            updateOne: {
                filter: { user_id:user_id, 'history.date': today },
                update: {
                    $set: {
                        'history.$.rank': rank,
                        'history.$.points': points
                    },
                    $inc : {
                        'history.$.wins' : wins_to_add,
                        'history.$.losses' : losses_to_add,
                        'history.$.time_played' : time_to_add,
                    }
                }
            }
        },
        {
            updateOne: {
                filter: { user_id: user_id, 'history.date': { $ne: today } },
                update: {
                    $push: { history: {
                        date: today,
                        rank: rank,
                        points: points,
                        time_played: time_to_add,
                        wins: wins_to_add,
                        losses: losses_to_add,
                    }}
                }
            }
        }
        ],
        {
            ordered: true
        });
}

function updateRankHistory(players) {
    return snapshotRanks().then(ranks => {
        let winner = null;
        let losers = [];
        if(players && players.ranks.length > 0) {
            winner = players.ranks[players.ranks.length - 1];
            losers = players.ranks.slice(0, players.ranks.length - 1);
        }

        const promises = [];
        for(let rank = 0; rank < ranks.length; rank++) {
            const user_id = ranks[rank]._id;
            const points = ranks[rank].points;
            const wins_to_add = (winner && user_id == winner._id) ? 1 : 0;
            const losses_to_add = losers.find(u => u._id == user_id) ? 1 : 0;
            const promise = updatePlayerRankHistory(user_id, rank + 1, points, 0, wins_to_add, losses_to_add).then(() => {
                console.log("User "+ user_id + " history updated.")
            }, err => {
                console.log("Cannot update user " + user_id + " history." + err)
            });
            promises.push(promise);
        }
        return Promise.all(promises);
    });
}

exports.on_game_finish = function (game, game_actions) {
    const winner = { _id:game.winning_user};
    const players = get_users_place(game_actions);
    players.ranks.push(winner);
    return get_users(players.ranks.map(elem => elem._id)).then(res => {
        const points = compute_points(players.ranks, res);
        update_users_stats(points, res, game, game_actions).then(() => {
            console.log("Users stats updated!");
            return updateRankHistory(players).then( () => console.log("Users rank history updated!"));
        }).catch(err => console.log("Error during user stats or history update: " + err));
        return points.slice().reverse(); //slice to force copy, reverse is in-place
    });
};


//exports.on_game_finish(examples.example_game, examples.example_actions);