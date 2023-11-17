const [isX, setIsX] = useState(true);
const [newGame, setNewGame] = useState(false);
const [squares, setSqaures] = useState(Array(9).fill(null));

let winner = calculateWinner(squares);

// Now we will create the calculateWinner() function.

// Calculate the winner
  function calculateWinner(squares) {
    // Total 8 winning patterens
    const winningPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < winningPatterns.length; i++) {
      const [a, b, c] = winningPatterns[i];

      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }