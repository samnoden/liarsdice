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
  const [currentGuess, setCurrentGuess] = useState([]);
  const [players, setPlayers] = useState([]);
  // game dice
  // perhaps current players and current turn (see the order)


  // When 'start game' button is clicked
  // Make sure the button doesn't show up as soon as you lose if game is still going on
  // in case you lose and game still goes on should continue to show you the game

  // add a ready up button and a list of players ready that will become the turn dashboard

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