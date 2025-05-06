const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const gameLogic = require('./gameLogic');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const games = new Map();

app.post('/api/game/new', (req, res) => {
  const gameId = uuidv4();
  const { mode = 'human-human', difficulty = 'Medium' } = req.body;
  
  games.set(gameId, {
    id: gameId,
    board: gameLogic.createBoard(),
    currentPlayer: 'X',
    mode,
    difficulty,
    status: 'playing',
    scores: { X: 0, O: 0, ties: 0 },
    demo: {
      isActive: false,
      isPaused: false,
      sequence: [],
      currentMoveIndex: 0
    }
  });
  
  res.status(201).json({ 
    gameId, 
    board: games.get(gameId).board,
    currentPlayer: games.get(gameId).currentPlayer,
    status: games.get(gameId).status,
    scores: games.get(gameId).scores
  });
});

app.get('/api/game/:gameId', (req, res) => {
  const { gameId } = req.params;
  
  if (!games.has(gameId)) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  const game = games.get(gameId);
  
  res.json({
    gameId,
    board: game.board,
    currentPlayer: game.currentPlayer,
    status: game.status,
    scores: game.scores,
    demo: {
      isActive: game.demo.isActive,
      isPaused: game.demo.isPaused
    }
  });
});

app.post('/api/game/:gameId/move', (req, res) => {
  const { gameId } = req.params;
  const { cellIndex, player } = req.body;
  
  if (!games.has(gameId)) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  const game = games.get(gameId);
  
  if (game.status !== 'playing') {
    return res.status(400).json({ error: 'Game is already over' });
  }
  
  if (player !== game.currentPlayer) {
    return res.status(400).json({ error: 'Not your turn' });
  }
  
  try {
    game.board = gameLogic.applyMove(game.board, cellIndex, player);
    
    const winner = gameLogic.checkWin(game.board);
    if (winner) {
      game.status = 'win';
      game.scores[winner]++;
      
      return res.json({
        gameId,
        board: game.board,
        currentPlayer: game.currentPlayer,
        status: game.status,
        winner,
        scores: game.scores
      });
    }
    
    if (gameLogic.checkDraw(game.board)) {
      game.status = 'draw';
      game.scores.ties++;
      
      return res.json({
        gameId,
        board: game.board,
        currentPlayer: game.currentPlayer,
        status: game.status,
        scores: game.scores
      });
    }
    
    game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
    
    if (game.mode === 'human-computer' && game.currentPlayer === 'O') {
      const aiMoveIndex = gameLogic.getAIMove(game.board, 'O', game.difficulty);
      
      game.board = gameLogic.applyMove(game.board, aiMoveIndex, 'O');
      
      const aiWinner = gameLogic.checkWin(game.board);
      if (aiWinner) {
        game.status = 'win';
        game.scores[aiWinner]++;
        
        return res.json({
          gameId,
          board: game.board,
          currentPlayer: game.currentPlayer,
          status: game.status,
          winner: aiWinner,
          scores: game.scores,
          aiMove: aiMoveIndex
        });
      }
      
      if (gameLogic.checkDraw(game.board)) {
        game.status = 'draw';
        game.scores.ties++;
        
        return res.json({
          gameId,
          board: game.board,
          currentPlayer: game.currentPlayer,
          status: game.status,
          scores: game.scores,
          aiMove: aiMoveIndex
        });
      }
      
      game.currentPlayer = 'X';
      
      return res.json({
        gameId,
        board: game.board,
        currentPlayer: game.currentPlayer,
        status: game.status,
        scores: game.scores,
        aiMove: aiMoveIndex
      });
    }
    
    res.json({
      gameId,
      board: game.board,
      currentPlayer: game.currentPlayer,
      status: game.status,
      scores: game.scores
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/game/:gameId/demo/start', (req, res) => {
  const { gameId } = req.params;
  
  if (!games.has(gameId)) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  const game = games.get(gameId);
  
  game.board = gameLogic.createBoard();
  game.currentPlayer = 'X';
  game.status = 'playing';
  
  const sequence = [];
  let demoBoard = [...game.board];
  let demoCurrentPlayer = 'X';
  
  while (true) {
    const moveIndex = gameLogic.getAIMove(demoBoard, demoCurrentPlayer, game.difficulty);
    
    if (moveIndex === null) break;
    
    sequence.push({
      cellIndex: moveIndex,
      player: demoCurrentPlayer
    });
    
    demoBoard = gameLogic.applyMove(demoBoard, moveIndex, demoCurrentPlayer);
    
    if (gameLogic.checkWin(demoBoard) || gameLogic.checkDraw(demoBoard)) {
      break;
    }
    
    demoCurrentPlayer = demoCurrentPlayer === 'X' ? 'O' : 'X';
  }
  
  game.demo = {
    isActive: true,
    isPaused: false,
    sequence,
    currentMoveIndex: 0
  };
  
  res.json({
    gameId,
    board: game.board,
    currentPlayer: game.currentPlayer,
    status: game.status,
    demo: {
      isActive: true,
      isPaused: false,
      sequence
    }
  });
});

app.post('/api/game/:gameId/demo/pause', (req, res) => {
  const { gameId } = req.params;
  
  if (!games.has(gameId)) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  const game = games.get(gameId);
  
  if (!game.demo.isActive) {
    return res.status(400).json({ error: 'Demo is not active' });
  }
  
  game.demo.isPaused = !game.demo.isPaused;
  
  res.json({
    gameId,
    demo: {
      isActive: game.demo.isActive,
      isPaused: game.demo.isPaused
    }
  });
});

app.post('/api/game/:gameId/demo/reset', (req, res) => {
  const { gameId } = req.params;
  
  if (!games.has(gameId)) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  const game = games.get(gameId);
  
  game.board = gameLogic.createBoard();
  game.currentPlayer = 'X';
  game.status = 'playing';
  
  game.demo.currentMoveIndex = 0;
  game.demo.isPaused = false;
  
  res.json({
    gameId,
    board: game.board,
    currentPlayer: game.currentPlayer,
    status: game.status,
    demo: {
      isActive: game.demo.isActive,
      isPaused: game.demo.isPaused
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Export for testing
