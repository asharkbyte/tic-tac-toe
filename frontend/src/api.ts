import axios from 'axios';
import { GameState, GameMode, Difficulty } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
});

export const createNewGame = async (mode: GameMode, difficulty: Difficulty): Promise<GameState> => {
  const response = await api.post('/api/game/new', { mode, difficulty });
  return response.data;
};

export const getGameState = async (gameId: string): Promise<GameState> => {
  const response = await api.get(`/api/game/${gameId}`);
  return response.data;
};

export const makeMove = async (gameId: string, cellIndex: number, player: 'X' | 'O'): Promise<GameState> => {
  const response = await api.post(`/api/game/${gameId}/move`, { cellIndex, player });
  return response.data;
};

export const startDemo = async (gameId: string): Promise<GameState> => {
  const response = await api.post(`/api/game/${gameId}/demo/start`);
  return response.data;
};

export const pauseDemo = async (gameId: string): Promise<{ gameId: string; demo: { isActive: boolean; isPaused: boolean } }> => {
  const response = await api.post(`/api/game/${gameId}/demo/pause`);
  return response.data;
};

export const resetDemo = async (gameId: string): Promise<GameState> => {
  const response = await api.post(`/api/game/${gameId}/demo/reset`);
  return response.data;
};
