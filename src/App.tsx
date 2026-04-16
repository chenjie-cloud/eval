import React, { useEffect } from 'react';
import { useSnake } from './hooks/useSnake';
import { GameBoard } from './components/GameBoard';
import { ScoreBoard } from './components/ScoreBoard';
import { Controls } from './components/Controls';
import { Terminal } from 'lucide-react';

function App() {
  const {
    snake,
    food,
    status,
    score,
    highScore,
    gridSize,
    startGame,
    pauseGame,
    changeDirection,
  } = useSnake();

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
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection('RIGHT');
          break;
        case ' ':
          if (status === 'PLAYING' || status === 'PAUSED') {
            pauseGame();
          } else if (status === 'IDLE' || status === 'GAME_OVER') {
            startGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, pauseGame, startGame, status]);

  return (
    <div className="min-h-screen bg-[#0b0914] flex flex-col items-center justify-center py-8 px-4 font-sans selection:bg-[#ff003c]/30">
      <div className="mb-8 flex items-center gap-3">
        <Terminal className="text-[#00f3ff]" size={36} strokeWidth={1.5} />
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#ff003c] neon-text-cyan tracking-widest uppercase">
          CYBER SNAKE
        </h1>
      </div>

      <ScoreBoard score={score} highScore={highScore} />

      <div className="relative">
        <GameBoard snake={snake} food={food} gridSize={gridSize} />
        
        {/* Game Over Overlay */}
        {status === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-[#0b0914]/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-20">
            <h2 className="text-3xl font-bold text-[#ff003c] neon-text-pink mb-2 tracking-widest">SYSTEM FAILURE</h2>
            <p className="text-[#00f3ff] mb-8 font-mono text-lg opacity-80">Final Score: {score}</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-[#ff003c]/10 border border-[#ff003c] rounded text-[#ff003c] font-bold hover:bg-[#ff003c]/30 neon-box-pink transition-all uppercase tracking-widest"
            >
              Reboot System
            </button>
          </div>
        )}
      </div>

      <Controls 
        status={status} 
        startGame={startGame} 
        pauseGame={pauseGame} 
        changeDirection={changeDirection} 
      />
    </div>
  );
}

export default App;
