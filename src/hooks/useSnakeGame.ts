import { useState, useEffect, useCallback, useRef } from 'react';

export type Point = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 }; // UP

const getRandomFood = (snake: Point[]): Point => {
  if (snake.length >= GRID_SIZE * GRID_SIZE) {
    return { x: -1, y: -1 }; // Game won
  }
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Check if food is on snake
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [status, setStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  
  const directionRef = useRef(direction);
  const nextDirectionRef = useRef<Point | null>(null);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = null;
    const initialFood = getRandomFood(INITIAL_SNAKE);
    setFood(initialFood);
    foodRef.current = initialFood;
    setStatus('playing');
    setScore(0);
  }, []);

  const pauseGame = useCallback(() => {
    setStatus(prev => prev === 'playing' ? 'paused' : prev);
  }, []);

  const resumeGame = useCallback(() => {
    setStatus(prev => prev === 'paused' ? 'playing' : prev);
  }, []);

  const changeDirection = useCallback((newDir: Direction) => {
    let nextDir: Point;
    switch (newDir) {
      case 'UP': nextDir = { x: 0, y: -1 }; break;
      case 'DOWN': nextDir = { x: 0, y: 1 }; break;
      case 'LEFT': nextDir = { x: -1, y: 0 }; break;
      case 'RIGHT': nextDir = { x: 1, y: 0 }; break;
    }
    
    const currentDir = directionRef.current;
    
    // Prevent 180 degree turns
    if (nextDir.x !== 0 && currentDir.x !== 0) return;
    if (nextDir.y !== 0 && currentDir.y !== 0) return;
    
    nextDirectionRef.current = nextDir;
  }, []);

  // Game Loop
  useEffect(() => {
    if (status !== 'playing') return;

    const moveSnake = () => {
      if (nextDirectionRef.current) {
        setDirection(nextDirectionRef.current);
        directionRef.current = nextDirectionRef.current;
        nextDirectionRef.current = null;
      }

      const currentSnake = snakeRef.current;
      const head = currentSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y
      };

      // Check collision with walls
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setStatus('gameover');
        return;
      }

      const currentFood = foodRef.current;
      const willEat = newHead.x === currentFood.x && newHead.y === currentFood.y;
      
      const bodyToCheck = willEat ? currentSnake : currentSnake.slice(0, -1);

      // Check collision with self
      if (bodyToCheck.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus('gameover');
        return;
      }

      const newSnake = [newHead, ...bodyToCheck];

      if (willEat) {
        setScore(s => s + 10);
        setFood(getRandomFood(newSnake));
      }

      setSnake(newSnake);
    };

    const speed = Math.max(50, 150 - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [status, score]); // Re-run effect when score changes to update speed

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (status === 'playing') {
        switch (e.key) {
          case 'ArrowUp': case 'w': case 'W': changeDirection('UP'); break;
          case 'ArrowDown': case 's': case 'S': changeDirection('DOWN'); break;
          case 'ArrowLeft': case 'a': case 'A': changeDirection('LEFT'); break;
          case 'ArrowRight': case 'd': case 'D': changeDirection('RIGHT'); break;
          case 'Escape': case ' ': pauseGame(); break;
        }
      } else if (status === 'paused' && (e.key === ' ' || e.key === 'Escape')) {
        resumeGame();
      } else if ((status === 'idle' || status === 'gameover') && e.key === 'Enter') {
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, changeDirection, pauseGame, resumeGame, startGame]);

  return {
    snake,
    food,
    status,
    score,
    gridSize: GRID_SIZE,
    startGame,
    pauseGame,
    resumeGame,
    changeDirection
  };
};
