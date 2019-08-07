const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.change_user_username = function (req, res) {
    const username = req.body.username;
    const id = req.params.id;
    const tokenId = req.authData.user._id;
    if (tokenId !== id) {
        res.status(400).send({ message: "Id and token aren't compatible." }).end();
    } else if (!username || username.length < 3 || username.length > 15) {
        res.status(400).send({ message: "The username must consist of 3 to 15 characters." }).end();
    } else {
        User.findByIdAndUpdate(id, { username: username }, function (err, result) {
            if (err) {
                res.status(500).send({ message: err }).end();
            } else if (result) {
                res.status(200).send({ message: "New username set." }).end();
            } else {
                res.status(401).send({ message: "Incorrect user id." }).end();
            }
        });
    }
};

const validator = require("email-validator");
exports.change_user_email = function (req, res) {
    const email = req.body.email;
    const id = req.params.id;
    const tokenId = req.authData.user._id;
    if (tokenId !== id) {
        res.status(400).send({ message: "Id and token aren't compatible." }).end();
    } else if (!validator.validate(email)) {
        res.status(400).send({ message: "Email not valid." }).end();
    } else {
        User.findByIdAndUpdate(id, { email: email }, function (err, result) {
            if (err) {
                res.status(500).send({ message: err }).end();
            } else if (result) {
                res.status(200).send({ message: "New email set." }).end();
            } else {
                res.status(401).send({ message: "Incorrect user id." }).end();
            }
        });
    }
};

exports.change_user_avatar = function (req, res) {
    const avatar = req.body.avatar;
    const id = req.params.id;
    const tokenId = req.authData.user._id;
    if (tokenId !== id) {
        res.status(400).send({ message: "Id and token aren't compatible." }).end();
    } else {
        User.findByIdAndUpdate(id, { avatar: avatar }, function (err, result) {
            if (err) {
                res.status(500).send({ message: err }).end();
            } else if (result) {
                res.status(200).send({ message: "New avatar set." }).end();
            } else {
                res.status(401).send({ message: "Incorrect user id." }).end();
            }
        });
    }
};

exports.get_user_avatar = function (req, res) {
    const id = req.params.id;

    User.findById(id, function (err, result) {
        if (err) {
            res.status(500).send({ message: err }).end();
        } else if (result) {
            if (result.avatar) {
                var data = result.avatar.split(',');
                var img = Buffer.from(data[1], 'base64');
                res.writeHead(200, {
                    'Content-Type': data[0].split(';')[0].split(':')[1],
                    'Content-Length': img.length
                });
                res.end(img);
            } else {
                res.sendFile(appRoot + '/www/img/avatar.png');
            }

        } else {
            res.status(401).send({ message: "Incorrect user id." }).end();
        }
    });
};

exports.get_user_personal_info = function (req, res) {
    const id = req.params.id;
    const tokenId = req.authData.user._id;
    if (tokenId !== id) {
        res.status(400).send({ message: "Id and token aren't compatible." }).end();
    } else {
        User.findById(id, function (err, user) {
            if (err) {
                res.status(500).send({ message: err });
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
                res.status(401).send({ message: 'Incorrect user id' }).end();
            }
        });
    }
};

exports.get_user_info = function (req, res) {
    const id = req.params.id;
    User.findById(id, function (err, user) {
        if (err) {
            res.status(500).send({ message: err });
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
            res.status(401).send({ message: 'Incorrect user id' }).end();
        }
    });
};

exports.reset_user_stats = function (req, res) {
    const id = req.params.id;
    const tokenId = req.authData.user._id;
    if (tokenId !== id) {
        res.status(400).send({ message: "Id and token aren't compatible." }).end();
    } else {
        User.findByIdAndUpdate(id, {
            lastReset: new Date(),
            points: 0,
            wins: 0,
            losses: 0,
            playTime: 0
        }, function (err, result) {
            if (err) {
                res.status(500).send({ message: err }).end();
            } else if (result) {
                res.status(200).send({ message: "User stats successfully reset." }).end();
            } else {
                res.status(401).send({ message: "Incorrect user id." }).end();
            }
        });
    }
};

exports.get_leaderboard = function (req, res) {
    const page = req.query.page;
    const pageLenght = req.query.pageLenght;
    if (page && pageLenght && /^[1-9]\d*$/.test(page) && /^[1-9]\d*$/.test(pageLenght)) {
        User.paginate({}, { page: parseInt(page, 10), limit: parseInt(pageLenght, 10), sort: { points: -1 } }, function (err, result) {
            if (err) {
                res.status(500).send({ message: err });
            } else {
                let leaderboard = { result: [] };
                let i = 1;
                result.docs.forEach(function (user) {
                    leaderboard.result.push({ rank: i++, userId: user._id, username: user.username, points: user.points });
                });
                res.json(leaderboard).end();
            }
        });
    } else {
        res.status(401).send({ message: 'Incorrect parameters' }).end();
    }
};