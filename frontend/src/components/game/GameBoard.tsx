import React, { useState, useEffect } from 'react';
import Board from './Board';
import { useGame } from '../../context/GameContext';
import { Settings } from '../ui/settings-dialog';
import { Button } from '../ui/button';
import { Cog } from 'lucide-react';

const GameBoard: React.FC = () => {
  const { gameState, gameMode, isLoading, error, makeMove, restartGame } = useGame();
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (gameState?.status === 'win') {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
      ];
      
      for (const [a, b, c] of lines) {
        if (
          gameState.board[a] &&
          gameState.board[a] === gameState.board[b] &&
          gameState.board[a] === gameState.board[c]
        ) {
          setWinningCells([a, b, c]);
          return;
        }
      }
    } else {
      setWinningCells([]);
    }
  }, [gameState?.status, gameState?.board]);

  if (!gameState) {
    return null;
  }

  const handleCellClick = (index: number) => {
    if (gameState.status === 'playing' && gameState.board[index] === null) {
      makeMove(index);
    }
  };

  const getStatusMessage = () => {
    if (gameState.status === 'win') {
      return `Player ${gameState.winner} wins!`;
    } else if (gameState.status === 'draw') {
      return 'Game ended in a draw!';
    } else {
      return `Player ${gameState.currentPlayer}'s turn`;
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-bold">{getStatusMessage()}</div>
        <div className="text-lg">
          Score: X:{gameState.scores.X} O:{gameState.scores.O} Ties:{gameState.scores.ties}
        </div>
      </div>

      <Board
        board={gameState.board}
        onCellClick={handleCellClick}
        disabled={isLoading || gameState.status !== 'playing' || (gameMode === 'human-computer' && gameState.currentPlayer === 'O')}
        winningCells={winningCells}
      />

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <Button 
          onClick={restartGame}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Restart Game
        </Button>
        
        <Button
          onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100"
        >
          <Cog size={16} /> Settings
        </Button>
      </div>

      <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default GameBoard;
