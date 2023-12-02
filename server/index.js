const express = require("express")
const debug= require("debug")("http")
const http = require('http')
const app = express();

const server = require('http').createServer()
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

let players = [];
let currentPlayer = 0;
let gameBoard = Array(9).fill('');
io.on('connection', (socket) => {
  console.log('A user connected');
  players.push(socket);

  if (players.length === 2) {
    // Start the game when two players are connected
    io.emit('gameStart', currentPlayer);
    currentPlayer = 'X'
  }

  socket.on('makeMove', (index) => {
    if (currentPlayer === players.indexOf(socket) && gameBoard[index] === '') {
      gameBoard[index] = currentPlayer === 0 ? 'X' : 'O';
      io.emit('updateBoard', { gameBoard, currentPlayer });
      checkWinner();
      currentPlayer = 1 - currentPlayer; // Switch players
    }
    console.log(`Player ${currentPlayer}`)
  });

  socket.on('resetGame', () => {
    gameBoard = Array(9).fill('');
    io.emit('updateBoard', { gameBoard, currentPlayer: 0 });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    players = players.filter((player) => player !== socket);
  });
});

function checkWinner() {
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      io.emit('gameOver', { winner: currentPlayer });
      return;
    }
  }

  if (!gameBoard.includes('')) {
    io.emit('gameOver', { winner: -1 }); // -1 for tie
  }
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
