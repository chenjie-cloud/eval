import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export const useGameLoop = () => {
  const { status, speed, moveSnake } = useGameStore();
  const savedCallback = useRef<() => void>();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = moveSnake;
  }, [moveSnake]);

  // Set up the interval
  useEffect(() => {
    if (status !== 'playing') return;

    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    const id = setInterval(tick, speed);
    return () => clearInterval(id);
  }, [status, speed]);
};
