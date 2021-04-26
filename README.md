## Perudo web (ASW project a.a. 18-19)
**Perudo web** is a progressive web app developed in Node.js (server side) and Vue.js (client side).

Perudo is a dice game. The object of perudo is to be the last player with a die or more.

### Demo
A working demo can be found at: https://perudo.brb.dynu.net

### Prerequisites
The prerequisite are:
 * [Node.js](https://nodejs.org/en/)
 * [mongoDB](https://www.mongodb.com)
 
 A mongoDB server must be accessible through localhost:27017

### Installation
1. Clone the repository. ```git clone https://gitlab.com/bitbmp/progetto-asw.git```

1. Move into project directory.  ```cd progetto-asw/```

1. Install npm dependencies. ```npm install```
1. Launch the server.  ```node index.js```
                       
By default the application starts an http server on port 3000 but these settings can be changed by specifying different launch options.

### Launch options
The launch options can be defined in this way: ```node index.js <options>```

```-p <port>```: open the web server on the specified port.

```-s```: use https protocol.

```-t```: use https + http2 protocol with fallback to https.

```-c```: specify the server certificate path. Used only with -s or -t.

```-k```: specify the certificate private key path. Used only with -s or -t.

```-g```: enable network compression to improve performance.

If -s or -t are defined but -c or -k are not, the server will try to load, by default, a cert.crt and a key.key file from the project directory.

### Docker
An docker image of the application can be built through the Dockerfile or can be pulled from [this](https://hub.docker.com/r/lorenzomondani/perudoweb) docker hub repo.

The docker image contains already a MongoDB server instance so an external MongoDB server is not needed anymore. 

The container exposes port 3000 to access the web application and port 27017 to access the MongoDB server.

The folder "/data/db" is also exposed to optionally bind MongoDB data externally.

Currently the docker container only supports http; no other options can be defined.

### Authors
Barbieri Edoardo, Lorenzo Mondani, Emanuele Pancisi
 
Developed as final project for [69867 - Web Services and Applications](https://www.unibo.it/en/teaching/course-unit-catalogue/course-unit/2019/412604) course (academic year 2018/2019).
