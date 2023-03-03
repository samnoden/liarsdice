import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';

var socket = io();

// set up an outer page to set username and choose room to play in

// in this edition (before adding outer room page),
// users will use their socket.id for a username and
// room name will be 'default'

const App = () => {

  // what needs to be kept track of:
  // dice and dice count
  const [dice, setDice] = useState([]);
  const [diceCount, setDiceCount] = useState(0);
  // game dice
  // current guess
  // perhaps current players and current turn (see the order)
  const startGame = () => {
    console.log('Game Started');
    setDiceCount(5);
  }

  return (
    <div className='wholeGame'>
      <h1 className='title'>Liars Dice</h1>
      {diceCount === 0 && <button onClick={()=>startGame()}>Start Game</button>}
    </div>
  );
}



ReactDOM.render(<App />, document.getElementById('root'));