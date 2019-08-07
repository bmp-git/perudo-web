const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('./src/models/moviesModel');
require('./src/models/user');
const bodyParser = require('body-parser');



mongoose.connect('mongodb://localhost/perudo', { useNewUrlParser: true, useFindAndModify: false });


//Per gestire i parametri passati nel corpo della richiesta http.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/public'));

var http = require('http').Server(app);
var io = require('socket.io')(http);

exports.get_io = function () {
  return io;
};

const path = require('path');
global.appRoot = path.resolve(__dirname);

const routes = require('./src/routes/routes');
routes(app); 

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

http.listen(3000, function () {
  console.log('Node API server started on port 3000!');
});

global.appRoot = path.resolve(__dirname);
