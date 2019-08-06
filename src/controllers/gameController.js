const mongoose = require('mongoose');
const User = mongoose.model('User');

var games = new Map(); // game id -> game
var actions = new Map(); //game id -> [actions]
var currentDice = new Map(); //game id -> {user id -> [dice values]}
var startedGames = []; //games
var currentId = 0;
var turnTimeouts = new Map(); //game id -> timer

var updater = setInterval(function () {
    const EXPIRATION_DATE = 60 * 1000; //1 minute
    var toRemove = [];
    games.forEach((v, k, m) => {
        if (v.users.length === 0 && ((new Date) - v.empty_from_date) > EXPIRATION_DATE) {
            toRemove.push(k);
            console.log("Game " + v.id + " is expired.");
        }
    });

    toRemove.forEach(v => {
        remove_game(v);
    });
}, 5000);

remove_game = function (game_id) {
    games.delete(game_id);
    actions.delete(game_id);
    currentDice.delete(game_id);
    if (turnTimeouts.get(game_id)) {
        clearTimeout(turnTimeouts.get(game_id));
    }
    turnTimeouts.delete(game_id);
    console.log("Game " + game_id + " removed.");
}

add_user_to_game = function (game, userId, next) {
    User.findById(userId, function (err, user) {
        if (err || !user) {
            next(false);
        } else {
            game.users.push({ id: userId, username: user.username, avatar: user.avatar, remaining_dice: 5, can_palifico: true });
            next(true);
        }
    });
}

start_game = function (game) {
    actions.set(game.id, []);
    actions_add_event(game.id, "Welcome! The game is started!");
    reroll_dice(game);

    game.started = true;
    game.game_start_time = new Date();
    game.last_turn_user_id = null;
    game.current_bid = null;
    game.is_palifico_round = false;
    game.round = 0;
    change_turn(game, game.users[Math.floor(Math.random() * game.users.length)].id);

    startedGames.push(game);
}

actions_add_message = function (game_id, user_id, message) {
    const actionsList = actions.get(game_id);
    actionsList.push({ type: "message", user_id: user_id, date: new Date(), content: message, index: actionsList.length })
}
actions_add_event = function (game_id, message) {
    const actionsList = actions.get(game_id);
    actionsList.push({ type: "event", date: new Date(), content: message, index: actionsList.length })
}
actions_add_palifico = function (game_id, user_id) {
    const actionsList = actions.get(game_id);
    actionsList.push({ type: "palifico", user_id: user_id, date: new Date(), index: actionsList.length })
}
actions_add_doubt = function (game_id, user_id) {
    const actionsList = actions.get(game_id);
    actionsList.push({ type: "doubt", user_id: user_id, date: new Date(), index: actionsList.length })
}
actions_add_spoton = function (game_id, user_id) {
    const actionsList = actions.get(game_id);
    actionsList.push({ type: "spoton", user_id: user_id, date: new Date(), index: actionsList.length })
}
actions_add_turn = function (game_id, user_id) {
    const actionsList = actions.get(game_id);
    actionsList.push({ type: "turn", user_id: user_id, date: new Date(), index: actionsList.length })
}

reroll_dice = function (game) {
    const game_dice = new Map(); //user_id -> [dice values]
    game.users.forEach(u => {
        const user_dice = [];
        for (i = 0; i < u.remaining_dice; i++) {
            user_dice.push(Math.floor(Math.random() * 6) + 1);
        }
        game_dice.set(u.id, user_dice);
    });
    currentDice.set(game.id, game_dice);
}
change_turn = function (game, user_id) {
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
        console.log(user_id + " in game " + game.id + " is to slow, random bid and next turn.");
        go_next_turn(game);
        if(game.current_bid) {
            game.current_bid.quantity++;
        } else {
            game.current_bid = { dice: Math.floor(Math.random() * 6) + 1, quantity: 1 };
        }
        tick_game(game);
    }, game.turn_time * 1000));
}
go_next_turn = function(game) {
    var t = -1;
    for(i = 0; i < game.users.length; i++) {
        if(game.users[i].id === game.current_turn_user_id) {
            t = (i + 1) % game.users.length;
            break;
        }
    }
    change_turn(game, game.users[t].id);
}

tick_game = function (game) {
    game.tick++;
    //Notify all user in this game that the current tick in now 'game.tick'
    //If their local 'game.tick' is lower they should refresh with '/api/games/:id'
    //Or the clients can do polling on '/api/games/:id/tick'
}

exports.create_game = function (req, res) {
    var new_game = req.body;
    if (!new_game.name || new_game.name.length < 3 || new_game.name.length > 20) {
        res.status(400).send({ message: "'name' must consist of 5 to 30 characters." }).end();
    } else if (!new_game.players || new_game.players < 2 || new_game.players > 8) {
        res.status(400).send({ message: "'players' must be between 2 and 8." }).end();
    } else if (!new_game.turn_time || new_game.turn_time < 10 || new_game.turn_time > 600) {
        res.status(400).send({ message: "'turn_time' must be between 10 and 600 (seconds)." }).end();
    } else if (new_game.password && (new_game.password < 5 || new_game.password > 30)) {
        res.status(400).send({ message: "'password' must consist of 5 to 30 characters." }).end();
    } else if (Array.from(games.values()).some(g => g.users.some(u => u.id === req.user._id))) {
        res.status(400).send({ message: "Cannot create a new game while in another game." }).end();
    } else {
        var id = currentId;
        currentId++;
        new_game.id = id;
        new_game.owner_id = req.user._id;
        new_game.started = false;
        new_game.game_creation_time = new Date();
        new_game.users = [];
        new_game.tick = 0;
        add_user_to_game(new_game, req.user._id, function (success) {
            if (success) {
                games.set(id, new_game);
                res.status(200).send({ result: new_game }).end();
                console.log("[create_game] " + new_game.name + " created");
            } else {
                res.status(500).send({ message: "[create_game] failed on adding owner." }).end();
                console.log("[create_game] failed on adding owner.");
            }
        });
    }
}


exports.get_games = function (req, res) {
    const allGames = Array.from(games.values());
    console.log("[get_games] sent: " + allGames.length);
    res.status(200).send({ result: allGames }).end();
}

exports.get_game = function (req, res) {
    const id = parseInt(req.params.id);
    const game = games.get(id);
    if (!game) {
        res.status(400).send({ message: "Game does not exists." }).end();
    } else {
        res.status(200).send({ result: game }).end();
    }
}

exports.get_game_tick = function (req, res) {
    const id = parseInt(req.params.id);
    const game = games.get(id);
    if (!game) {
        res.status(400).send({ message: "Game does not exists." }).end();
    } else {
        res.status(200).send({ tick: game.tick }).end();
    }
}

exports.join_start_game = function (req, res) {
    const op = req.body.operation;
    const id = parseInt(req.params.id);
    const game = games.get(id);
    console.log("[join_start_game] " + req.user._id + " want to " + op + " game " + id);
    if (!game) {
        res.status(400).send({ message: "Game does not exists." }).end();
    } else if (game.started) {
        res.status(400).send({ message: "This game is already started." }).end();
    } else if (op === "join") {
        if (game.users.length === game.players) {
            res.status(400).send({ message: "This game is full." }).end();
        } else if (game.users.some(u => u.id === req.user._id)) {
            res.status(400).send({ message: "You are already in thin game." }).end();
        } else if (Array.from(games.values()).some(g => g.id !== game.id && g.users.some(u => u.id === req.user._id))) {
            res.status(400).send({ message: "You are already in another game." }).end();
        } else if (game.password && game.password !== req.body.password) {
            res.status(403).send({ message: "Invalid password." }).end();
        } else {
            add_user_to_game(game, req.user._id, success => {
                if (success) {
                    if (!game.owner_id) {
                        game.owner_id = req.user._id;
                    }
                    delete game.empty_from_date;
                    tick_game(game);
                    res.status(200).send({ message: "Game joined.", result: game }).end();
                } else {
                    res.status(500).send({ message: "Failed on adding user." }).end();
                }
            })
        }
    } else if (op === "start") {
        if (game.owner_id !== req.user._id) {
            res.status(400).send({ message: "Only the owner of the game can start." }).end();
        } else if (game.users.length < 1) {
            res.status(400).send({ message: "Need at least 2 user to start." }).end();
        } else {
            start_game(game);
            tick_game(game);
            res.status(200).send({ message: "Game started.", result: game }).end();
        }
    } else {
        res.status(400).send({ message: "'operation' must be start or join." }).end();
    }
}

exports.leave_game = function (req, res) {
    const id = parseInt(req.params.id);
    const game = games.get(id);
    console.log("[leave_game] " + req.user._id + " want to leave game " + id);
    if (!game) {
        res.status(400).send({ message: "Game does not exists." }).end();
    } else if (!game.users.some(u => u.id === req.user._id)) {
        res.status(400).send({ message: "You are not in this game." }).end();
    } else {
        game.users = game.users.filter(u => u.id !== req.user._id);
        if (game.users.length === 0) {
            game.empty_from_date = new Date();
            game.owner_id = "";
            if(game.started) {
                remove_game(game.id);
            }
        } else if(game.started) {
            //TODO
        }
        tick_game(game);
        res.status(200).send({ message: "Removed from game." }).end();
    }
}