import React from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import { Play, Pause, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const GRID_SIZE = 20;

function App() {
  const {
    snake,
    food,
    gameState,
    score,
    highScore,
    startGame,
    pauseGame,
    changeDirection,
  } = useSnakeGame({ gridSize: GRID_SIZE, initialSpeed: 150 });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-0">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-purple mb-8 animate-pulse-fast drop-shadow-[0_0_10px_rgba(57,255,20,0.8)] text-center">
        NEON SNAKE
      </h1>

      {/* Score Board */}
      <div className="flex justify-between w-full max-w-md mb-6 px-4 py-3 bg-neon-dark/80 border-2 border-neon-purple rounded-xl shadow-neon-purple backdrop-blur-sm">
        <div className="flex flex-col">
          <span className="text-xs text-neon-purple uppercase tracking-widest">Score</span>
          <span className="text-2xl font-bold text-neon-green drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs text-neon-purple uppercase tracking-widest">High Score</span>
          <span className="text-2xl font-bold text-neon-pink drop-shadow-[0_0_5px_rgba(255,0,127,0.8)]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <div 
          className="grid gap-[1px] bg-gray-900/50 border-2 border-neon-green p-1 rounded-sm shadow-neon-green-lg relative z-10 overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(90vw, 400px)',
            height: 'min(90vw, 400px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((segment, idx) => idx !== 0 && segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            let cellClasses = "w-full h-full rounded-sm transition-all duration-75 ";
            if (isSnakeHead) {
              cellClasses += "bg-neon-green shadow-[0_0_10px_#39ff14] z-20";
            } else if (isSnakeBody) {
              cellClasses += "bg-neon-green/80 shadow-[0_0_5px_#39ff14] z-10";
            } else if (isFood) {
              cellClasses += "bg-neon-pink shadow-[0_0_15px_#ff007f] animate-flicker z-10";
            } else {
              cellClasses += "bg-gray-800/30";
            }

            return <div key={index} className={cellClasses} />;
          })}
        </div>

        {/* Overlay Screens */}
        {gameState !== 'PLAYING' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-sm">
            <div className="text-center p-6 bg-neon-dark border border-neon-purple shadow-neon-purple rounded-xl flex flex-col items-center">
              {gameState === 'GAME_OVER' && (
                <>
                  <h2 className="text-3xl font-bold text-neon-pink drop-shadow-[0_0_8px_#ff007f] mb-2 animate-flicker">
                    GAME OVER
                  </h2>
                  <p className="text-gray-300 mb-6">Final Score: <span className="text-neon-green font-bold">{score}</span></p>
                </>
              )}
              {gameState === 'PAUSED' && (
                <h2 className="text-3xl font-bold text-neon-purple drop-shadow-[0_0_8px_#b026ff] mb-6">
                  PAUSED
                </h2>
              )}
              {gameState === 'IDLE' && (
                <h2 className="text-2xl font-bold text-neon-green drop-shadow-[0_0_8px_#39ff14] mb-6">
                  READY?
                </h2>
              )}
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-neon-green text-neon-green rounded-full font-bold hover:bg-neon-green hover:text-black transition-all shadow-[0_0_10px_#39ff14] hover:shadow-[0_0_20px_#39ff14]"
              >
                {gameState === 'GAME_OVER' ? <RotateCcw size={20} /> : <Play size={20} />}
                {gameState === 'GAME_OVER' ? 'TRY AGAIN' : 'START GAME'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-md">
        {/* Desktop Pause/Start tip */}
        <div className="hidden sm:flex gap-4">
          <button
            onClick={gameState === 'PLAYING' || gameState === 'PAUSED' ? pauseGame : startGame}
            className="flex items-center gap-2 px-4 py-2 border border-neon-purple text-neon-purple rounded-full hover:bg-neon-purple/20 transition-colors shadow-[0_0_5px_#b026ff]"
          >
            {gameState === 'PLAYING' ? <Pause size={18} /> : <Play size={18} />}
            <span className="text-sm font-bold tracking-wider">
              {gameState === 'PLAYING' ? 'PAUSE (SPACE)' : 'START / RESUME'}
            </span>
          </button>
          <p className="text-gray-400 text-xs flex items-center">
            Use <strong className="text-neon-green mx-1">W A S D</strong> or <strong className="text-neon-green mx-1">Arrows</strong> to move
          </p>
        </div>

        {/* Mobile D-Pad */}
        <div className="sm:hidden grid grid-cols-3 gap-2 w-48 mx-auto mt-2">
          <div />
          <button 
            className="bg-gray-800/80 border border-neon-green text-neon-green p-4 rounded-xl flex justify-center active:bg-neon-green active:text-black shadow-[0_0_5px_#39ff14]"
            onClick={(e) => { e.preventDefault(); changeDirection('UP'); }}
            onTouchStart={(e) => { e.preventDefault(); changeDirection('UP'); }}
          >
            <ChevronUp size={24} />
          </button>
          <div />
          <button 
            className="bg-gray-800/80 border border-neon-green text-neon-green p-4 rounded-xl flex justify-center active:bg-neon-green active:text-black shadow-[0_0_5px_#39ff14]"
            onClick={(e) => { e.preventDefault(); changeDirection('LEFT'); }}
            onTouchStart={(e) => { e.preventDefault(); changeDirection('LEFT'); }}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className="bg-gray-800/80 border border-neon-purple text-neon-purple p-4 rounded-xl flex justify-center active:bg-neon-purple active:text-black shadow-[0_0_5px_#b026ff]"
            onClick={(e) => { e.preventDefault(); pauseGame(); }}
            onTouchStart={(e) => { e.preventDefault(); pauseGame(); }}
          >
            {gameState === 'PLAYING' ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button 
            className="bg-gray-800/80 border border-neon-green text-neon-green p-4 rounded-xl flex justify-center active:bg-neon-green active:text-black shadow-[0_0_5px_#39ff14]"
            onClick={(e) => { e.preventDefault(); changeDirection('RIGHT'); }}
            onTouchStart={(e) => { e.preventDefault(); changeDirection('RIGHT'); }}
          >
            <ChevronRight size={24} />
          </button>
          <div />
          <button 
            className="bg-gray-800/80 border border-neon-green text-neon-green p-4 rounded-xl flex justify-center active:bg-neon-green active:text-black shadow-[0_0_5px_#39ff14]"
            onClick={(e) => { e.preventDefault(); changeDirection('DOWN'); }}
            onTouchStart={(e) => { e.preventDefault(); changeDirection('DOWN'); }}
          >
            <ChevronDown size={24} />
          </button>
          <div />
        </div>
      </div>
    </div>
  );
}

export default App;