import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';

var socket = io();

const App = () => {
  return (
    <div className='wholeGame'>
      <h1 className='title'>Liars Dice</h1>
    </div>
  );
}



ReactDOM.render(<App />, document.getElementById('root'));