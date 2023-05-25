const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 3000;
const path = require("path");

const io = require('socket.io')(http);

var gameDice = [];

app.use(express.static(__dirname + '/../public'));

//player count and list of players
var players = 0;

var playersArray = [];

var currentTurn;

// track if ones wild in current round
var onesWild;

var currentGuess;

var gameOver = false;

var total;

var turnIndex = 0;
// turns based on io.to(socketID).emit(whatever)
// https://socket.io/docs/v4/emit-cheatsheet/

// io.to(socketId).emit(/* ... */);


io.on('connection', (socket) => {
  //log when a user connects
  console.log('user connected', socket.id);
  players++;
  playersArray.push(socket.id);
  console.log(playersArray);
  io.emit('players', players);


  socket.on('begin', ()=>{
    io.emit('start-game');
    currentTurn = playersArray[turnIndex];
  })

  socket.on('dice rolled', (dice) => {
    gameDice = gameDice.concat(dice);
    io.to(currentTurn).emit('turn');
    onesWild = true;
  })

  socket.on('turn over', guess=> {
    // switch to next turn


    // if (currentTurn === playersArray[0]){
    //   currentTurn = playersArray[1];
    // } else {
    //   currentTurn = playersArray[0];
    // }

    if (turnIndex === playersArray.length - 1) {
      turnIndex = 0;
    } else {
      turnIndex++;
    }
    currentTurn = playersArray[turnIndex];
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

    if (turnIndex !== 0) {
      otherPlayer = playersArray[turnIndex - 1];
    } else {
      otherPlayer = playersArray[playersArray.length-1];
    }

    // if (currentTurn === playersArray[0]) {
    //   otherPlayer = playersArray[1];
    // } else {
    //   otherPlayer = playersArray[0];
    // }


    if (total.length >= currentGuess[0]) {
      console.log(socket.id, 'was wrong');
      io.to(currentTurn).emit('lost');
      // currentTurn = socket.id;
      io.to(otherPlayer).emit('won');
    } else {
      io.to(otherPlayer).emit('lost');
      io.to(currentTurn).emit('won');
      currentTurn = otherPlayer;
      turnIndex = playersArray.indexOf(currentTurn);
      console.log(otherPlayer, 'was wrong');
    }

    gameDice = [];
    setTimeout(()=>{
      if (!gameOver) {
        io.emit('new roll');
      }
    }, 3500);


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
    playersArray.splice(playersArray.indexOf(socket.id));
    players--;
    console.log(playersArray);
  });
});



http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});



