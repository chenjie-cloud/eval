import { useSnakeGame } from '@/hooks/useSnakeGame';
import { Play, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Home() {
  const {
    snake,
    food,
    status,
    score,
    highScore,
    gridSize,
    startGame,
    handleControl,
  } = useSnakeGame();

  // Create grid array
  const grid = Array.from({ length: gridSize * gridSize }, (_, i) => ({
    x: i % gridSize,
    y: Math.floor(i / gridSize),
  }));

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 font-mono text-green-400 overflow-hidden selection:bg-green-500/30">
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-neutral-950/90 to-neutral-950 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center space-y-6">
        
        {/* Header Section */}
        <div className="w-full flex justify-between items-center bg-neutral-900/60 border border-green-500/30 p-4 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.1)] backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-xs text-green-500/70 uppercase tracking-widest">Score</span>
            <span className="text-3xl font-bold text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">{score}</span>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-xs text-green-500/70 uppercase tracking-widest flex items-center gap-1">
              <Trophy size={12} className="text-yellow-400" />
              High Score
            </span>
            <span className="text-2xl font-bold text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">{highScore}</span>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative w-full aspect-square bg-neutral-900/80 border border-green-500/40 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.15)]">
          
          {/* Grid Pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#22c55e_1px,transparent_1px),linear-gradient(to_bottom,#22c55e_1px,transparent_1px)]" 
               style={{ backgroundSize: `${100 / gridSize}% ${100 / gridSize}%` }} />

          {/* Snake & Food Renderer */}
          {grid.map((cell) => {
            const isFood = food.x === cell.x && food.y === cell.y;
            const snakeIndex = snake.findIndex((s) => s.x === cell.x && s.y === cell.y);
            const isSnake = snakeIndex !== -1;
            const isHead = snakeIndex === 0;

            if (!isFood && !isSnake) return null;

            return (
              <div
                key={`${cell.x}-${cell.y}`}
                className="absolute transition-all duration-75"
                style={{
                  width: `${100 / gridSize}%`,
                  height: `${100 / gridSize}%`,
                  left: `${(cell.x / gridSize) * 100}%`,
                  top: `${(cell.y / gridSize) * 100}%`,
                }}
              >
                {isFood && (
                  <div className="w-full h-full p-[2px]">
                    <div className="w-full h-full bg-pink-500 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.9)] animate-pulse" />
                  </div>
                )}
                {isSnake && (
                  <div className={`w-full h-full p-[1px]`}>
                    <div className={`w-full h-full bg-green-500 ${isHead ? 'rounded-sm shadow-[0_0_15px_rgba(34,197,94,1)] bg-green-400' : 'rounded-sm opacity-80 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Overlays */}
          {status !== 'PLAYING' && (
            <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              {status === 'GAME_OVER' && (
                <div className="mb-8 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                  <h2 className="text-4xl sm:text-5xl font-bold text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.9)] tracking-widest mb-3">SYSTEM_FAILURE</h2>
                  <p className="text-green-400 text-lg">Final Score: {score}</p>
                </div>
              )}
              
              <button
                onClick={startGame}
                className="group relative px-8 py-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/50 hover:border-green-400 rounded-lg flex items-center gap-3 transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] hover:scale-105"
              >
                {status === 'GAME_OVER' ? (
                  <>
                    <RotateCcw className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-700" />
                    <span className="tracking-widest font-bold">REBOOT_SYSTEM</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <span className="tracking-widest font-bold">INITIALIZE_PROGRAM</span>
                  </>
                )}
                
                {/* Button corner accents */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              {status === 'IDLE' && (
                <p className="mt-8 text-sm text-green-500/60 animate-pulse tracking-widest">PRESS [SPACE] TO START</p>
              )}
            </div>
          )}
        </div>

        {/* Mobile Controls (visible on small screens) */}
        <div className="w-full sm:hidden grid grid-cols-3 gap-2 p-4 bg-neutral-900/60 rounded-xl border border-green-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div />
          <ControlBtn onClick={() => handleControl('UP')} icon={<ArrowUp size={28} />} />
          <div />
          <ControlBtn onClick={() => handleControl('LEFT')} icon={<ArrowLeft size={28} />} />
          <ControlBtn onClick={() => handleControl('DOWN')} icon={<ArrowDown size={28} />} />
          <ControlBtn onClick={() => handleControl('RIGHT')} icon={<ArrowRight size={28} />} />
        </div>

        <div className="hidden sm:block text-sm text-green-500/40 text-center mt-4 tracking-wider">
          Use W A S D or Arrow Keys to navigate the mainframe.
        </div>
      </div>
    </div>
  );
}

function ControlBtn({ onClick, icon }: { onClick: () => void, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className="bg-neutral-800/80 hover:bg-neutral-700 active:bg-green-900/60 border border-green-500/30 p-6 rounded-lg flex items-center justify-center text-green-500 active:text-green-300 active:shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-all touch-manipulation"
    >
      {icon}
    </button>
  );
}
