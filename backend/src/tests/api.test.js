const request = require('supertest');
const app = require('../index');

describe('Game API', () => {
  let gameId;

  test('POST /api/game/new should create a new game', async () => {
    const res = await request(app)
      .post('/api/game/new')
      .send({ mode: 'human-human' });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('gameId');
    expect(res.body).toHaveProperty('board');
    expect(res.body.board).toHaveLength(9);
    expect(res.body.board.every(cell => cell === null)).toBe(true);
    
    gameId = res.body.gameId;
  });

  test('GET /api/game/:gameId should return game state', async () => {
    // First create a game
    const createRes = await request(app)
      .post('/api/game/new')
      .send({ mode: 'human-human' });
    
    const gameId = createRes.body.gameId;
    
    // Then get the game state
    const res = await request(app)
      .get(`/api/game/${gameId}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('gameId', gameId);
    expect(res.body).toHaveProperty('board');
    expect(res.body).toHaveProperty('currentPlayer', 'X');
    expect(res.body).toHaveProperty('status', 'playing');
  });

  test('POST /api/game/:gameId/move should apply a valid move', async () => {
    // First create a game
    const createRes = await request(app)
      .post('/api/game/new')
      .send({ mode: 'human-human' });
    
    const gameId = createRes.body.gameId;
    
    // Then make a move
    const res = await request(app)
      .post(`/api/game/${gameId}/move`)
      .send({ cellIndex: 4, player: 'X' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('board');
    expect(res.body.board[4]).toBe('X');
    expect(res.body).toHaveProperty('currentPlayer', 'O');
  });

  test('POST /api/game/:gameId/move should reject invalid moves', async () => {
    // First create a game
    const createRes = await request(app)
      .post('/api/game/new')
      .send({ mode: 'human-human' });
    
    const gameId = createRes.body.gameId;
    
    // Make a valid move
    await request(app)
      .post(`/api/game/${gameId}/move`)
      .send({ cellIndex: 4, player: 'X' });
    
    // Try to make a move on an occupied cell
    const res = await request(app)
      .post(`/api/game/${gameId}/move`)
      .send({ cellIndex: 4, player: 'O' });
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/game/:gameId/demo/start should start a demo', async () => {
    // First create a game
    const createRes = await request(app)
      .post('/api/game/new')
      .send({ mode: 'computer-computer' });
    
    const gameId = createRes.body.gameId;
    
    // Start demo
    const res = await request(app)
      .post(`/api/game/${gameId}/demo/start`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('demo');
    expect(res.body.demo).toHaveProperty('isActive', true);
    expect(res.body.demo).toHaveProperty('isPaused', false);
    expect(res.body.demo).toHaveProperty('sequence');
    expect(Array.isArray(res.body.demo.sequence)).toBe(true);
  });
});
