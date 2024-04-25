var express = require('express');
var app = express();
var http = require('http')
var socketIO = require('socket.io');
var cors = require('cors');
var server;
var io;

app.use(cors());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server = http.Server(app); // here we tell http we want to use express app to hanlde http requests

// Starting a server by providing a port
server.listen(5000, () => {
    console.log(`Server listening on PORT 5000`)
});

// Giving server to socket.io to listen 
io = socketIO(server);

var sockets = [];
io.on('connection', function (socket) {
    sockets.push(socket);
    socket.on('message', function (toReceived) {
        for (var i = 0; i < sockets.length; i++) {
            sockets[i].send(toReceived);
        }
    });
    socket.on('disconnect', function () {
        for (var i = 0; i < sockets.length; i++) {
            if (sockets[i].id === socket.id) {
                sockets.splice(i, 1);   // To remove the socket added to array sokets at the time of joining of user to don't do the unnecessary sending of message to unjoined user
            }
        }
        console.log('The socket disconnected. There are ' +
            sockets.length + ' connected sockets');
    });
});



/**
 * To start debugging of socket.io in server side
 * 
 * Run the command to start the server with debugging
 * DEBUG=* node server.js
 * 
 * If you want always to run the server with debugging so 
 * export DEBUG=*
 * After wards always when you start the server it aways start with debugging
 * node server.js
 * 
 * If you want to disable the debugging setting from always
 * export DEBUG=null 
 * 
 * Similar to client-side logging, you can set the logging type to something other than the
 * wildcard. This allows you to only get debugging messages on the topic you want to listen to.
 * DEBUG=socket.io:server node server
 *
 */
