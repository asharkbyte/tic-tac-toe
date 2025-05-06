import React from 'react';
import { Player } from '../../types';

interface CellProps {
  value: Player | null;
  onClick: () => void;
  index: number;
  disabled: boolean;
  highlight?: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onClick, index, disabled, highlight = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28
        flex items-center justify-center
        text-4xl md:text-5xl lg:text-6xl font-bold
        border-2 border-gray-300
        transition-all duration-200
        ${disabled && !value ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${highlight ? 'bg-green-100' : 'bg-white'}
        ${value === 'X' ? 'text-blue-600' : value === 'O' ? 'text-red-600' : 'text-transparent'}
        hover:bg-gray-100
      `}
      aria-label={`Cell ${index}`}
    >
      {value}
    </button>
  );
};

export default Cell;
