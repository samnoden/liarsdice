import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';

var socket = io();

// set up an outer page to set username and choose room to play in

// in this edition (before adding outer room page),
// users will use their socket.id for a username and
// room name will be 'default'

const App = () => {
  return (
    <div className='wholeGame'>
      <h1 className='title'>Liars Dice</h1>
    </div>
  );
}



ReactDOM.render(<App />, document.getElementById('root'));