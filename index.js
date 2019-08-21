const default_port = 3000;
const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    p: 'port',
    s: 'https',
    t: 'http2',
    c: 'cert',
    k: 'key',
    g: 'compression'
  },
  default: {
    port: default_port,
    https: false,
    http2: false,
    compression: false,
    cert: './cert.crt',
    key: './key.key'
  },
  boolean: 'https',
  string: ['cert', 'key']
});

//check if port is a valid number
if (isNaN(argv.port) || argv.port < 0 || argv.port > 65535 ) {
  argv.port = default_port;
  argv.p = default_port;
}


const express = require('express');
const app = express();
if (argv.compression) {
  console.log("Using compression.");
  const compression = require('compression');
  app.use(compression());
}
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
require('./src/models/user');
require('./src/models/rankHistory');
const bodyParser = require('body-parser');

const crypto = require('crypto');
const genRandomString = function (length) {
  return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length)
};

const fs = require('fs');

let jwt_secret = null;
const jwt_secret_path = './jwt_secret';
if (fs.existsSync(jwt_secret_path)) {
  jwt_secret = fs.readFileSync(jwt_secret_path, "utf8");
}

if (!jwt_secret) {
  jwt_secret = genRandomString(16);
  fs.writeFileSync(jwt_secret_path, jwt_secret);
}
exports.jwt_secret = jwt_secret;

mongoose.connect('mongodb://localhost/perudo', { useNewUrlParser: true, useFindAndModify: false });


//Per gestire i parametri passati nel corpo della richiesta http.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/public'));


let server = null;

if (argv.https) {
  const options = {
    key: fs.readFileSync(argv.key),
    cert: fs.readFileSync(argv.cert)
  };
  server = require('https').createServer(options, app);
} else if (argv.http2) {
  const options = {
    key: fs.readFileSync(argv.key),
    cert: fs.readFileSync(argv.cert)
  };
  server = require('spdy').createServer(options, app);
} else {
  server = require('http').Server(app);
}


var io = require('socket.io')(server);

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

server.listen(argv.port, function () {
  console.log('Node API server started on port ' + argv.port + '!');
});

global.appRoot = path.resolve(__dirname);
