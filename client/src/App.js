// App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import "./App.css"

const socket = io('http://localhost:4000');

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState('X');
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    socket.on('board', (data) => {
      if (data.board) {
        setBoard(data.board);
        setPlayer(data.player);
        setMessage(data.message);
      }
    });
  }, []);

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setGameOver(false);

    socket.emit('move', {
      board: Array(9).fill(null),
      player: 'X',
      message: 'It is X\'s turn.',
    });
  };

  const checkWinner = (board) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const checkDraw = (board) => {
    return board.every((cell) => cell !== null);
  };

  const handleCellClick = (index) => {
    if (!board || board[index]) {
      console.log("Invalid move")
      return;
    }

    const newBoard = [...board];
    newBoard[index] = player;

    const winner = checkWinner(newBoard);
    const draw = checkDraw(newBoard);

    if (winner || draw) {
      setGameOver(true);
    }

    if (winner) {
      setMessage(`Player ${winner} wins!`);
      socket.emit('move', {
        board: newBoard,
        player: player === 'X' ? 'O' : 'X',
        message: `Player ${winner} wins!`,
      });
    }
    else {
      socket.emit('move', {
        board: newBoard,
        player: player === 'X' ? 'O' : 'X',
        message: `It is ${player === 'X' ? 'O' : 'X'}'s turn.`,
      });
    }

    
  };

  return (
    <div>
      <div>{message}</div>
      <div className="board">
        {board && board.map((cell, index) => (
          <div
            key={index}
            className="cell"
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      {gameOver && (
        <button onClick={resetBoard}>Reset Board</button>
      )}
    </div>
  );
};

export default App;