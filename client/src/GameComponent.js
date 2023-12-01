import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const GameComponent = () => {
  const [gameBoard, setGameBoard] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState(0);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('gameStart', (initialPlayer) => {
      setCurrentPlayer(initialPlayer);
    });

    socket.on('updateBoard', ({ gameBoard, currentPlayer }) => {
      setGameBoard(gameBoard);
      setCurrentPlayer(currentPlayer);
    });

    socket.on('gameOver', ({ winner }) => {
      if (winner === -1) {
        console.log('Game Over: It\'s a tie!');
      } else {
        console.log(`Game Over: Player ${winner + 1} wins!`);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMakeMove = (index) => {
    socket.emit('makeMove', index);
  };

  return (
    <div>
      <div>Current Player: {currentPlayer + 1}</div>
      <div className="game-board">
        {gameBoard.map((cell, index) => (
          <div
            key={index}
            className="cell"
            onClick={() => handleMakeMove(index)}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameComponent;
