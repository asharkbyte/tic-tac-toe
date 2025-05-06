import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { GameMode } from '../../types';

const HomeScreen: React.FC = () => {
  const { startNewGame, isLoading } = useGame();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  useEffect(() => {
    console.log('HomeScreen mounted');
  }, []);

  const handleModeSelect = (mode: GameMode) => {
    console.log('Mode selected:', mode);
    setSelectedMode(mode);
  };

  useEffect(() => {
    console.log('Selected mode changed to:', selectedMode);
  }, [selectedMode]);

  const handleStartGame = async () => {
    console.log('Starting game with mode:', selectedMode);
    if (selectedMode) {
      try {
        await startNewGame(selectedMode);
        console.log('Game started successfully');
      } catch (error) {
        console.error('Error starting game:', error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center">Tic Tac Toe</h1>
      
      <div className="w-full mb-8">
        <h2 className="text-lg font-medium mb-4">Select Game Mode:</h2>
        <div className="grid grid-cols-1 gap-4">
          <button
            type="button"
            onClick={() => handleModeSelect('human-human')}
            className={`p-4 w-full rounded-md ${
              selectedMode === 'human-human'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            Human vs Human
          </button>
          
          <button
            type="button"
            onClick={() => handleModeSelect('human-computer')}
            className={`p-4 w-full rounded-md ${
              selectedMode === 'human-computer'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            Human vs Computer
          </button>
          
          <button
            type="button"
            onClick={() => handleModeSelect('computer-computer')}
            className={`p-4 w-full rounded-md ${
              selectedMode === 'computer-computer'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            Computer vs Computer (Demo)
          </button>
        </div>
      </div>
      
      <button
        type="button"
        onClick={handleStartGame}
        disabled={!selectedMode || isLoading}
        className="w-full py-3 rounded-md bg-green-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading...' : 'Start Game'}
      </button>
    </div>
  );
};

export default HomeScreen;
