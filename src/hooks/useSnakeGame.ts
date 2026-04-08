import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // UP
const BASE_SPEED = 150; // ms

export type GameStatus = 'IDLE' | 'PLAYING' | 'GAME_OVER';

export interface Position {
  x: number;
  y: number;
}

const generateFood = (snake: Position[]): Position => {
  let newFood: Position;
  let isOccupied = true;
  let attempts = 0;
  while (isOccupied && attempts < 1000) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    isOccupied = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    attempts++;
  }
  return newFood! || { x: 0, y: 0 };
};

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('snake_high_score');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(direction);
  
  // Track direction changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setStatus('PLAYING');
  }, []);

  const gameOver = useCallback(() => {
    setStatus('GAME_OVER');
  }, []);

  useEffect(() => {
    if (status === 'GAME_OVER') {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('snake_high_score', score.toString());
      }
    }
  }, [status, score, highScore]);

  const moveSnake = useCallback(() => {
    if (status !== 'PLAYING') return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + nextDirectionRef.current.x,
        y: head.y + nextDirectionRef.current.y,
      };
      
      // Update the current direction reference after applying it
      setDirection(nextDirectionRef.current);

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
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
        setScore((s) => s + 1);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [status, food, gameOver]);

  // Game loop
  useEffect(() => {
    if (status !== 'PLAYING') return;
    
    // Speed increases slightly as score goes up, min speed 50ms
    const speed = Math.max(60, BASE_SPEED - score * 3);
    const interval = setInterval(moveSnake, speed);
    
    return () => clearInterval(interval);
  }, [status, moveSnake, score]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'PLAYING') {
        if (e.key === 'Enter' || e.key === ' ') {
          startGame();
        }
        return;
      }

      const { x, y } = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, startGame]);

  // Mobile controls
  const handleControl = useCallback((dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (status !== 'PLAYING') return;
    const { x, y } = directionRef.current;
    
    switch (dir) {
      case 'UP':
        if (y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
        break;
      case 'DOWN':
        if (y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
        break;
      case 'LEFT':
        if (x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
        break;
      case 'RIGHT':
        if (x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
        break;
    }
  }, [status]);

  return {
    snake,
    food,
    status,
    score,
    highScore,
    gridSize: GRID_SIZE,
    startGame,
    handleControl
  };
};
