import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import { Route, Routes } from 'react-router-dom';

var socket = io();


const Game = ({name}) => {

  socket.on('hello', ()=>{
    console.log('recieved')
  });

  return (
    <div className='wholeGame'>
      <h1 className='title'>Game</h1>
      <h1>{name}</h1>
    </div>
  );
}

export default Game;