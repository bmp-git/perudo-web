var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.change_user_username = function(req, res) {
    var username = req.body.username;
    var id = req.params.id;
    var tokenId = req.authData.user._id;
    if(tokenId != id) {
        res.status(400).send({message: "Id and token aren't compatible."}).end();
    } else if(!username || username.length < 3 || username.length > 15) {
        res.status(400).send({message: "The username must consist of 3 to 15 characters."}).end();
    } else {
        User.findByIdAndUpdate(id, {username : username}, function(err, result){
            if(err) {
              res.status(500).send({message: err}).end();
            } else if(result) {
              res.status(200).send({message: "New username set."}).end();
            } else {
              res.status(401).send({message: "Incorrect user id."}).end();
            }
        });
    }
}

exports.change_user_avatar = function(req, res) {

}