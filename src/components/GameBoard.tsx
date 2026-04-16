import React from 'react';
import { Position } from '../hooks/useSnake';
import clsx from 'clsx';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({ snake, food, gridSize }) => {
  return (
    <div 
      className="relative w-full max-w-[400px] aspect-square bg-[#0b0914] border-2 border-[#00f3ff] rounded-lg overflow-hidden neon-box-cyan grid-bg"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {Array.from({ length: gridSize * gridSize }).map((_, i) => {
        const x = i % gridSize;
        const y = Math.floor(i / gridSize);
        
        const isFood = food.x === x && food.y === y;
        const snakeIndex = snake.findIndex((segment) => segment.x === x && segment.y === y);
        const isSnake = snakeIndex !== -1;
        const isHead = snakeIndex === 0;

        return (
          <div
            key={i}
            className={clsx(
              'w-full h-full rounded-[2px] transition-all duration-75',
              isFood && 'bg-[#ff003c] neon-box-pink scale-[0.6] animate-pulse',
              isSnake && !isHead && 'bg-[#00f3ff] opacity-80 scale-75',
              isHead && 'bg-[#fff] neon-box-cyan scale-[0.85] z-10'
            )}
          />
        );
      })}
    </div>
  );
};
