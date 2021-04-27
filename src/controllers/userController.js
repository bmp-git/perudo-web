const mongoose = require('mongoose');
const User = mongoose.model('User');

var rankController = require('./rankController');

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
        let isValidFormat;
        try {
          const base64Data = avatar.split(',')[0].split(';')[0].split(':')[1];
          const base64Type = base64Data.split('/')[0];
          const base64Format = base64Data.split('/')[1];
          isValidFormat = base64Type === "image" && ["png", "jpg", "jpeg", "gif"].includes(base64Format);
        } catch {
          isValidFormat = false;
        }
        if (isValidFormat) {
            User.findByIdAndUpdate(id, { avatar: avatar }, function (err, result) {
                if (err) {
                    res.status(500).send({ message: err }).end();
                } else if (result) {
                    res.status(200).send({ message: "New avatar set." }).end();
                } else {
                    res.status(401).send({ message: "Incorrect user id." }).end();
                }
            });
        } else {
            res.status(400).send({ message: "Please upload only png or jpg or jpeg or gif." }).end();
        }
    }
};

var path = require('path');
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
                    'Content-Type': "image/" + data[0].split(';')[0].split(':')[1].split('/')[1],
                    'Content-Length': img.length
                });
                res.end(img);
            } else {
                res.sendFile(path.join(__dirname, '../../public/img', 'avatar.png'));
            }

        } else {
            res.status(401).send({ message: "Incorrect user id." }).end();
        }
    });
};

exports.get_user_name = function (req, res) {
    const id = req.params.id;

    User.findById(id, function (err, result) {
        if (err) {
            res.status(500).send({ message: err }).end();
        } else if (result) {
            res.status(200).send({ username: result.username }).end();
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

exports.get_user_rank = function (req, res) {
    const id = req.params.id;

    User.findById(id, function (err, result) {
        if (err) {
            res.status(500).send({ message: err }).end();
        } else if (result) {
            res.status(200).send({ username: result.username }).end();
        } else {
            res.status(401).send({ message: "Incorrect user id." }).end();
        }
    });
};

let cannot_reset = new Set();
const too_may_requests_timeout_ms = 30000;
exports.reset_user_stats = function (req, res) {
    const id = req.params.id;
    const tokenId = req.authData.user._id;
    if (tokenId !== id) {
        res.status(400).send({ message: "Id and token aren't compatible." }).end();
    } else if (cannot_reset.has(id)) {
        res.status(429).send({ message: "Too many reset requests! Wait some time." }).end();
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
                cannot_reset.add(id);
                setTimeout(() => cannot_reset.delete(id), too_may_requests_timeout_ms);
                rankController.updateRankHistory().then(() => {
                    console.log("Players history updated.")
                }, err => {
                    console.log("Cannot update players history: " + err)
                });
                res.status(200).send({ message: "User stats successfully reset." }).end();
            } else {
                res.status(401).send({ message: "Incorrect user id." }).end();
            }
        });
    }
};

exports.get_user_rank = function (req, res) {
    const id = req.params.id;
    User.find({}).sort({ points: -1 }).exec(function (err, result) {
        if (err) {
            res.status(500).send({ message: err }).end();
        } else if (result) {
            rank = result.findIndex(u => u._id == id) + 1;
            if (rank != 0) {
                res.status(200).send({ rank: rank }).end();
            } else {
                res.status(401).send({ message: "Incorrect user id." }).end();
            }
        } else {
            res.status(401).send({ message: "Incorrect user id." }).end();
        }
    });
};

exports.get_leaderboard = function (req, res) {
    const page = req.query.page;
    const pageLenght = req.query.pageLenght;
    if (page && pageLenght && /^[1-9]\d*$/.test(page) && /^[1-9]\d*$/.test(pageLenght)) {
        let skip = (page - 1) * pageLenght;
        User.countDocuments({}, function (err, count) {
            if (err) {
                res.status(500).send({ message: err });
            } else {
                User.find().sort({ points: -1 }).skip(skip).limit(parseInt(pageLenght, 10)).exec(function (err, result) {
                    if (err) {
                        res.status(500).send({ message: err });
                    } else {
                        let leaderboard = { total: count, result: [] };
                        let i = skip + 1;
                        result.forEach(function (user) {
                            leaderboard.result.push({ rank: i++, id: user._id, username: user.username, points: user.points });
                        });
                        res.json(leaderboard).end();
                    }
                });
            }
        });
    } else {
        res.status(401).send({ message: 'Incorrect parameters' }).end();
    }
};

exports.get_date = function (req, res) {
    res.status(200).send({ date: new Date() }).end();
};
