import React from 'react';
import { Play, Pause, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Direction, GameStatus } from '../hooks/useSnake';
import clsx from 'clsx';

interface ControlsProps {
  status: GameStatus;
  startGame: () => void;
  pauseGame: () => void;
  changeDirection: (dir: Direction) => void;
}

export const Controls: React.FC<ControlsProps> = ({ status, startGame, pauseGame, changeDirection }) => {
  return (
    <div className="flex flex-col items-center mt-8 gap-6 w-full max-w-[400px]">
      {/* Game Actions */}
      <div className="flex gap-4">
        {status === 'IDLE' || status === 'GAME_OVER' ? (
          <button
            onClick={startGame}
            className="flex items-center gap-2 px-8 py-3 bg-[#00f3ff]/10 border border-[#00f3ff] rounded-lg text-[#00f3ff] font-bold tracking-wider hover:bg-[#00f3ff]/20 neon-box-cyan transition-all"
          >
            <Play size={20} />
            START
          </button>
        ) : (
          <button
            onClick={pauseGame}
            className="flex items-center gap-2 px-8 py-3 bg-[#ff003c]/10 border border-[#ff003c] rounded-lg text-[#ff003c] font-bold tracking-wider hover:bg-[#ff003c]/20 neon-box-pink transition-all"
          >
            {status === 'PAUSED' ? <Play size={20} /> : <Pause size={20} />}
            {status === 'PAUSED' ? 'RESUME' : 'PAUSE'}
          </button>
        )}

        <button
          onClick={startGame}
          disabled={status === 'IDLE'}
          className={clsx(
            "flex items-center gap-2 px-4 py-3 border rounded-lg transition-all",
            status === 'IDLE' 
              ? "opacity-50 cursor-not-allowed border-gray-600 text-gray-500" 
              : "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
          )}
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* D-Pad for Mobile */}
      <div className="grid grid-cols-3 gap-3 mt-4 sm:hidden">
        <div />
        <button 
          onClick={() => changeDirection('UP')}
          className="p-5 bg-white/5 border border-[#00f3ff]/30 rounded-xl active:bg-[#00f3ff]/20 text-[#00f3ff] transition-colors"
        >
          <ChevronUp size={28} />
        </button>
        <div />
        <button 
          onClick={() => changeDirection('LEFT')}
          className="p-5 bg-white/5 border border-[#00f3ff]/30 rounded-xl active:bg-[#00f3ff]/20 text-[#00f3ff] transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
        <button 
          onClick={() => changeDirection('DOWN')}
          className="p-5 bg-white/5 border border-[#00f3ff]/30 rounded-xl active:bg-[#00f3ff]/20 text-[#00f3ff] transition-colors"
        >
          <ChevronDown size={28} />
        </button>
        <button 
          onClick={() => changeDirection('RIGHT')}
          className="p-5 bg-white/5 border border-[#00f3ff]/30 rounded-xl active:bg-[#00f3ff]/20 text-[#00f3ff] transition-colors"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
};
