// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

let players = 0;
let currentPlayer = 1;

io.on('connection', (socket) => {
  players++;
  console.log(`User ${socket.id} has connected. There are ${players} players`)

  if (players % 2 !== 0) {
    socket.emit('board', {
      // First player is always X
      player: players === 1 ? 'X' : 'O',
      message: 'Waiting for another player to join.',
    });
  }

  else {
    socket.emit('board', {
      board: Array(9).fill(null),
      message: 'Game start. X Starts first'
    })
    socket.on('move', (data) => {
      if (currentPlayer === 1 && data.player === 'X' || currentPlayer === 2 && data.player === 'O') {
        io.emit('board', data);
        currentPlayer = currentPlayer === 1 ? 2 : 1;
      }
      console.log(`Current player: ${currentPlayer}`)
      console.log(data)
    });
  }



  socket.on('disconnect', () => {
    players--;
    console.log(`User ${socket.id} has disconnected.\nThere are only ${players} players`)
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
