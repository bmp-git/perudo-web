var express = require('express');
var app = express();
var mongoose = require('mongoose')
var Movie = require('./src/models/moviesModel')
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/dbmovies', { useNewUrlParser: true, useFindAndModify: false });


//Per gestire i parametri passati nel corpo della richiesta http.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/public'));


var path = require('path');
global.appRoot = path.resolve(__dirname);

var routes = require('./src/routes/moviesRoutes');
routes(app); 

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(3000, function () {
  console.log('Node API server started on port 3000!');
});