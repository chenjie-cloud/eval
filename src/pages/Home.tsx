import { useEffect } from 'react';
import { useGameStore, GRID_SIZE } from '../store/useGameStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { Play, Pause, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Home() {
  const {
    snake,
    food,
    status,
    score,
    highScore,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    setDirection
  } = useGameStore();

  // Start the game loop
  useGameLoop();

  const handleDirection = (e: React.TouchEvent | React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    setDirection({ x, y });
  };

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setDirection({ x: 1, y: 0 });
          break;
        case ' ': // Spacebar
          if (status === 'playing') pauseGame();
          else if (status === 'paused') resumeGame();
          else if (status === 'idle' || status === 'gameover') startGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setDirection, status, pauseGame, resumeGame, startGame]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black font-sans select-none pb-12">
      {/* Header & Scoreboard */}
      <div className="w-full max-w-md flex justify-between items-end mb-6 px-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-widest glow-pink">
            NEON SNAKE
          </h1>
        </div>
        <div className="text-right flex flex-col items-end space-y-1">
          <div className="text-neon-blue glow-blue text-xl sm:text-2xl font-semibold">
            SCORE: {score}
          </div>
          <div className="text-neon-green glow-green text-sm sm:text-base">
            HIGH: {highScore}
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative">
        <div 
          className="border-2 border-white/20 bg-black/50 shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-lg overflow-hidden"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);

            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = !isHead && snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            let cellClasses = 'w-[20px] h-[20px] border-[0.5px] border-white/5';
            
            if (isHead) {
              cellClasses += ' bg-neon-pink box-glow-pink rounded-sm z-10';
            } else if (isBody) {
              cellClasses += ' bg-neon-blue box-glow-blue rounded-sm z-10 opacity-80';
            } else if (isFood) {
              cellClasses += ' bg-neon-green box-glow-green rounded-full z-10 animate-pulse';
            }

            return <div key={i} className={cellClasses} />;
          })}
        </div>

        {/* Overlays */}
        {status !== 'playing' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-20">
            {status === 'idle' && (
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-white glow-pink mb-8">READY?</h2>
                <button 
                  onClick={startGame}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-neon-green text-neon-green font-bold rounded box-glow-green hover:bg-neon-green hover:text-black transition-all duration-300 mx-auto"
                >
                  <Play size={24} />
                  <span>START GAME</span>
                </button>
              </div>
            )}

            {status === 'paused' && (
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-white glow-blue mb-8 tracking-widest">PAUSED</h2>
                <button 
                  onClick={resumeGame}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-neon-blue text-neon-blue font-bold rounded box-glow-blue hover:bg-neon-blue hover:text-black transition-all duration-300 mx-auto"
                >
                  <Play size={24} />
                  <span>RESUME</span>
                </button>
              </div>
            )}

            {status === 'gameover' && (
              <div className="text-center space-y-6 w-full px-4">
                <h2 className="text-5xl font-bold text-white glow-pink mb-2">GAME OVER</h2>
                <p className="text-neon-blue glow-blue text-xl mb-8">FINAL SCORE: {score}</p>
                <div className="flex space-x-4 justify-center">
                  <button 
                    onClick={startGame}
                    className="flex items-center space-x-2 px-6 py-3 border-2 border-neon-pink text-neon-pink font-bold rounded box-glow-pink hover:bg-neon-pink hover:text-white transition-all duration-300"
                  >
                    <RotateCcw size={24} />
                    <span>PLAY AGAIN</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="mt-8 flex space-x-6">
        <button 
          onClick={() => {
            if (status === 'idle' || status === 'gameover') startGame();
            else if (status === 'paused') resumeGame();
          }}
          disabled={status === 'playing'}
          className={`p-4 rounded-full border-2 transition-all duration-300 ${
            status === 'playing' 
              ? 'border-gray-800 text-gray-800 cursor-not-allowed'
              : 'border-neon-green text-neon-green box-glow-green hover:bg-neon-green hover:text-black'
          }`}
          title="Start / Resume"
        >
          <Play size={24} />
        </button>
        
        <button 
          onClick={pauseGame}
          disabled={status !== 'playing'}
          className={`p-4 rounded-full border-2 transition-all duration-300 ${
            status !== 'playing'
              ? 'border-gray-800 text-gray-800 cursor-not-allowed'
              : 'border-neon-blue text-neon-blue box-glow-blue hover:bg-neon-blue hover:text-black'
          }`}
          title="Pause"
        >
          <Pause size={24} />
        </button>

        <button 
          onClick={resetGame}
          className="p-4 rounded-full border-2 border-neon-pink text-neon-pink box-glow-pink hover:bg-neon-pink hover:text-white transition-all duration-300"
          title="Reset"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      {/* Mobile D-Pad */}
      <div className="mt-8 flex sm:hidden flex-col items-center gap-2">
        <button
          className="p-4 rounded-full border-2 border-neon-blue text-neon-blue box-glow-blue active:bg-neon-blue active:text-black transition-all duration-300 touch-none"
          onTouchStart={(e) => handleDirection(e, 0, -1)}
          onClick={(e) => handleDirection(e, 0, -1)}
          title="Up"
        >
          <ArrowUp size={28} />
        </button>
        <div className="flex gap-12">
          <button
            className="p-4 rounded-full border-2 border-neon-blue text-neon-blue box-glow-blue active:bg-neon-blue active:text-black transition-all duration-300 touch-none"
            onTouchStart={(e) => handleDirection(e, -1, 0)}
            onClick={(e) => handleDirection(e, -1, 0)}
            title="Left"
          >
            <ArrowLeft size={28} />
          </button>
          <button
            className="p-4 rounded-full border-2 border-neon-blue text-neon-blue box-glow-blue active:bg-neon-blue active:text-black transition-all duration-300 touch-none"
            onTouchStart={(e) => handleDirection(e, 1, 0)}
            onClick={(e) => handleDirection(e, 1, 0)}
            title="Right"
          >
            <ArrowRight size={28} />
          </button>
        </div>
        <button
          className="p-4 rounded-full border-2 border-neon-blue text-neon-blue box-glow-blue active:bg-neon-blue active:text-black transition-all duration-300 touch-none"
          onTouchStart={(e) => handleDirection(e, 0, 1)}
          onClick={(e) => handleDirection(e, 0, 1)}
          title="Down"
        >
          <ArrowDown size={28} />
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-gray-400 text-sm text-center tracking-wide space-y-2">
        <p>USE <span className="text-neon-pink font-semibold">ARROW KEYS</span> OR <span className="text-neon-pink font-semibold">WASD</span> TO MOVE</p>
        <p>PRESS <span className="text-neon-blue font-semibold">SPACE</span> TO PAUSE / RESUME</p>
      </div>
    </div>
  );
}
