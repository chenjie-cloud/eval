import { motion } from 'framer-motion';
import { Gamepad2, RotateCcw } from 'lucide-react';
import { GameBoard } from './components/GameBoard';
import { ScoreBoard } from './components/ScoreBoard';
import { useGameLogic } from './hooks/useGameLogic';
import './index.css';

function App() {
  const { board, score, highScore, isProcessing, floatingScores, initializeBoard, swapGems } = useGameLogic();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-black text-white overflow-hidden relative">
      
      {/* Background ambient effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(50,20,80,0.8),_rgba(10,5,20,1)_100%)] z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-600/20 blur-[120px] rounded-full pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row gap-8 lg:gap-16 items-center md:items-start"
      >
        {/* Left side: Info & Controls */}
        <div className="flex-1 flex flex-col items-center md:items-start w-full max-w-md mt-4 md:mt-12">
          
          <div className="flex items-center space-x-3 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.3)] mb-10 tracking-widest uppercase">
            <Gamepad2 size={40} className="text-pink-400" />
            <h1>Match 3</h1>
          </div>
          
          <ScoreBoard score={score} highScore={highScore} />

          <div className="flex flex-col gap-4 w-full mt-6">
            <button 
              onClick={initializeBoard}
              className="group relative w-full py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-white rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(0,0,0,0.3)] overflow-hidden flex justify-center items-center gap-2 active:scale-95 duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
              <span>Restart Game</span>
            </button>
          </div>
          
        </div>

        {/* Right side: Game Board */}
        <div className="flex-1 w-full flex justify-center md:justify-end">
          <GameBoard 
            board={board} 
            onSwap={swapGems} 
            isProcessing={isProcessing} 
            floatingScores={floatingScores} 
          />
        </div>
        
      </motion.div>
    </div>
  );
}

export default App;
