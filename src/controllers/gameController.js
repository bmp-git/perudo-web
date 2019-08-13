const mongoose = require('mongoose');
const User = mongoose.model('User');

var games = new Map(); // game id -> game
var actions = new Map(); //game id -> [actions]
var currentDice = new Map(); //game id -> {user id -> [dice values]}
var oldDice = new Map(); //game id -> { round -> {user id -> [dice values]}}
var currentId = 0;
var freeIds = [];
var turnTimeouts = new Map(); //game id -> timer
var gameTimeouts = new Map(); //game id -> timer


remove_game = function (game_id) {
    games.delete(game_id);
    actions.delete(game_id);
    currentDice.delete(game_id);
    oldDice.delete(game_id);
    if (turnTimeouts.get(game_id)) {
        clearTimeout(turnTimeouts.get(game_id));
    }
    turnTimeouts.delete(game_id);
    remove_game_io_notification(game_id);
    freeIds.push(game_id);
    console.log("Game " + game_id + " removed.");
    //TODO destroy room watch game_id
};

add_user_to_game = function (game, userId, next) {
    User.findById(userId, function (err, user) {
        if (err || !user) {
            next(false);
        } else {
            game.users.push({
                id: userId, username: user.username,
                avatar_url: "/api/users/" + userId + "/avatar", //TODO remove username and avatar_url
                remaining_dice: 5, can_palifico: true
            });
            next(true);
        }
    });
};

check_for_win = function (game) {
    var remaining_user = 0;
    game.users.forEach(u => {
        if (u.remaining_dice > 0) {
            remaining_user++;
        }
    });
    if (remaining_user === 1) {
        game.winning_user = game.users.find(u => u.remaining_dice > 0).id;
        game.is_over = true;
    } else if (remaining_user === 0) {
        game.is_over = true;
    }

    if (remaining_user <= 1) {
        if (turnTimeouts.get(game.id)) {
            clearTimeout(turnTimeouts.get(game.id));
        }
        actions_add_event(game.id, "The game is over!", 3);
        oldDice.get(game.id).set(game.round, currentDice.get(game.id));
    }
}

start_game = function (game) {
    actions_add_event(game.id, "Welcome! The game is started!", 1);
    actions_add_round(game.id, 1);
    reroll_dice(game);
    oldDice.set(game.id, new Map());

    game.started = true;
    game.game_start_time = new Date();
    game.last_turn_user_id = null;
    game.current_bid = null;
    game.is_palifico_round = false;
    game.last_round_recap = null;
    game.round = 1;
    game.winning_user = null;
    game.is_over = false;
    change_turn(game, game.users[Math.floor(Math.random() * game.users.length)].id);
};

next_round = function (game, palifico, turn_user_id) {
    oldDice.get(game.id).set(game.round, currentDice.get(game.id));
    reroll_dice(game);
    game.current_bid = null;
    game.round++;
    actions_add_round(game.id, game.round);
    game.is_palifico_round = palifico;
    if (turn_user_id) {
        change_turn(game, turn_user_id);
    } else {
        go_next_turn(game);
    }
};

make_bid = function (game, user_id, dice, quantity) {
    const bid = { dice: dice, quantity: quantity };
    actions_add_bid(game.id, user_id, bid);
    game.current_bid = bid;
    go_next_turn(game);
};

remove_one_dice = function (game, user_id) {
    game.users.find(u => u.id === user_id).remaining_dice--;
    actions_add_loses_one_dice(game.id, user_id);
};
reroll_dice = function (game) {
    const game_dice = new Map(); //user_id -> [dice values]
    game.users.forEach(u => {
        const user_dice = []; //what if u.remaining_dice == 0?
        for (i = 0; i < u.remaining_dice; i++) {
            user_dice.push(Math.floor(Math.random() * 6) + 1);
        }
        game_dice.set(u.id, user_dice.sort());
    });
    currentDice.set(game.id, game_dice);
};
count_dice = function (game) {
    var total_dice = 0;
    currentDice.get(game.id).forEach((v, k, m) => {
        if (k === game.last_turn_user_id) {
            total_dice += v.filter(d => d === game.current_bid.dice || d === 1).length;
        } else {
            total_dice += v.filter(d => d === game.current_bid.dice).length;
        }
    });
    return total_dice;
};
change_turn = function (game, user_id) {
    clearTimeout(turnTimeouts.get(game.id));
    turnTimeouts.delete(game.id);

    if (game.current_turn_user_id) {
        game.last_turn_user_id = game.current_turn_user_id;
    } else {
        game.last_turn_user_id = null;
    }
    game.current_turn_user_id = user_id;
    actions_add_turn(game.id, user_id);
    game.turn_start_time = new Date();

    turnTimeouts.set(game.id, setTimeout(function () {
        console.log(user_id + " in game " + game.id + " is too slow, random bid and next turn.");
        actions_add_event(game.id, game.users.find(u => u.id == user_id).username + " is too slow, the game will bid automatically for him.", 2);
        if (game.current_bid) {
            make_bid(game, user_id, game.current_bid.dice, game.current_bid.quantity + 1);
        } else {
            make_bid(game, user_id, Math.floor(Math.random() * 6) + 1, 1);
        }
        tick_game(game);
    }, game.turn_time * 1000));
};
go_next_turn = function (game) {
    var t = -1;
    for (i = 0; i < game.users.length; i++) {
        if (game.users[i].id === game.current_turn_user_id) {
            var k = 1;
            while (game.users[(i + k) % game.users.length].remaining_dice === 0) {
                k++;
            }
            t = (i + k) % game.users.length;
            break;
        }
    }
    change_turn(game, game.users[t].id);
};
is_valid_bid = function (game, dice, quantity) {
    if (dice < 1 || dice > 6 || quantity < 1) {
        return false;
    }
    if (game.current_bid) {
        if ((quantity - game.current_bid.quantity) > 100) { //avoid that a user bid with max int value
            return false;
        }
        if (game.is_palifico_round) {
            return game.current_bid.dice === dice && game.current_bid.quantity < quantity;
        } else {
            if (game.current_bid.dice === 1 && dice === 1) {
                return game.current_bid.quantity < quantity;
            } else if (game.current_bid.dice === 1 && dice !== 1) {
                return (game.current_bid.quantity * 2) < quantity;
            } else if (game.current_bid.dice !== 1 && dice === 1) {
                return game.current_bid.quantity <= (quantity * 2);
            } else if (game.current_bid.dice > dice) {
                return game.current_bid.quantity < quantity;
            } else if (game.current_bid.dice < dice) {
                return game.current_bid.quantity <= quantity;
            } else if (game.current_bid.dice === dice) {
                return game.current_bid.quantity < quantity;
            }
        }
    } else {
        return true;
    }
};

var io = require('../../index.js').get_io();
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('watch game', function (game_id) {
        console.log('watch game: ' + game_id);
        socket.join('game ' + game_id);
    });
    socket.on('unwatch game', function (game_id) {
        console.log('unwatch game: ' + game_id);
        socket.leave('game ' + game_id);
    });
});
tick_game = function (game, force_broadcast) {
    game.tick++;
    //Notify all user that in this game the current tick in now 'game.tick'
    //If their local 'game.tick' is lower they should refresh with get '/api/games/:id'
    //Or the clients can do polling on get '/api/games/:id/tick'
    if (game.started && !force_broadcast) { //notify only the player inside the game
        io.to('game ' + game.id).emit('game changed', { id: game.id, tick: game.tick });
    } else { //notify all ==> a user could have joined the game and this info is usefull for all
        io.emit('game changed', { id: game.id, tick: game.tick });
    }
};
actions_notification = function (game_id) {
    //Notify all user in that game that an actions has been added to 'game'.
    //They should refresh with get '/api/games/:id/actions' from the index they are.
    io.to('game ' + game_id).emit('new action', game_id);
};
new_game_io_notification = function (game_id) {
    io.emit('game added', game_id);
}
remove_game_io_notification = function (game_id) {
    io.emit('game removed', game_id);
}



exports.get_games = function (req, res) {
    const allGames = Array.from(games.values());
    res.status(200).send({ result: allGames }).end();
};

exports.get_game = function (req, res) {
    const id = parseInt(req.params.id);
    const game = games.get(id);
    if (assert_game_exists(game, req, res)) {
        res.status(200).send({ result: game }).end();
    }
};

exports.get_game_tick = function (req, res) {
    const id = parseInt(req.params.id);
    const game = games.get(id);
    if (assert_game_exists(game, req, res)) {
        res.status(200).send({ tick: game.tick }).end();
    }
};

exports.create_game = function (req, res) {
    var new_game = req.body;
    if (!new_game.name || new_game.name.length < 3 || new_game.name.length > 20) {
        res.status(400).send({ message: "'name' must consist of 3 to 30 characters.", error_code: 1 }).end();
    } else if (!new_game.players || new_game.players < 2 || new_game.players > 8) {
        res.status(400).send({ message: "'players' must be between 2 and 8.", error_code: 2 }).end();
    } else if (!new_game.turn_time || new_game.turn_time < 10 || new_game.turn_time > 600) {
        res.status(400).send({ message: "'turn_time' must be between 10 and 600 (seconds).", error_code: 3 }).end();
    } else if (new_game.password && (new_game.password.length < 5 || new_game.password.length > 30)) {
        res.status(400).send({ message: "'password' must consist of 5 to 30 characters.", error_code: 4 }).end();
    } else if (Array.from(games.values()).some(g => g.users.some(u => u.id === req.user._id))) {
        res.status(400).send({ message: "Cannot create a new game while in another game.", error_code: 5 }).end();
    } else {
        if (!new_game.password) {
            new_game.password = null;
        }
        var id = null;
        if (freeIds.length > 128) {
            id = freeIds.shift();
        } else {
            id = currentId;
            currentId++;
        }
        new_game.id = id;
        new_game.owner_id = req.user._id;
        new_game.started = false;
        new_game.game_creation_time = new Date();
        new_game.users = [];
        new_game.tick = 0;
        actions.set(new_game.id, []);
        add_user_to_game(new_game, req.user._id, function (success) {
            if (success) {
                games.set(id, new_game);
                new_game_io_notification(new_game.id);
                res.status(200).send({ result: new_game }).end();
            } else {
                res.status(500).send({ message: "[create_game] failed on adding owner.", error_code: 6 }).end();
            }
        });
    }
};

exports.join_start_game = function (req, res) {
    const op = req.body.operation;
    const id = parseInt(req.params.id);
    const game = games.get(id);
    if (assert_game_exists(game, req, res) && assert_game_is_not_over(game, req, res)) {
        if (game.started) {
            res.status(400).send({ message: "This game is already started.", error_code: 8 }).end();
        } else if (op === "join") {
            if (game.users.length === game.players) {
                res.status(400).send({ message: "This game is full.", error_code: 9 }).end();
            } else if (game.password && game.password !== req.body.password) {
                res.status(403).send({ message: "Invalid password.", error_code: 10 }).end();
            } else if (game.users.some(u => u.id === req.user._id)) {
                res.status(400).send({ message: "You are already in this game.", error_code: 11 }).end();
            } else if (Array.from(games.values()).some(g => g.id !== game.id && g.users.some(u => u.id === req.user._id))) {
                res.status(400).send({ message: "You are already in another game.", error_code: 12 }).end();
            } else {
                add_user_to_game(game, req.user._id, success => {
                    if (success) {
                        if (!game.owner_id) {
                            game.owner_id = req.user._id;
                        }
                        delete game.empty_from_date;
                        if (gameTimeouts.get(game.id)) {
                            clearTimeout(gameTimeouts.get(game.id));
                        }
                        gameTimeouts.delete(game.id);
                        tick_game(game);
                        res.status(200).send({ message: "Game joined.", result: game }).end();
                    } else {
                        res.status(500).send({ message: "Failed on adding user.", error_code: 13 }).end();
                    }
                })
            }
        } else if (op === "start") {
            if (game.owner_id !== req.user._id) {
                res.status(400).send({ message: "Only the owner of the game can start.", error_code: 14 }).end();
            } else if (game.users.length < 2) {
                res.status(400).send({ message: "Need at least 2 user to start.", error_code: 15 }).end();
            } else {
                start_game(game);
                tick_game(game, true);
                res.status(200).send({ message: "Game started.", result: game }).end();
            }
        } else {
            res.status(400).send({ message: "'operation' must be start or join.", error_code: 16 }).end();
        }
    }
};

exports.leave_game = function (req, res) {
    const id = parseInt(req.params.id);
    const game = games.get(id);
    if (assert_in_game(game, req, res)) {
        game.users = game.users.filter(u => u.id !== req.user._id);
        if (game.users.length === 0) {
            game.empty_from_date = new Date();
            game.owner_id = "";
            if (game.started) {
                remove_game(game.id);
            } else {
                gameTimeouts.set(game.id, setTimeout(function () {
                    console.log("Game " + game.id + " is expired.");
                    remove_game(game.id);
                    gameTimeouts.delete(game.id);
                }, 60 * 1000));
            }
        } else if (game.started && !game.is_over) {
            actions_add_left_game(game.id, req.user._id);
            check_for_win(game);
            if (game.is_over) {
                game.last_round_recap = { leave_user: req.user._id };
            } else {
                if (!game.is_over && (game.current_turn_user_id === req.user._id || game.last_turn_user_id === req.user._id)) {
                    game.last_round_recap = { leave_user: req.user._id };
                    next_round(game, false, null);
                }
            }
        } else if (!game.started) { //not started and not empty
            if (game.owner_id === req.user._id) {
                game.owner_id = game.users[0].id;
            }
        }
        tick_game(game);
        res.status(200).send({ message: "Removed from game.", result: game }).end();
    }
};

/* ACTIONS */
exports.action_message = function (req, res) {
    const id = parseInt(req.params.id);
    const game = games.get(id);

    if (game.started && assert_in_game(game, req, res) || assert_game_exists(game, req, res)) {
        actions_add_message(game.id, req.user._id, req.body.message);
        res.status(200).send({ message: "Message posted." }).end();
    }
};
exports.action_doubt = function (req, res) {
    const id = parseInt(req.params.id);
    const game = games.get(id);

    if (assert_is_my_turn(game, req, res) && assert_game_is_not_over(game, req, res)) {
        if (game.current_bid) {
            actions_add_doubt(game.id, req.user._id);
            const total_dice = count_dice(game);
            var lose_user_id = null;
            if (total_dice >= game.current_bid.quantity) {
                lose_user_id = game.current_turn_user_id;
            } else {
                lose_user_id = game.last_turn_user_id;
            }
            remove_one_dice(game, lose_user_id);
            check_for_win(game);
            game.last_round_recap = { bid: game.current_bid, bid_user: game.last_turn_user_id, doubt_user: req.user._id };
            if (!game.is_over) {
                next_round(game, false, lose_user_id);
            }
            tick_game(game);
            res.status(200).send({ message: "Doubt done.", result: game }).end();
        } else {
            res.status(400).send({ message: "Cannot doubt now.", error_code: 17 }).end();
        }
    }
};
exports.action_bid = function (req, res) {
    const id = parseInt(req.params.id);
    const game = games.get(id);
    if (assert_is_my_turn(game, req, res) && assert_game_is_not_over(game, req, res)) {
        if (is_valid_bid(game, req.body.dice, req.body.quantity)) {
            make_bid(game, req.user._id, req.body.dice, req.body.quantity);
            tick_game(game);
            res.status(200).send({ message: "Bid done.", result: game }).end();
        } else {
            res.status(400).send({ message: "Invalid bid.", error_code: 18 }).end();
        }
    }
};
exports.action_spoton = function (req, res) {
    const id = parseInt(req.params.id);
    const game = games.get(id);
    if (assert_in_game(game, req, res) && assert_game_is_not_over(game, req, res)) {
        if (game.current_turn_user_id === req.user._id || game.last_turn_user_id === req.user._id ||
            !game.current_bid || game.users.find(u => u.id === req.user._id).remaining_dice >= 5) {
            res.status(400).send({ message: "You cannot spoton now.", error_code: 19 }).end();
        } else if (game.users.find(u => u.id === req.user._id).remaining_dice === 0) {
            res.status(400).send({ message: "Deads cannot spoton.", error_code: 20 }).end();
        } else {
            actions_add_spoton(game.id, req.user._id);
            const total_dice = count_dice(game);
            game.last_round_recap = { bid: game.current_bid, bid_user: game.last_turn_user_id, spoton_user: req.user._id };
            if (total_dice === game.current_bid.quantity) {
                game.users.forEach(u => {
                    /*if (u.id !== req.user._id) {
                        remove_one_dice(game, u.id);
                    }*/
                })
                actions_add_take_one_dice(game.id, user_id);
                game.users.find(u => u.id === req.user._id).remaining_dice++;
                next_round(game, false, req.user._id);
            } else {
                remove_one_dice(game, req.user._id);
                check_for_win(game);
                if (!game.is_over) {
                    next_round(game, false, req.user._id);
                }
            }
            tick_game(game);
            res.status(200).send({ message: "Spoton done.", result: game }).end();
        }
    }
};

exports.action_palifico = function (req, res) {
    const id = parseInt(req.params.id);
    const game = games.get(id);
    if (assert_in_game(game, req, res) && assert_game_started(game, req, res) && assert_game_is_not_over(game, req, res)) {
        if (game.current_bid || game.users.find(u => u.id === req.user._id).remaining_dice !== 1) {
            res.status(400).send({ message: "You cannot palifico now.", error_code: 21 }).end();
        } else {
            if (game.users.find(u => u.id === req.user._id).can_palifico) {
                actions_add_palifico(game.id, req.user._id);
                change_turn(game, req.user._id);
                game.is_palifico_round = true;
                game.users.find(u => u.id === req.user._id).can_palifico = false;
                tick_game(game);
                res.status(200).send({ message: "Palifico done.", result: game }).end();
            } else {
                res.status(400).send({ message: "You already call palifico.", error_code: 22 }).end();
            }
        }
    }
};

exports.get_actions = function (req, res) {
    const id = parseInt(req.params.id);
    const game = games.get(id);

    if (assert_game_exists(game, req, res)) {
        const from = parseInt(req.query.from_index);
        const type = req.query.type;
        res.status(200).send({ result: actions.get(game.id).filter(a => (!from || a.index >= from) && (!type || a.type === type)) }).end();
    }
};


exports.get_dice = function (req, res) {
    const id = parseInt(req.params.id);
    const game = games.get(id);

    if (assert_game_started(game, req, res)) {
        const round = parseInt(req.query.round);
        if (round === game.round && !game.is_over && assert_in_game(game, req, res)) {
            res.status(200).send({ result: [{ user: req.user._id, dice: currentDice.get(game.id).get(req.user._id) }] }).end();
        } else if (round < game.round || game.is_over) {
            var result = [];
            oldDice.get(game.id).get(round).forEach((v, k, m) => {
                result.push({ user: k, dice: v });
            });
            res.status(200).send({ result: result }).end();
        } else {
            res.status(400).send({ message: "Round does not exists yet.", error_code: 23 }).end();
        }
    }
};


assert_game_started = function (game, req, res) {
    if (!assert_game_exists(game, req, res)) {
        return false;
    } else if (!game.started) {
        res.status(400).send({ message: "Game is not started yet.", error_code: 24 }).end();
        return false;
    }
    return true;
};
assert_game_exists = function (game, req, res) {
    if (!game) {
        res.status(400).send({ message: "Game does not exists.", error_code: 25 }).end();
        return false;
    }
    return true;
};
assert_in_game = function (game, req, res) {
    if (!assert_game_exists(game, req, res)) {
        return false;
    } else if (!game.users.some(u => u.id === req.user._id)) {
        res.status(400).send({ message: "You are not in this game.", error_code: 26 }).end();
        return false;
    }
    return true;
};
assert_is_my_turn = function (game, req, res) {
    if (!assert_game_started(game, req, res)) {
        return false;
    } else if (game.current_turn_user_id !== req.user._id) {
        res.status(400).send({ message: "It is not your turn.", error_code: 27 }).end();
        return false;
    }
    return true;
};
assert_game_is_not_over = function (game, req, res) {
    if (!assert_game_exists(game, req, res)) {
        return false;
    } else if (game.is_over) {
        res.status(400).send({ message: "Game is over.", error_code: 28 }).end();
        return false;
    }
    return true;
};


























actions_add_message = function (game_id, user_id, message) {
    add_action(game_id, { type: "message", user_id: user_id, content: message });
};
actions_add_event = function (game_id, message, code) {
    add_action(game_id, { type: "event", content: message, code: code });
};
actions_add_palifico = function (game_id, user_id) {
    add_action(game_id, { type: "palifico", user_id: user_id });
};
actions_add_bid = function (game_id, user_id, bid) {
    add_action(game_id, { type: "bid", user_id: user_id, bid: bid });
};
actions_add_doubt = function (game_id, user_id) {
    add_action(game_id, { type: "doubt", user_id: user_id });
};
actions_add_spoton = function (game_id, user_id) {
    add_action(game_id, { type: "spoton", user_id: user_id });
};
actions_add_round = function (game_id, number) {
    add_action(game_id, { type: "round", round: number });
};
actions_add_turn = function (game_id, user_id) {
    add_action(game_id, { type: "turn", user_id: user_id });
};
actions_add_left_game = function (game_id, user_id) {
    add_action(game_id, { type: "left", user_id: user_id });
};
actions_add_loses_one_dice = function (game_id, user_id) {
    add_action(game_id, { type: "dice_lost", user_id: user_id });
};
actions_add_take_one_dice = function (game_id, user_id) {
    add_action(game_id, { type: "dice_win", user_id: user_id });
};

var actionNotificationTimeouts = new Map(); //game id -> { timer: ..., count: ...}
add_action = function (game_id, action) {
    const actionsList = actions.get(game_id);
    action.date = new Date();
    action.index = actionsList.length;
    actionsList.push(action);

    var count = 1;
    var timeout = actionNotificationTimeouts.get(game_id);
    if (timeout) {
        clearTimeout(timeout.timer);
        count = timeout.count + 1;
    }
    if (count >= 10) { //if a game countinue to push actions the timer will reset every time for a long period, this prevent it
        console.log("forced actions_notification for " + game_id);
        actions_notification(game_id);
        actionNotificationTimeouts.set(game_id, null);
    } else {
        var t = setTimeout(function () {
            console.log("actions_notification for " + game_id);
            actions_notification(game_id);
            actionNotificationTimeouts.set(game_id, null);
        }, 50);
        actionNotificationTimeouts.set(game_id, { timer: t, count: count });
    }
};