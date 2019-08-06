var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.change_user_username = function (req, res) {
    var username = req.body.username;
    var id = req.params.id;
    var tokenId = req.authData.user._id;
    if (tokenId != id) {
        res.status(400).send({message: "Id and token aren't compatible."}).end();
    } else if (!username || username.length < 3 || username.length > 15) {
        res.status(400).send({message: "The username must consist of 3 to 15 characters."}).end();
    } else {
        User.findByIdAndUpdate(id, {username: username}, function (err, result) {
            if (err) {
                res.status(500).send({message: err}).end();
            } else if (result) {
                res.status(200).send({message: "New username set."}).end();
            } else {
                res.status(401).send({message: "Incorrect user id."}).end();
            }
        });
    }
};

exports.change_user_avatar = function (req, res) {
    var avatar = req.body.avatar;
    var id = req.params.id;
    var tokenId = req.authData.user._id;
    if (tokenId != id) {
        res.status(400).send({message: "Id and token aren't compatible."}).end();
    } else {
        User.findByIdAndUpdate(id, {avatar: avatar}, function (err, result) {
            if (err) {
                res.status(500).send({message: err}).end();
            } else if (result) {
                res.status(200).send({message: "New avatar set."}).end();
            } else {
                res.status(401).send({message: "Incorrect user id."}).end();
            }
        });
    }
};

exports.get_user_personal_info = function (req, res) {
    var id = req.params.id;
    var tokenId = req.authData.user._id;
    if (tokenId != id) {
        res.status(400).send({message: "Id and token aren't compatible."}).end();
    } else {
        User.findById(id, function (err, user) {
            if (err) {
                res.status(500).send({message: err});
            } else if (user) {
                res.json({
                    user: {
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                        avatar: user.avatar
                    }
                }).end();
            } else {
                res.status(401).send({message: 'Incorrect user id'}).end();
            }
        });
    }
};

exports.get_user_info = function (req, res) {
    var id = req.params.id;
    User.findById(id, function (err, user) {
        if (err) {
            res.status(500).send({message: err});
        } else if (user) {
            res.json({
                user: {
                    username: user.username,
                    registeredDate: user.registeredDate,
                    lastReset: user.lastReset,
                    points: user.points,
                    wins: user.wins,
                    losses: user.losses,
                    playTime: user.playTime,
                    totalPlayTime: user.totalPlayTime,
                    avatar: user.avatar
                }
            }).end();
        } else {
            res.status(401).send({message: 'Incorrect user id'}).end();
        }
    });
};

exports.get_leaderboard = function (req, res) {
    var page = req.query.page;
    var pageLenght = req.query.pageLenght;
    if(page && pageLenght && /^[1-9]\d*$/.test(page) && /^[1-9]\d*$/.test(pageLenght)) {
        User.paginate({}, {page : parseInt(page, 10), limit: parseInt(pageLenght, 10), sort : {points : -1}}, function(err, result) {
            if (err) {
                res.status(500).send({message: err});
            } else {
                var leaderboard = {result : []};
                var i = 1;
                result.docs.forEach(function(user) {
                    leaderboard.result.push({rank: i++, userId: user._id, username: user.username, points : user.points});
                });
                res.json(leaderboard).end();
            }
        });
    } else {
        res.status(401).send({message: 'Incorrect parameters'}).end();
    }
}