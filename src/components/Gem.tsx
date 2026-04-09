import { motion } from 'framer-motion';
import { Diamond, Star, Heart, Hexagon, Circle, Triangle } from 'lucide-react';
import type { GemType } from '../hooks/useGameLogic';

interface GemProps {
  type: GemType;
  onClick?: () => void;
  onSwipe?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  isProcessing?: boolean;
  r?: number;
  c?: number;
  isSelected?: boolean;
}

const gemConfig: Record<GemType, { icon: React.FC<any>, color: string, bg: string, shadow: string }> = {
  gem1: { icon: Diamond, color: 'text-blue-400', bg: 'bg-blue-400/20', shadow: 'shadow-blue-400/50' },
  gem2: { icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/20', shadow: 'shadow-yellow-400/50' },
  gem3: { icon: Heart, color: 'text-red-400', bg: 'bg-red-400/20', shadow: 'shadow-red-400/50' },
  gem4: { icon: Hexagon, color: 'text-purple-400', bg: 'bg-purple-400/20', shadow: 'shadow-purple-400/50' },
  gem5: { icon: Circle, color: 'text-green-400', bg: 'bg-green-400/20', shadow: 'shadow-green-400/50' },
  gem6: { icon: Triangle, color: 'text-orange-400', bg: 'bg-orange-400/20', shadow: 'shadow-orange-400/50' },
};

export const Gem: React.FC<GemProps> = ({ type, onClick, onSwipe, isProcessing, r, c, isSelected }) => {
  const { icon: Icon, color, bg } = gemConfig[type];

  const handleDragEnd = (event: any, info: any) => {
    if (isProcessing) return;
    
    const { offset } = info;
    const absX = Math.abs(offset.x);
    const absY = Math.abs(offset.y);
    
    if (absX > 20 || absY > 20) {
      if (absX > absY) {
        onSwipe?.(offset.x > 0 ? 'right' : 'left');
      } else {
        onSwipe?.(offset.y > 0 ? 'down' : 'up');
      }
    }
  };

  const gridStyle = r !== undefined && c !== undefined ? {
    gridRow: r + 1,
    gridColumn: c + 1,
    zIndex: isSelected ? 10 : 1,
  } : {};

  return (
    <motion.div
      layout
      drag={!isProcessing}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.5, opacity: 0, y: -50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 1.5, opacity: 0, filter: 'brightness(2)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onPointerDown={() => !isProcessing && onClick && onClick()}
      style={gridStyle}
      className={`w-full h-full rounded-xl flex items-center justify-center cursor-pointer 
        ${bg} border border-white/10 backdrop-blur-sm
        shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]
        transition-colors duration-300 relative overflow-hidden
        ${isSelected ? 'ring-2 ring-white shadow-[0_0_15px_rgba(255,255,255,0.8)] scale-110' : ''}`}
      whileHover={{ scale: isProcessing ? 1 : 1.1 }}
      whileTap={{ scale: isProcessing ? 1 : 0.9 }}
    >
      <div className={`absolute inset-0 opacity-20 bg-gradient-to-tr from-transparent to-white/50 mix-blend-overlay pointer-events-none`} />
      <Icon className={`w-3/5 h-3/5 ${color} drop-shadow-[0_0_8px_currentColor]`} strokeWidth={2.5} />
    </motion.div>
  );
};
