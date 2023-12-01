// const socketIo = require('socket.io')
// const express = require('express')
// const http = require('http')

// const app = express()
// const server = http.createServer(app)
// const io = socketIo(server)

// let players = []
// let currentPlayer = 0

// io.on('connection', (socket) => {
//     console.log("User connected")
//     players.push(socket)

//     if (players.length % 2 == 0)
//         io.emit('gameStart', currentPlayer)

//     socket.on('makeMove')
// })

const express = require('express');
 const { createServer } = require('http');
const { Server: socketIo } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new socketIo(server);

let players = [];
let currentPlayer = 0;
let gameBoard = Array(9).fill('');

io.on('connection', (socket) => {
  console.log('A user connected');

  players.push(socket);

  if (players.length === 2) {
    // Start the game when two players are connected
    io.emit('gameStart', currentPlayer);
  }

  socket.on('makeMove', (index) => {
    if (currentPlayer === players.indexOf(socket) && gameBoard[index] === '') {
      gameBoard[index] = currentPlayer === 0 ? 'X' : 'O';
      io.emit('updateBoard', { gameBoard, currentPlayer });
      checkWinner();
      currentPlayer = 1 - currentPlayer; // Switch players
    }
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
