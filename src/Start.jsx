import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import { Link, Route, Routes } from 'react-router-dom';
import Game from './Game.jsx';

const Start = ({setName}) => {
  const [nam, setNam] = useState('');

  const handleChange = (e) => {
    setNam(e);
  };

  const handleSubmit = () => {
    setName(nam);
  };

  return (
    <div>
      <input onChange={(e)=>handleChange(e.target.value)} type="text"  placeholder="enter name" />
      <Link className='start-button' onClick={()=>handleSubmit()} to='/play'>Start Game</Link>
    </div>
  );
}

export default Start;