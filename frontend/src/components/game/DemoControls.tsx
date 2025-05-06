import React from 'react';
import { useGame } from '../../context/GameContext';
import { Button } from '../ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';

interface DemoControlsProps {
  gameId: string;
}

const DemoControls: React.FC<DemoControlsProps> = ({ gameId }) => {
  const { gameState, startDemo, pauseDemo, resetDemo, isLoading } = useGame();
  
  if (!gameState || !gameState.demo) {
    return null;
  }
  
  const { isActive, isPaused } = gameState.demo;
  
  return (
    <div className="flex justify-center space-x-4 mt-6">
      {isPaused ? (
        <Button
          onClick={startDemo}
          disabled={isLoading || gameState.status !== 'playing'}
          className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300"
        >
          <Play size={16} /> Resume
        </Button>
      ) : (
        <Button
          onClick={pauseDemo}
          disabled={isLoading || !isActive || gameState.status !== 'playing'}
          className="flex items-center gap-2 bg-yellow-600 text-white hover:bg-yellow-700 disabled:bg-gray-300"
        >
          <Pause size={16} /> Pause
        </Button>
      )}
      
      <Button
        onClick={resetDemo}
        disabled={isLoading}
        className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
      >
        <RefreshCw size={16} /> Reset Demo
      </Button>
    </div>
  );
};

export default DemoControls;
