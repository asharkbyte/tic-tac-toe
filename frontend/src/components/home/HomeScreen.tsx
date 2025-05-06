import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { GameMode } from '../../types';
import { Button } from '../ui/button';

const HomeScreen: React.FC = () => {
  const { startNewGame, isLoading } = useGame();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
  };

  const handleStartGame = async () => {
    if (selectedMode) {
      await startNewGame(selectedMode);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center">Tic Tac Toe</h1>
      
      <div className="w-full mb-8">
        <h2 className="text-lg font-medium mb-4">Select Game Mode:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => handleModeSelect('human-human')}
            className={`p-4 ${
              selectedMode === 'human-human'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            Human vs Human
          </Button>
          
          <Button
            onClick={() => handleModeSelect('human-computer')}
            className={`p-4 ${
              selectedMode === 'human-computer'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            Human vs Computer
          </Button>
          
          <Button
            onClick={() => handleModeSelect('computer-computer')}
            className={`p-4 ${
              selectedMode === 'computer-computer'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            Computer vs Computer (Demo)
          </Button>
        </div>
      </div>
      
      <Button
        onClick={handleStartGame}
        disabled={!selectedMode || isLoading}
        className="w-full py-3 bg-green-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading...' : 'Start Game'}
      </Button>
    </div>
  );
};

export default HomeScreen;
