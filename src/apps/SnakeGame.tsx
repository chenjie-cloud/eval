import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [[10, 10]];
const INITIAL_DIRECTION = [0, -1]; // Up
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<number[][]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<number[]>(INITIAL_DIRECTION);
  const [food, setFood] = useState<number[]>([5, 5]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(INITIAL_DIRECTION);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: number[][]): number[] => {
    let newFood: number[];
    while (true) {
      newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE)
      ];
      // Check if food is on snake
      const isOnSnake = currentSnake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setFood(generateFood(INITIAL_SNAKE));
    containerRef.current?.focus();
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    if (!isPlaying || isGameOver) return;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        if (directionRef.current[1] !== 1) setDirection([0, -1]);
        break;
      case 'ArrowDown':
      case 's':
        if (directionRef.current[1] !== -1) setDirection([0, 1]);
        break;
      case 'ArrowLeft':
      case 'a':
        if (directionRef.current[0] !== 1) setDirection([-1, 0]);
        break;
      case 'ArrowRight':
      case 'd':
        if (directionRef.current[0] !== -1) setDirection([1, 0]);
        break;
    }
  }, [isPlaying, isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        const newHead = [head[0] + currentDir[0], head[1] + currentDir[1]];

        // Wall collision
        if (
          newHead[0] < 0 || newHead[0] >= GRID_SIZE ||
          newHead[1] < 0 || newHead[1] >= GRID_SIZE
        ) {
          setIsGameOver(true);
          setIsPlaying(false);
          setHighScore(prev => Math.max(prev, score));
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
          setIsGameOver(true);
          setIsPlaying(false);
          setHighScore(prev => Math.max(prev, score));
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, Math.max(50, INITIAL_SPEED - score * 2));
    return () => clearInterval(intervalId);
  }, [isPlaying, isGameOver, food, score, generateFood]);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center w-full h-full bg-[#1e293b] text-white p-4 font-mono outline-none"
      tabIndex={0}
    >
      <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Score</span>
              <span className="text-2xl font-bold text-emerald-400">{score}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Best</span>
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xl font-bold text-amber-400">{highScore}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isGameOver}
              className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button 
              onClick={resetGame}
              className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
              title="Restart"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div className="relative aspect-square w-full bg-[#0f172a] p-4">
          <div 
            className="w-full h-full grid gap-[1px] bg-slate-800 border-2 border-slate-700 rounded-sm"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              
              const isSnakeHead = snake[0][0] === x && snake[0][1] === y;
              const isSnakeBody = snake.some((segment, idx) => idx !== 0 && segment[0] === x && segment[1] === y);
              const isFood = food[0] === x && food[1] === y;

              let className = "w-full h-full rounded-[1px] ";
              if (isSnakeHead) className += "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] z-10 scale-110";
              else if (isSnakeBody) className += "bg-emerald-500/80";
              else if (isFood) className += "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] rounded-full scale-75 animate-pulse";
              else className += "bg-transparent";

              return <div key={i} className={className} />;
            })}
          </div>

          {/* Overlays */}
          {(!isPlaying && !isGameOver && score === 0) && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
              <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700 text-center max-w-[80%]">
                <h2 className="text-2xl font-bold text-white mb-2">Snake</h2>
                <p className="text-slate-400 mb-6">Use arrow keys or WASD to move. Eat the red dots to grow.</p>
                <button 
                  onClick={resetGame}
                  className="w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/30"
                >
                  Start Game
                </button>
              </div>
            </div>
          )}

          {isGameOver && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-rose-500/30 text-center max-w-[80%] transform scale-100 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-rose-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
                <p className="text-slate-400 mb-6">You scored <span className="text-emerald-400 font-bold">{score}</span> points.</p>
                <button 
                  onClick={resetGame}
                  className="w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Play Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer controls hint */}
        <div className="p-3 bg-slate-900 border-t border-slate-700 text-center text-xs text-slate-500">
          Click the game area and use <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 mx-1">↑</kbd><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 mx-1">↓</kbd><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 mx-1">←</kbd><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 mx-1">→</kbd> to play
        </div>
      </div>
    </div>
  );
}
