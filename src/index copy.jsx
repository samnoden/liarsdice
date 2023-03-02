import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';

// notes for next time:
// set up rooms, add play again button, properly reset variables,


// set up room specific socket on's ,
// create a function that resets all states
// clear up all these states


var socket = io();

const App = () => {

  const [diceCount, setDiceCount] = useState(5);
  const [dice, setDice] = useState([]);
  const [rolled, setRolled] = useState(false);
  const [numPlayers, setNumPlayers] = useState(1);
  const [started, setStarted] = useState(false);
  const [myTurn, setMyTurn] = useState(false);
  const [guess, setGuess] = useState('');
  const [currentGuess, setCurrentGuess] = useState([0, 0]);
  const [reveal, setReveal] = useState(false);
  const [revealedDice, setRevealedDice] = useState([]);
  const [result, setResult] = useState('');



  socket.on('players', num=> {
    setNumPlayers(num);
  })

  socket.off('start-game').on('start-game', () => {
      let currentDice = [];
      for (let i = 0; i < diceCount; i++) {
        currentDice.push(Math.floor(Math.random() * 6)+1);
      }
      setDice(currentDice);
      setRolled(true);
      socket.emit('dice rolled', currentDice);
      setStarted(true);
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // send in guess info, for now log it

    let num = guess.split(' ');
    num[0] = Number(num[0]);
    num[1] = Number(num[1]);
    console.log('guess:', num);
    if (num.length !== 2 || (!Number.isInteger(num[0]) || !Number.isInteger(num[1]))) {
      alert("Not a valid guess! Please enter in form 'quantity face'");
    } else if (num[0] === 0) {
      alert("Cannot call 0 of a number");
    } else if (num[1] === 0 || num[1] > 6) {
      alert("Face value must be between 1 and 6");
    } else if (num[0] < currentGuess[0] || (num[1] <= currentGuess[1] && num[0] === currentGuess[0])) {
      alert('Not a valid guess, must up quantity or maintain quantity and up face value');
      // handle for current guess noot being valid
    }
    else {
      console.log('valid guess');
      // emit guess
      socket.emit('turn over', num);
      setMyTurn(false);
    }
  }

  socket.off('new roll').on('new roll', ()=>{
    if (diceCount === 0) {
      socket.emit('game over');
    } else {
      setReveal(false);
      setCurrentGuess([0, 0]);
      let currentDice = [];
      for (let i = 0; i < diceCount; i++) {
        currentDice.push(Math.floor(Math.random() * 6)+1);
      }
      setDice(currentDice);
      setRolled(true);
      socket.emit('dice rolled', currentDice);
      setStarted(true);
    }
  })


  socket.on('turn', ()=>{
    setMyTurn(true);
  })

  socket.on('current guess', num=>{
    setCurrentGuess(num);
  });

  // socket.on('capped', dice=>{
  //   setDice(dice);
  // })

  const callCap = () => {
    // cap event

    socket.emit('call cap')
  }



  socket.off('capped').on('capped', (dice)=>{
    console.log('called cap');
    setMyTurn(false);
    setReveal(true);
    setRevealedDice(dice);
  });

  socket.off('won').on('won', ()=>{
    setResult('You were right!');
    console.log('you were right!')
  });

  socket.off('lost').on('lost', ()=>{

    console.log('you lost')
    if (diceCount > 1) {
      setResult('You were wrong! You lost a die.');
    } else {
      socket.emit('game over');
    }
    setDiceCount(diceCount - 1);
  });


  socket.on('game over', ()=> {
    if (diceCount === 0) {
      setResult("YOU LOST");
      setStarted(false);
    }
  })

  const handleChange = (val) => {
    setGuess(val);
  }


  return (
    <div className='wholeGame'>
      <h1 className='title'>Liars Dice</h1>
      {/* <h4>Follow us on instagram @liarsdicememes</h4> */}
      {(!started && numPlayers > 1) && <p>There are {numPlayers} players in this game</p>}
      {(!started && numPlayers === 1) && <p>Waiting for more players to join</p>}
      {!rolled && <button onClick={()=>socket.emit('begin')}>Start Game</button>}
      {rolled && <h6>my dice:</h6>}
      <div className='myDice'>
        {rolled && dice.map((number) =>
          <img className='dice' src={`${number}.png`}/>
        )}
      </div>
      {(rolled && !reveal)&& <h2>Current Guess:</h2>}
      {reveal && <h2>Cap Called:</h2>}
      {rolled && <h2>{currentGuess[0]} {currentGuess[1]}</h2>}
      {reveal && <h2>Field: </h2>}
      {reveal && revealedDice.map((number) =>
          <img className='dice' src={`${number}.png`}/>
        )}
      {reveal && <h2>Total {currentGuess[1]}s: {revealedDice.length}</h2>}
      {myTurn && <p>Your Turn, enter guess in form 10 5, 13 6, 7 4, etc.</p>}
      {myTurn && <input onChange={(e)=>handleChange(e.target.value)} type="text"  placeholder="enter guess" />}
      {myTurn && <button onClick={(e)=>handleSubmit(e)}>guess</button>}
      {myTurn && <button onClick={()=>callCap()}>CAP</button>}
      {reveal && <h1>{result}</h1>}
    </div>
  );

  //{!started && <button onClick={startGame}>Start Game</button>}

}



ReactDOM.render(<App />, document.getElementById('root'));