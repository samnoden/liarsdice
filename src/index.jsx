import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// var socket = io();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

// const App = () => {

//   return (
//     <div className='wholeGame'>
//       <h1 className='title'>Liars Dice</h1>
//       <button href='/game'>Play Game</button>
//     </div>
//   );


// }



// ReactDOM.render(<App />, document.getElementById('root'));