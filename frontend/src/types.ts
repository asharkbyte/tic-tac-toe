export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];
export type GameStatus = 'playing' | 'win' | 'draw';
export type GameMode = 'human-human' | 'human-computer' | 'computer-computer';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface GameState {
  gameId: string;
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner?: Player;
  scores: {
    X: number;
    O: number;
    ties: number;
  };
  demo?: {
    isActive: boolean;
    isPaused: boolean;
    sequence?: Array<{
      cellIndex: number;
      player: Player;
    }>;
  };
  aiMove?: number;
}

export interface Settings {
  difficulty: Difficulty;
  soundEnabled: boolean;
}
