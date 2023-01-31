import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import { Link, Route, Routes } from 'react-router-dom';
import Game from './Game.jsx';
import Start from './Start.jsx';

const App = () => {
  const [username, setUsername] = useState('');

  const name = (e) => {
    setUsername(e);
  }

  return (
    <div className='wholeGame'>
      <h1 className='title'>Liars Dice</h1>
      <Routes>
        <Route path='/' element={<Start setName={name}/>} />
        <Route path='/play' element={<Game name={username}/>} />
      </Routes>
    </div>
  );
}

export default App;