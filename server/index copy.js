const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 3000;
const path = require("path");

// initialize new instance of socket.io by passing the HTTP server object
const io = require('socket.io')(http);

var gameDice = [];

app.use(express.static(__dirname + '/../public'));

var players = 0;

var playersArray = [];

var currentTurn;

var onesWild;

var currentGuess;

var gameOver = false;

var total;
// turns based on io.to(socketID).emit(whatever)
// https://socket.io/docs/v4/emit-cheatsheet/

// io.to(socketId).emit(/* ... */);


io.on('connection', (socket) => {
  //log when a user connects
  console.log('user connected');
  players++;
  playersArray.push(socket.id);
  console.log(playersArray);
  io.emit('players', players);


  socket.on('begin', ()=>{
    io.emit('start-game');
    currentTurn = playersArray[0];
  })

  socket.on('dice rolled', (dice) => {
    gameDice = gameDice.concat(dice);
    io.to(currentTurn).emit('turn');
    onesWild = true;
  })

  socket.on('turn over', guess=> {
    // switch to next turn
    if (currentTurn === playersArray[0]){
      currentTurn = playersArray[1];
    } else {
      currentTurn = playersArray[0];
    }
    // if raise
    io.to(currentTurn).emit('turn');
    io.emit('current guess', guess);
    currentGuess = guess;
    if (guess[1] === 1) {
      onesWild = false;
    }
  })

  socket.on('call cap', ()=>{

    console.log('in server, cap called', gameDice);
    console.log(socket.id, 'called cap');
    //gameDice = [];
    if (onesWild) {
      total = gameDice.filter(x => (x === currentGuess[1] || x === 1));
    } else {
      total = gameDice.filter(x => (x === currentGuess[1]));
    }

    io.emit('capped', total);

    let otherPlayer;
    if (currentTurn === playersArray[0]) {
      otherPlayer = playersArray[1];
    } else {
      otherPlayer = playersArray[0];
    }
    if (total.length >= currentGuess[0]) {
      console.log(socket.id, 'was wrong');
      io.to(currentTurn).emit('lost');
      // currentTurn = socket.id;
      io.to(otherPlayer).emit('won');
    } else {
      io.to(otherPlayer).emit('lost');
      io.to(currentTurn).emit('won');
      currentTurn = otherPlayer;
      console.log(otherPlayer, 'was wrong');
    }

    gameDice = [];
    setTimeout(()=>{
      if (!gameOver) {
        io.emit('new roll');
      }
    }, 4000);


    // send a specific emit to either winner and loser that makes their dice count go down
    // send turn to person who lost dice after calling start game
  })

  socket.on('game over', () => {
    gameOver = true;
    if (currentTurn === playersArray[0]) {
      otherPlayer = playersArray[1];
    } else {
      otherPlayer = playersArray[0];
    }
    io.emit('game over');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    // playersArray.splice(playersArray.indexOf(socket.id));
    players--;
  });
});



http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});



