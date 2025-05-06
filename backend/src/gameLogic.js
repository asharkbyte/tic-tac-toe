/**
 * Game Logic Module for Tic Tac Toe
 */

const createBoard = () => {
  return Array(9).fill(null);
};

const applyMove = (board, index, player) => {
  if (index < 0 || index > 8) {
    throw new Error('Invalid move: Cell index out of range');
  }
  
  if (board[index] !== null) {
    throw new Error('Invalid move: Cell already occupied');
  }
  
  const newBoard = [...board];
  newBoard[index] = player;
  
  return newBoard;
};

const checkWin = (board) => {
  const lines = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal top-left to bottom-right
    [2, 4, 6]  // diagonal top-right to bottom-left
  ];
  
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Return the winning player
    }
  }
  
  return null; // No winner
};

const checkDraw = (board) => {
  if (checkWin(board)) {
    return false;
  }
  
  return !board.includes(null);
};

const getAIMove = (board, player, difficulty = 'Hard') => {
  if (!board.includes(null)) {
    return null;
  }
  
  switch (difficulty) {
    case 'Easy':
      return getRandomMove(board);
    case 'Medium':
      return Math.random() < 0.5 ? getOptimalMove(board, player) : getRandomMove(board);
    case 'Hard':
    default:
      return getOptimalMove(board, player);
  }
};

const getRandomMove = (board) => {
  const emptyCells = board
    .map((cell, index) => cell === null ? index : null)
    .filter(index => index !== null);
  
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
};

const getOptimalMove = (board, player) => {
  if (board.every(cell => cell === null)) {
    const firstMoves = [0, 2, 4, 6, 8]; // corners and center
    return firstMoves[Math.floor(Math.random() * firstMoves.length)];
  }
  
  const opponent = player === 'X' ? 'O' : 'X';
  
  const minimax = (board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) => {
    const winner = checkWin(board);
    if (winner === player) return { score: 10 - depth, move: null };
    if (winner === opponent) return { score: depth - 10, move: null };
    if (checkDraw(board)) return { score: 0, move: null };
    
    let bestScore = isMaximizing ? -Infinity : Infinity;
    let bestMove = null;
    
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = isMaximizing ? player : opponent;
        
        const { score } = minimax(newBoard, depth + 1, !isMaximizing, alpha, beta);
        
        if (isMaximizing && score > bestScore) {
          bestScore = score;
          bestMove = i;
          alpha = Math.max(alpha, bestScore);
        } else if (!isMaximizing && score < bestScore) {
          bestScore = score;
          bestMove = i;
          beta = Math.min(beta, bestScore);
        }
        
        if (beta <= alpha) break;
      }
    }
    
    return { score: bestScore, move: bestMove };
  };
  
  const { move } = minimax(board, 0, true);
  return move;
};

module.exports = {
  createBoard,
  applyMove,
  checkWin,
  checkDraw,
  getAIMove
};
