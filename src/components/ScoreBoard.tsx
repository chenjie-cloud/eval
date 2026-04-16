import React from 'react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, highScore }) => {
  return (
    <div className="flex justify-between w-full max-w-[400px] mb-6 px-6 py-4 bg-[#0b0914] border border-[#00f3ff]/30 rounded-xl backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <span className="text-[#00f3ff] text-xs uppercase tracking-widest mb-1 opacity-70 font-mono">Score</span>
        <span className="text-3xl font-bold text-[#00f3ff] neon-text-cyan font-mono">{score}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[#ff003c] text-xs uppercase tracking-widest mb-1 opacity-70 font-mono">Best</span>
        <span className="text-3xl font-bold text-[#ff003c] neon-text-pink font-mono">{highScore}</span>
      </div>
    </div>
  );
};
