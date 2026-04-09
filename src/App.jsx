import React from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';

function App() {
  const { snake, food, score, highScore, gameOver, isPaused, GRID_SIZE, resetGame } = useSnakeGame();

  // Create grid cells
  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        // Check if cell is snake
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = !isSnakeHead && snake.some(segment => segment.x === x && segment.y === y);
        // Check if cell is food
        const isFood = food.x === x && food.y === y;

        let cellClass = "w-full h-full border-[0.5px] border-cyber-blue/10 rounded-sm ";
        if (isSnakeHead) {
          cellClass += "bg-cyber-green shadow-[0_0_15px_#00ff00] z-10 relative";
        } else if (isSnakeBody) {
          cellClass += "bg-cyber-green/80 shadow-[0_0_8px_#00ff00]";
        } else if (isFood) {
          cellClass += "bg-cyber-purple shadow-[0_0_15px_#bf00ff] animate-pulse z-10 relative";
        } else {
          cellClass += "bg-cyber-gray/30";
        }

        cells.push(
          <div key={`${x}-${y}`} className={cellClass}></div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-blue font-mono flex flex-col items-center justify-center p-4">
      {/* Glitch effect layer */}
      <div className="fixed inset-0 bg-cyber-black opacity-0 hover:opacity-10 animate-glitch pointer-events-none z-50"></div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-cyber-blue drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] uppercase tracking-widest text-center">
        Cyber Snake
      </h1>

      <div className="flex gap-8 mb-6 text-xl text-cyber-yellow drop-shadow-[0_0_5px_#ffff00]">
        <div className="flex flex-col items-center">
          <span className="text-sm text-cyber-pink">SCORE</span>
          <span className="font-bold">{score}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-cyber-pink">HIGH SCORE</span>
          <span className="font-bold">{highScore}</span>
        </div>
      </div>

      <div className="relative border-2 border-cyber-blue p-2 shadow-[0_0_20px_rgba(0,255,255,0.4)] bg-cyber-gray/20 rounded-md backdrop-blur-sm">
        <div 
          className="grid gap-[1px] bg-cyber-blue/20"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(90vw, 500px)',
            height: 'min(90vw, 500px)'
          }}
        >
          {renderGrid()}
        </div>

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-cyber-black/80 flex items-center justify-center backdrop-blur-sm z-20">
            <h2 className="text-3xl font-bold text-cyber-yellow drop-shadow-[0_0_10px_#ffff00] animate-pulse">
              PAUSED
            </h2>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-cyber-black/90 flex flex-col items-center justify-center backdrop-blur-md z-30 border-2 border-cyber-pink shadow-[inset_0_0_30px_rgba(255,0,255,0.5)]">
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-cyber-yellow drop-shadow-[0_0_15px_#ff00ff] animate-pulse">
              SYSTEM FAILURE
            </h2>
            <p className="text-xl mb-6 text-cyber-blue drop-shadow-[0_0_5px_#00ffff]">
              FINAL SCORE: {score}
            </p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 border-2 border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-cyber-black transition-all duration-300 shadow-[0_0_15px_rgba(0,255,0,0.5)] hover:shadow-[0_0_30px_rgba(0,255,0,0.8)] uppercase tracking-widest font-bold text-lg focus:outline-none"
            >
              REBOOT SYSTEM
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-cyber-blue/70 flex flex-col items-center gap-2 text-center">
        <p className="drop-shadow-[0_0_2px_#00ffff]">USE [W][A][S][D] OR ARROWS TO MOVE</p>
        <p className="drop-shadow-[0_0_2px_#00ffff]">PRESS [SPACE] TO PAUSE</p>
        <div className="w-full h-px bg-cyber-blue mt-4 opacity-50 shadow-[0_0_5px_#00ffff]"></div>
      </div>
    </div>
  );
}

export default App;
