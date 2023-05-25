const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 3000;
const path = require("path");

const io = require('socket.io')(http);

app.use(express.static(__dirname + '/../public'));

io.on('connection', (socket) => {

  console.log('user connected', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});



http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});



