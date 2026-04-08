import { useState, useEffect, useCallback, useRef } from 'react';

export type Point = { x: number; y: number };
export type GameState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface UseSnakeGameProps {
  gridSize?: number;
  initialSpeed?: number;
}

const getInitialSnake = (gridSize: number): Point[] => [
  { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) },
];

const getRandomFood = (gridSize: number, snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export const useSnakeGame = ({ gridSize = 20, initialSpeed = 150 }: UseSnakeGameProps = {}) => {
  const [snake, setSnake] = useState<Point[]>(getInitialSnake(gridSize));
  const [food, setFood] = useState<Point>({ x: 5, y: 5 }); // Temp initialization
  const [direction, setDirection] = useState<Direction>('UP');
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [speed, setSpeed] = useState(initialSpeed);

  const directionRef = useRef<Direction>('UP');
  const nextDirectionRef = useRef<Direction>('UP');
  
  // Ensure food is initialized properly after mount to avoid SSR mismatch if any
  useEffect(() => {
    if (gameState === 'IDLE') {
      setFood(getRandomFood(gridSize, snake));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startGame = useCallback(() => {
    setSnake(getInitialSnake(gridSize));
    setDirection('UP');
    directionRef.current = 'UP';
    nextDirectionRef.current = 'UP';
    setScore(0);
    setGameState('PLAYING');
    setFood(getRandomFood(gridSize, getInitialSnake(gridSize)));
    setSpeed(initialSpeed);
  }, [gridSize, initialSpeed]);

  const pauseGame = useCallback(() => {
    if (gameState === 'PLAYING') setGameState('PAUSED');
    else if (gameState === 'PAUSED') setGameState('PLAYING');
  }, [gameState]);

  const gameOver = useCallback(() => {
    setGameState('GAME_OVER');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  const moveSnake = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      directionRef.current = nextDirectionRef.current;
      const currentDir = directionRef.current;

      const newHead = { ...head };

      if (currentDir === 'UP') newHead.y -= 1;
      if (currentDir === 'DOWN') newHead.y += 1;
      if (currentDir === 'LEFT') newHead.x -= 1;
      if (currentDir === 'RIGHT') newHead.x += 1;

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= gridSize ||
        newHead.y < 0 ||
        newHead.y >= gridSize
      ) {
        gameOver();
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(getRandomFood(gridSize, newSnake));
        setSpeed((s) => Math.max(s - 2, 50)); // Increase speed slightly
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [gameState, gridSize, food, gameOver]);

  // Game loop
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (gameState === 'PLAYING') {
      intervalId = setInterval(moveSnake, speed);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gameState, moveSnake, speed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && (gameState === 'PLAYING' || gameState === 'PAUSED')) {
        pauseGame();
        return;
      }

      if (gameState !== 'PLAYING') return;

      const currentDir = directionRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && currentDir !== 'DOWN') {
        nextDirectionRef.current = 'UP';
      } else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && currentDir !== 'UP') {
        nextDirectionRef.current = 'DOWN';
      } else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && currentDir !== 'RIGHT') {
        nextDirectionRef.current = 'LEFT';
      } else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && currentDir !== 'LEFT') {
        nextDirectionRef.current = 'RIGHT';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, pauseGame]);

  // Expose manual change direction for mobile/touch UI
  const changeDirection = useCallback((dir: Direction) => {
    if (gameState !== 'PLAYING') return;
    const currentDir = directionRef.current;
    if (dir === 'UP' && currentDir !== 'DOWN') nextDirectionRef.current = 'UP';
    if (dir === 'DOWN' && currentDir !== 'UP') nextDirectionRef.current = 'DOWN';
    if (dir === 'LEFT' && currentDir !== 'RIGHT') nextDirectionRef.current = 'LEFT';
    if (dir === 'RIGHT' && currentDir !== 'LEFT') nextDirectionRef.current = 'RIGHT';
  }, [gameState]);

  return {
    snake,
    food,
    direction: directionRef.current,
    gameState,
    score,
    highScore,
    gridSize,
    startGame,
    pauseGame,
    changeDirection
  };
};