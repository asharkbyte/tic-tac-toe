import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { GameState, GameMode } from '../types';
import * as api from '../api';
import { useSettings } from './SettingsContext';

interface GameContextType {
  gameState: GameState | null;
  gameMode: GameMode | null;
  isLoading: boolean;
  error: string | null;
  startNewGame: (mode: GameMode) => Promise<void>;
  makeMove: (cellIndex: number) => Promise<void>;
  restartGame: () => Promise<void>;
  startDemo: () => Promise<void>;
  pauseDemo: () => Promise<void>;
  resetDemo: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();
  const [demoInterval, setDemoInterval] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (demoInterval) {
        clearInterval(demoInterval);
      }
    };
  }, [demoInterval]);

  useEffect(() => {
    if (
      gameState?.demo?.isActive &&
      !gameState.demo.isPaused &&
      gameState.status === 'playing' &&
      gameMode === 'computer-computer'
    ) {
      if (!demoInterval && gameState.demo.sequence) {
        let currentIndex = 0;
        const interval = window.setInterval(async () => {
          if (
            gameState?.demo?.sequence &&
            currentIndex < gameState.demo.sequence.length
          ) {
            const move = gameState.demo.sequence[currentIndex];
            try {
              const updatedState = await api.makeMove(
                gameState.gameId,
                move.cellIndex,
                move.player
              );
              setGameState(updatedState);
              currentIndex++;
              
              if (updatedState.status !== 'playing' || currentIndex >= (gameState.demo.sequence?.length || 0)) {
                clearInterval(interval);
                setDemoInterval(null);
              }
            } catch (err) {
              console.error('Error during demo playback:', err);
              clearInterval(interval);
              setDemoInterval(null);
              setError('Error during demo playback');
            }
          } else {
            clearInterval(interval);
            setDemoInterval(null);
          }
        }, 1000); // 1-second interval as specified
        
        setDemoInterval(Number(interval));
      }
    } else if (demoInterval && (gameState?.demo?.isPaused || gameState?.status !== 'playing')) {
      clearInterval(demoInterval);
      setDemoInterval(null);
    }
  }, [gameState, gameMode, demoInterval]);

  const startNewGame = async (mode: GameMode) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Starting new game with mode:', mode);
      const newGameState = await api.createNewGame(mode, settings.difficulty);
      console.log('New game state:', newGameState);
      setGameState(newGameState);
      setGameMode(mode);
      
      if (mode === 'computer-computer') {
        console.log('Starting demo for computer-computer mode');
        await startDemo();
      }
    } catch (err) {
      console.error('Error starting new game:', err);
      setError('Failed to start new game');
    } finally {
      setIsLoading(false);
    }
  };

  const makeMove = async (cellIndex: number) => {
    if (!gameState || gameState.status !== 'playing') return;
    
    setIsLoading(true);
    setError(null);
    try {
      const updatedState = await api.makeMove(
        gameState.gameId,
        cellIndex,
        gameState.currentPlayer
      );
      setGameState(updatedState);
    } catch (err) {
      console.error('Error making move:', err);
      setError('Failed to make move');
    } finally {
      setIsLoading(false);
    }
  };

  const restartGame = async () => {
    if (!gameMode) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const newGameState = await api.createNewGame(gameMode, settings.difficulty);
      setGameState(newGameState);
      
      if (gameMode === 'computer-computer') {
        await startDemo();
      }
    } catch (err) {
      console.error('Error restarting game:', err);
      setError('Failed to restart game');
    } finally {
      setIsLoading(false);
    }
  };

  const startDemo = async () => {
    if (!gameState) return;
    
    setIsLoading(true);
    setError(null);
    try {
      console.log('Starting demo for game ID:', gameState.gameId);
      
      const demoState = await api.startDemo(gameState.gameId);
      console.log('Demo state received:', demoState);
      console.log('Demo object:', demoState.demo);
      
      if (demoState && demoState.demo) {
        console.log('Setting game state with demo sequence:', demoState.demo.sequence);
        setGameState(demoState);
      } else {
        console.error('Demo state or demo object is missing in the response');
        setError('Failed to start demo: Invalid response from server');
      }
    } catch (err) {
      console.error('Error starting demo:', err);
      setError('Failed to start demo');
    } finally {
      setIsLoading(false);
    }
  };

  const pauseDemo = async () => {
    if (!gameState) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.pauseDemo(gameState.gameId);
      setGameState((prev: GameState | null) => {
        if (!prev) return null;
        return {
          ...prev,
          demo: {
            ...prev.demo!,
            isPaused: response.demo.isPaused
          }
        };
      });
    } catch (err) {
      console.error('Error pausing demo:', err);
      setError('Failed to pause demo');
    } finally {
      setIsLoading(false);
    }
  };

  const resetDemo = async () => {
    if (!gameState) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const resetState = await api.resetDemo(gameState.gameId);
      setGameState(resetState);
    } catch (err) {
      console.error('Error resetting demo:', err);
      setError('Failed to reset demo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        gameMode,
        isLoading,
        error,
        startNewGame,
        makeMove,
        restartGame,
        startDemo,
        pauseDemo,
        resetDemo
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
