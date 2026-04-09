import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Gem as GemComponent } from './Gem';
import type { GemData, FloatingScore } from '../hooks/useGameLogic';
import { GRID_SIZE } from '../hooks/useGameLogic';

interface GameBoardProps {
  board: GemData[][];
  onSwap: (r1: number, c1: number, r2: number, c2: number) => void;
  isProcessing?: boolean;
  floatingScores?: FloatingScore[];
}

export const GameBoard: React.FC<GameBoardProps> = ({ board, onSwap, isProcessing, floatingScores = [] }) => {
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);

  const handleGemClick = (r: number, c: number) => {
    if (isProcessing) return;

    if (!selected) {
      setSelected({ r, c });
      return;
    }

    const rDiff = Math.abs(selected.r - r);
    const cDiff = Math.abs(selected.c - c);

    if (rDiff === 0 && cDiff === 0) {
      setSelected(null);
      return;
    }

    const isAdjacent = (rDiff === 1 && cDiff === 0) || (rDiff === 0 && cDiff === 1);

    if (isAdjacent) {
      onSwap(selected.r, selected.c, r, c);
      setSelected(null);
    } else {
      setSelected({ r, c });
    }
  };

  const handleSwipe = (r: number, c: number, direction: 'up' | 'down' | 'left' | 'right') => {
    if (isProcessing) return;
    
    let targetR = r;
    let targetC = c;

    if (direction === 'up') targetR -= 1;
    if (direction === 'down') targetR += 1;
    if (direction === 'left') targetC -= 1;
    if (direction === 'right') targetC += 1;

    if (targetR >= 0 && targetR < GRID_SIZE && targetC >= 0 && targetC < GRID_SIZE) {
      onSwap(r, c, targetR, targetC);
      setSelected(null);
    }
  };

  return (
    <div className="relative p-4 md:p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50 blur-2xl pointer-events-none" />
      
      <div 
        className="relative grid gap-1.5 md:gap-2 w-full max-w-[320px] md:max-w-[480px] mx-auto"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          aspectRatio: '1 / 1'
        }}
      >
        {/* Background Grid */}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <div 
            key={`bg-${i}`} 
            className="w-full h-full bg-black/20 rounded-xl"
            style={{
              gridRow: Math.floor(i / GRID_SIZE) + 1,
              gridColumn: (i % GRID_SIZE) + 1,
            }}
          />
        ))}

        {/* Gems Layer */}
        <AnimatePresence>
          {board.flatMap((row, r) =>
            row.map((gem, c) => {
              if (!gem) return null;
              return (
                <GemComponent
                  key={gem.id}
                  type={gem.type}
                  r={r}
                  c={c}
                  isSelected={selected?.r === r && selected?.c === c}
                  onClick={() => handleGemClick(r, c)}
                  onSwipe={(dir) => handleSwipe(r, c, dir)}
                  isProcessing={isProcessing}
                />
              );
            })
          )}
        </AnimatePresence>

        {/* Render floating scores */}
        <AnimatePresence>
          {floatingScores.map(score => (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1.5, y: -50 }}
              exit={{ opacity: 0, scale: 2, y: -100 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute pointer-events-none z-50 font-black text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] text-white"
              style={{
                left: `calc(${(score.c / GRID_SIZE) * 100}% + ${50 / GRID_SIZE}%)`,
                top: `calc(${(score.r / GRID_SIZE) * 100}% + ${50 / GRID_SIZE}%)`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              +{score.score}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
