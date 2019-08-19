const mongoose = require('mongoose');
const User = mongoose.model('User');
const RankHistory = mongoose.model('RankHistory');

var examples = require('./exampleInstances');


get_users_place = function(game_actions) {
    let ranks = [];
    let leavers = [];
    let winner = null;
    for(let i = 0; i < game_actions.length; i++) {
        const action = game_actions[i];
        if(action.type === 'lost') {
            ranks.push({ _id: action.user_id});
        } else if(action.type === 'win') {
            winner = { _id: action.user_id};
        } else if(action.type === 'left' && !ranks.find(e => e._id == action.user_id)) {
            ranks.push({ _id: action.user_id});
            leavers.push({ _id: action.user_id});
        }
    }

    if (winner) {
        ranks.push(winner);
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

function get_time_played(game_start_time, leave_time) {
    const start = new Date(game_start_time);
    const end = new Date(leave_time);
    return Math.abs(end - start);
}

function add_time_played_in_place(players, game, game_actions) {
    for(let i = 0; i < players.length; i++) {
        const user_id = players[i]._id;
        const leave_time = get_leave_date(user_id, game_actions);
        const time_played = get_time_played(game.game_start_time, leave_time);
        players[i].time_played = time_played;
    }
}

function update_user_stats(user_id, points_to_add, wins_to_add, losses_to_add, time_to_add) {
    return User.findByIdAndUpdate(user_id,
        {
            $inc : {
                points: points_to_add,
                wins: wins_to_add,
                losses: losses_to_add,
                playTime: time_to_add,
                totalPlayTime: time_to_add
            }
        }).exec();
}

function update_users_stats(points, game, game_actions) {
    const promises = [];
    for(let i = 0; i < points.length; i++) {
        const user_id = points[i]._id;
        const points_to_add = points[i].delta_points;

        const time_played = points[i].time_played;

        const wins_to_add = game.winning_user == user_id ? 1 : 0;
        const losses_to_add = game.winning_user == user_id ? 0 : 1;

        const promise = update_user_stats(user_id, points_to_add, wins_to_add, losses_to_add, time_played).then(() => {
            console.log("User "+ user_id + " stats updated.")
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

function add_days(date, days) {
    const new_date = new Date(date);
    new_date.setDate(new_date.getDate() + days);
    return new_date;
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

            let time_played = 0;
            if (players) {
                const player = players.ranks.find(u => u._id == user_id);
                if(player) {
                    time_played = player.time_played;
                }
            }

            const promise = updatePlayerRankHistory(user_id, rank + 1, points, time_played, wins_to_add, losses_to_add).then(() => {
                console.log("User "+ user_id + " history updated.")
            }, err => {
                console.log("Cannot update user " + user_id + " history." + err)
            });
            promises.push(promise);
        }
        return Promise.all(promises);
    });
}
exports.updateRankHistory = updateRankHistory;

exports.on_game_finish = function (game, game_actions) {
    const players = get_users_place(game_actions);
    add_time_played_in_place(players.ranks, game, game_actions);
    return get_users(players.ranks.map(elem => elem._id)).then(res => {
        const points = compute_points(players.ranks, res);
        update_users_stats(points, game, game_actions).then(() => {
            console.log("Users stats updated!");
            return updateRankHistory(players).then( () => console.log("Users rank history updated!"));
        }).catch(err => console.log("Error during user stats or history update: " + err));
        return points.slice().reverse(); //slice to force copy, reverse is in-place
    });
};


exports.get_user_history = function (req, res) {
    const time_span = 30;
    const today = todayDate();
    const from_date = add_days(today, -time_span);

    const user_id = req.params.id;
    //RankHistory.find({user_id: user_id, history: { $elemMatch: { date: {$gte: from_date.toISOString()}}}}
    RankHistory.find({user_id: user_id}, (err, data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else if (data) {
            let his = data.length > 0 ? data[0].history : [];
            his = his.filter(e => e.date >= from_date);
            res.json(his).end();
        } else {
            res.status(401).send({ message: 'Incorrect user id' }).end();
        }
    });
};

function generate_sample_history(user_id, days) {
    const today = todayDate();
    const records = [];
    for(let i = days; i > 0; i--) {
        const date = add_days(today, -i);
        const record = {
            time_played: Math.round(Math.random() * 8 * 60 * 60 * 1000),
            wins: Math.round(Math.random() * 100),
            losses: Math.round(Math.random() * 100),
            date: date,
            rank: Math.round(Math.random() * 1000),
            points: Math.round(Math.random() * 10000)
        };
        records.push(record);
    }

    updateRankHistory().then(() => {
            RankHistory.findOneAndUpdate({user_id: user_id}, {
                $push: {
                    history: {
                        $each: records,
                        $sort: { date: 1 }
                    }
                }
            },(err, data) => {
                if (err) {
                    console.log("Error updating user sample history " + err);
                } else if (data) {
                    console.log("User sample history updated!");
                } else {
                    console.log("User id not found in sample history update!");
                }
            });
        }
    )


}

//generate_sample_history('5d4bd25fb9976803582381a5', 100);

//exports.on_game_finish(examples.example_game, examples.example_actions);