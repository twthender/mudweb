const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const serverSocket = require('./socket');

app.use(express.static('public'));

let clients = {};

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/public/client.html');
});

io.on('connection', function(socket) {
   console.log('connection');

   socket.socketToServer = serverSocket.createSocket(socket);

   socket.onMessageReceivedFromServer = function(message) {
      console.log(`Forwarding message '${message}' to client`);
      socket.emit('message', message);
   };

   socket.on('send', function(message) {
      console.log(`Sending '${message}' to server`);
      let ret = socket.socketToServer.write(message + "\n");
   });
});



http.listen(3000);