import React, { useState, useEffect } from 'react';
import Square from './Square';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Replace with your server URL

function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    socket.on('gameStart', (initialPlayer) => {
      setXIsNext(initialPlayer === 0);
      setGameOver(false);
    });

    socket.on('updateBoard', ({ gameBoard, currentPlayer }) => {
      setSquares(gameBoard);
      setXIsNext(currentPlayer === 0);
      setGameOver(false);
    });

    socket.on('gameOver', () => {
      setGameOver(true);
    });

    return () => {
      socket.off('gameStart');
      socket.off('updateBoard');
      socket.off('gameOver');
    };
  }, []);

  function handleClick(i) {
    if (gameOver || squares[i]) {
      return;
    }

    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';

    socket.emit('makeMove', { index: i });
  }

  function resetGame() {
    socket.emit('resetGame');
  }

  return (
    <>
      <div className="status">{gameOver ? 'Game Over' : `Next player: ${xIsNext ? 'X' : 'O'}`}</div>
      <div className="board">
        {[0, 1, 2].map((row) => (
          <div key={row} className="board-row">
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col;
              return <Square key={index} value={squares[index]} onClick={() => handleClick(index)} />;
            })}
          </div>
        ))}
      </div>
      <button onClick={resetGame}>Play Again</button>
    </>
  );
}

export default Board;
