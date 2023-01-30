const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 3000;
const path = require("path");
const router = express.Router();

// initialize new instance of socket.io by passing the HTTP server object
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/../public'));

let players = [];

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);

  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});



