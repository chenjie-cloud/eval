import { useMemo, useState, useEffect } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';

function App() {
  const {
    snake,
    food,
    status,
    score,
    gridSize,
    startGame,
    pauseGame,
    resumeGame,
    changeDirection
  } = useSnakeGame();

  const [isScoring, setIsScoring] = useState(false);

  useEffect(() => {
    if (score > 0) {
      setIsScoring(true);
      const timer = setTimeout(() => setIsScoring(false), 400);
      return () => clearTimeout(timer);
    }
  }, [score]);

  // Pre-calculate grid cells to avoid large renders in loop
  const gridCells = useMemo(() => {
    const cells = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const isSnakeHead = snake[0].x === col && snake[0].y === row;
        const isSnakeBody = !isSnakeHead && snake.some(segment => segment.x === col && segment.y === row);
        const isFood = food.x === col && food.y === row;

        let cellClasses = "w-full h-full border border-retro-bg/20 rounded-sm ";
        if (isSnakeHead) {
          cellClasses += "bg-retro-cyan shadow-[0_0_10px_rgba(0,255,255,0.8)]";
        } else if (isSnakeBody) {
          cellClasses += "bg-retro-cyan/80 shadow-[0_0_5px_rgba(0,255,255,0.5)]";
        } else if (isFood) {
          cellClasses += "bg-retro-pink animate-food-glow rounded-full";
        } else {
          cellClasses += "bg-transparent";
        }

        cells.push(
          <div key={`${col}-${row}`} className={cellClasses} />
        );
      }
    }
    return cells;
  }, [snake, food, gridSize]);

  return (
    <div className="min-h-screen bg-retro-bg flex flex-col items-center justify-center font-pixel text-retro-cyan p-4 select-none">
      <div className="border-4 border-retro-pink p-6 md:p-8 rounded-lg shadow-[0_0_15px_rgba(255,0,255,0.5)] bg-black/50 backdrop-blur-sm flex flex-col items-center w-full max-w-lg">
        
        <h1 className="text-3xl md:text-5xl text-retro-pink mb-6 text-center drop-shadow-[0_0_10px_rgba(255,0,255,0.8)] tracking-wider">
          NEON SNAKE
        </h1>
        
        {/* Score Board */}
        <div className="flex justify-between w-full mb-6 px-2">
          <div className="text-retro-green text-sm md:text-base drop-shadow-[0_0_5px_rgba(0,255,0,0.8)] flex items-center gap-2">
            <span>SCORE:</span>
            <span className={`text-retro-cyan transition-colors duration-300 inline-block ${isScoring ? 'animate-score-bump' : ''}`}>
              {score.toString().padStart(4, '0')}
            </span>
          </div>
          <div className="text-retro-yellow text-sm md:text-base drop-shadow-[0_0_5px_rgba(255,255,0,0.8)] flex items-center gap-2">
            <span>STATUS:</span>
            <span className="text-retro-pink">{status.toUpperCase()}</span>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative mb-8 w-full aspect-square max-w-[400px]">
          <div 
            className="w-full h-full grid bg-retro-bg border-2 border-retro-cyan shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`
            }}
          >
            {gridCells}
          </div>

          {/* Overlays */}
          {status === 'idle' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm border-2 border-retro-pink animate-fade-in">
              <div className="animate-slide-up flex flex-col items-center">
                <p className="text-retro-cyan mb-8 animate-pulse text-center leading-relaxed">
                  PRESS ENTER<br/>TO START
                </p>
                <button 
                  onClick={startGame}
                  className="px-6 py-3 border-2 border-retro-pink text-retro-pink hover:bg-retro-pink hover:text-retro-bg transition-all duration-300 shadow-[0_0_10px_rgba(255,0,255,0.5)] hover:shadow-[0_0_20px_rgba(255,0,255,0.8)]"
                >
                  START GAME
                </button>
              </div>
            </div>
          )}

          {status === 'paused' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm border-2 border-retro-yellow animate-fade-in">
              <div className="animate-slide-up flex flex-col items-center">
                <p className="text-retro-yellow mb-8 text-xl drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]">
                  PAUSED
                </p>
                <button 
                  onClick={resumeGame}
                  className="px-6 py-3 border-2 border-retro-yellow text-retro-yellow hover:bg-retro-yellow hover:text-retro-bg transition-all duration-300 shadow-[0_0_10px_rgba(255,255,0,0.5)] hover:shadow-[0_0_20px_rgba(255,255,0,0.8)]"
                >
                  RESUME
                </button>
              </div>
            </div>
          )}

          {status === 'gameover' && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center backdrop-blur-sm border-2 border-retro-pink animate-fade-in">
              <div className="animate-slide-up flex flex-col items-center">
                <p className="text-retro-pink text-3xl mb-4 drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]">
                  GAME OVER
                </p>
                <div className="text-center mb-8">
                  <p className="text-retro-cyan text-sm mb-2">FINAL SCORE</p>
                  <p className="text-retro-green text-2xl drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]">
                    {score.toString().padStart(4, '0')}
                  </p>
                </div>
                <button 
                  onClick={startGame}
                  className="px-6 py-3 border-2 border-retro-green text-retro-green hover:bg-retro-green hover:text-retro-bg transition-all duration-300 shadow-[0_0_10px_rgba(0,255,0,0.5)] hover:shadow-[0_0_20px_rgba(0,255,0,0.8)]"
                >
                  PLAY AGAIN
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls Info & Mobile Buttons */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-retro-cyan/70">
          <div className="hidden md:block">
            <h3 className="mb-3 text-retro-pink drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]">KEYBOARD</h3>
            <ul className="space-y-2 text-[10px] leading-relaxed">
              <li><span className="text-retro-yellow">W/A/S/D</span> OR <span className="text-retro-yellow">ARROWS</span> : MOVE</li>
              <li><span className="text-retro-yellow">SPACE/ESC</span> : PAUSE/RESUME</li>
              <li><span className="text-retro-yellow">ENTER</span> : START</li>
            </ul>
          </div>

          <div className="md:hidden flex flex-col items-center">
            <h3 className="mb-3 text-retro-green drop-shadow-[0_0_5px_rgba(0,255,0,0.8)]">MOBILE CONTROLS</h3>
            <div className="grid grid-cols-3 gap-2 w-48">
              <div />
              <button 
                onClick={() => changeDirection('UP')} 
                className="h-12 border-2 border-retro-cyan text-retro-cyan active:bg-retro-cyan active:text-retro-bg rounded shadow-[0_0_5px_rgba(0,255,255,0.5)] flex items-center justify-center text-xl"
              >
                ↑
              </button>
              <div />
              <button 
                onClick={() => changeDirection('LEFT')} 
                className="h-12 border-2 border-retro-cyan text-retro-cyan active:bg-retro-cyan active:text-retro-bg rounded shadow-[0_0_5px_rgba(0,255,255,0.5)] flex items-center justify-center text-xl"
              >
                ←
              </button>
              <button 
                onClick={() => changeDirection('DOWN')} 
                className="h-12 border-2 border-retro-cyan text-retro-cyan active:bg-retro-cyan active:text-retro-bg rounded shadow-[0_0_5px_rgba(0,255,255,0.5)] flex items-center justify-center text-xl"
              >
                ↓
              </button>
              <button 
                onClick={() => changeDirection('RIGHT')} 
                className="h-12 border-2 border-retro-cyan text-retro-cyan active:bg-retro-cyan active:text-retro-bg rounded shadow-[0_0_5px_rgba(0,255,255,0.5)] flex items-center justify-center text-xl"
              >
                →
              </button>
            </div>
            {/* Mobile Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-4 w-48">
              <button 
                onClick={status === 'playing' ? pauseGame : resumeGame}
                disabled={status === 'idle' || status === 'gameover'}
                className="h-10 border-2 border-retro-yellow text-retro-yellow active:bg-retro-yellow active:text-retro-bg rounded shadow-[0_0_5px_rgba(255,255,0,0.5)] disabled:opacity-50 disabled:shadow-none text-[10px]"
              >
                {status === 'paused' ? 'RESUME' : 'PAUSE'}
              </button>
              <button 
                onClick={startGame}
                className="h-10 border-2 border-retro-pink text-retro-pink active:bg-retro-pink active:text-retro-bg rounded shadow-[0_0_5px_rgba(255,0,255,0.5)] text-[10px]"
              >
                RESTART
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
