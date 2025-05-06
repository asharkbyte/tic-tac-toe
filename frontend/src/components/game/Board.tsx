import React from 'react';
import Cell from './Cell';
import { Board as BoardType } from '../../types';

interface BoardProps {
  board: BoardType;
  onCellClick: (index: number) => void;
  disabled: boolean;
  winningCells?: number[];
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, disabled, winningCells = [] }) => {
  return (
    <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          onClick={() => onCellClick(index)}
          index={index}
          disabled={disabled || cell !== null}
          highlight={winningCells.includes(index)}
        />
      ))}
    </div>
  );
};

export default Board;
