import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, highScore }) => {
  return (
    <div className="flex justify-between items-center w-full max-w-md mx-auto mb-8 px-6 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      
      {/* Current Score */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-indigo-300 font-medium text-sm tracking-widest uppercase mb-1">
          <Star className="w-4 h-4" />
          <span>Score</span>
        </div>
        <motion.div 
          key={score}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]"
        >
          {score}
        </motion.div>
      </div>

      {/* Divider */}
      <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

      {/* High Score */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-pink-300 font-medium text-sm tracking-widest uppercase mb-1">
          <Trophy className="w-4 h-4" />
          <span>Best</span>
        </div>
        <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500 drop-shadow-[0_0_10px_rgba(244,114,182,0.5)]">
          {highScore}
        </div>
      </div>
      
    </div>
  );
};
