import React from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { GameProvider } from './context/GameContext';
import HomeScreen from './components/home/HomeScreen';
import GameBoard from './components/game/GameBoard';
import DemoControls from './components/game/DemoControls';
import { useGame } from './context/GameContext';

const GameContainer: React.FC = () => {
  const { gameState, gameMode } = useGame();

  if (!gameState) {
    return <HomeScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <GameBoard />
      {gameMode === 'computer-computer' && gameState.demo && (
        <DemoControls />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <GameProvider>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-blue-600 text-white py-4 shadow-md">
            <div className="container mx-auto px-4">
              <h1 className="text-2xl font-bold text-center">Tic Tac Toe</h1>
            </div>
          </header>
          <main className="container mx-auto py-8">
            <GameContainer />
          </main>
          <footer className="mt-auto py-4 text-center text-gray-500 text-sm">
            <p>© 2025 Tic Tac Toe Game</p>
          </footer>
        </div>
      </GameProvider>
    </SettingsProvider>
  );
};

export default App;
