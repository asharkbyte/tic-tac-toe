const gameLogic = require('./gameLogic');

describe('Game Logic Module', () => {
  describe('createBoard', () => {
    it('should create an empty 9-element array', () => {
      const board = gameLogic.createBoard();
      expect(board).toHaveLength(9);
      expect(board.every(cell => cell === null)).toBe(true);
    });
  });

  describe('applyMove', () => {
    it('should apply a valid move', () => {
      const board = gameLogic.createBoard();
      const newBoard = gameLogic.applyMove(board, 4, 'X');
      
      expect(newBoard[4]).toBe('X');
      expect(newBoard).not.toBe(board); // Should return a new array
    });

    it('should reject moves on occupied cells', () => {
      const board = gameLogic.createBoard();
      const boardWithMove = gameLogic.applyMove(board, 4, 'X');
      
      expect(() => {
        gameLogic.applyMove(boardWithMove, 4, 'O');
      }).toThrow('Invalid move: Cell already occupied');
    });

    it('should reject out-of-range moves', () => {
      const board = gameLogic.createBoard();
      
      expect(() => {
        gameLogic.applyMove(board, -1, 'X');
      }).toThrow('Invalid move: Cell index out of range');
      
      expect(() => {
        gameLogic.applyMove(board, 9, 'X');
      }).toThrow('Invalid move: Cell index out of range');
    });
  });

  describe('checkWin', () => {
    it('should identify horizontal wins', () => {
      let board = gameLogic.createBoard();
      board[0] = 'X'; board[1] = 'X'; board[2] = 'X';
      expect(gameLogic.checkWin(board)).toBe('X');
      
      board = gameLogic.createBoard();
      board[3] = 'O'; board[4] = 'O'; board[5] = 'O';
      expect(gameLogic.checkWin(board)).toBe('O');
      
      board = gameLogic.createBoard();
      board[6] = 'X'; board[7] = 'X'; board[8] = 'X';
      expect(gameLogic.checkWin(board)).toBe('X');
    });

    it('should identify vertical wins', () => {
      let board = gameLogic.createBoard();
      board[0] = 'O'; board[3] = 'O'; board[6] = 'O';
      expect(gameLogic.checkWin(board)).toBe('O');
      
      board = gameLogic.createBoard();
      board[1] = 'X'; board[4] = 'X'; board[7] = 'X';
      expect(gameLogic.checkWin(board)).toBe('X');
      
      board = gameLogic.createBoard();
      board[2] = 'O'; board[5] = 'O'; board[8] = 'O';
      expect(gameLogic.checkWin(board)).toBe('O');
    });

    it('should identify diagonal wins', () => {
      let board = gameLogic.createBoard();
      board[0] = 'X'; board[4] = 'X'; board[8] = 'X';
      expect(gameLogic.checkWin(board)).toBe('X');
      
      board = gameLogic.createBoard();
      board[2] = 'O'; board[4] = 'O'; board[6] = 'O';
      expect(gameLogic.checkWin(board)).toBe('O');
    });

    it('should return null when there is no winner', () => {
      const board = gameLogic.createBoard();
      board[0] = 'X'; board[1] = 'O'; board[2] = 'X';
      board[3] = 'X'; board[4] = 'O'; board[5] = 'O';
      board[6] = 'O'; board[7] = 'X'; board[8] = null;
      
      expect(gameLogic.checkWin(board)).toBeNull();
    });
  });

  describe('checkDraw', () => {
    it('should return true when board is full with no winner', () => {
      const board = gameLogic.createBoard();
      board[0] = 'X'; board[1] = 'O'; board[2] = 'X';
      board[3] = 'X'; board[4] = 'O'; board[5] = 'O';
      board[6] = 'O'; board[7] = 'X'; board[8] = 'X';
      
      expect(gameLogic.checkWin(board)).toBeNull();
      
      expect(gameLogic.checkDraw(board)).toBe(true);
    });

    it('should return false when there is a winner', () => {
      const board = gameLogic.createBoard();
      board[0] = 'X'; board[1] = 'X'; board[2] = 'X'; // X wins
      board[3] = 'O'; board[4] = 'O'; board[5] = null;
      board[6] = null; board[7] = null; board[8] = null;
      
      expect(gameLogic.checkDraw(board)).toBe(false);
    });

    it('should return false when board is not full', () => {
      const board = gameLogic.createBoard();
      board[0] = 'X'; board[1] = 'O'; board[2] = 'X';
      board[3] = 'X'; board[4] = 'O'; board[5] = 'O';
      board[6] = 'O'; board[7] = 'X'; board[8] = null; // One empty cell
      
      expect(gameLogic.checkDraw(board)).toBe(false);
    });
  });

  describe('getAIMove', () => {
    it('should return a valid move index', () => {
      const board = gameLogic.createBoard();
      board[0] = 'X'; board[1] = 'O';
      
      const moveIndex = gameLogic.getAIMove(board, 'X', 'Hard');
      
      expect(moveIndex).toBeGreaterThanOrEqual(0);
      expect(moveIndex).toBeLessThanOrEqual(8);
      expect(board[moveIndex]).toBeNull(); // Should be an empty cell
    });

    it('should return null if board is full', () => {
      const board = gameLogic.createBoard();
      board[0] = 'X'; board[1] = 'O'; board[2] = 'X';
      board[3] = 'X'; board[4] = 'O'; board[5] = 'O';
      board[6] = 'O'; board[7] = 'X'; board[8] = 'X';
      
      const moveIndex = gameLogic.getAIMove(board, 'X', 'Hard');
      
      expect(moveIndex).toBeNull();
    });

    it('should make optimal moves on Hard difficulty', () => {
      const board = gameLogic.createBoard();
      board[0] = 'X'; board[1] = 'X'; // X is about to win
      
      const moveIndex = gameLogic.getAIMove(board, 'O', 'Hard');
      
      expect(moveIndex).toBe(2);
    });
  });
});
