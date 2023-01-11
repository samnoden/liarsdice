const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 3000;
const path = require("path");

// initialize new instance of socket.io by passing the HTTP server object
const io = require('socket.io')(http);


app.use(express.static(__dirname + '/../public'))


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});



