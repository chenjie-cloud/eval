import { useState, useEffect, useCallback, useRef } from 'react';

export type Position = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const BASE_SPEED = 150;

const getRandomPosition = (snake: Position[]): Position => {
  let newPos: Position;
  let isOccupied = true;
  while (isOccupied) {
    newPos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some((segment) => segment.x === newPos.x && segment.y === newPos.y);
  }
  return newPos!;
};

export const useSnake = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const directionRef = useRef(direction);
  
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(getRandomPosition(INITIAL_SNAKE));
    setScore(0);
    setStatus('PLAYING');
  }, []);

  const pauseGame = useCallback(() => {
    setStatus((prev) => (prev === 'PLAYING' ? 'PAUSED' : 'PLAYING'));
  }, []);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };
      const currentDirection = directionRef.current;

      switch (currentDirection) {
        case 'UP':
          newHead.y -= 1;
          break;
        case 'DOWN':
          newHead.y += 1;
          break;
        case 'LEFT':
          newHead.x -= 1;
          break;
        case 'RIGHT':
          newHead.x += 1;
          break;
      }

      // Check collision with walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setStatus('GAME_OVER');
        return prevSnake;
      }

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus('GAME_OVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      let foodEaten = false;
      setFood((prevFood) => {
        if (newHead.x === prevFood.x && newHead.y === prevFood.y) {
          foodEaten = true;
          setScore((s) => s + 10);
          return getRandomPosition(newSnake);
        }
        return prevFood;
      });

      if (!foodEaten) {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, []);

  useEffect(() => {
    if (status === 'GAME_OVER') {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('snakeHighScore', score.toString());
      }
    }
  }, [status, score, highScore]);

  useEffect(() => {
    let intervalId: number;
    if (status === 'PLAYING') {
      const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
      intervalId = window.setInterval(moveSnake, speed);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status, moveSnake, score]);

  const changeDirection = useCallback((newDir: Direction) => {
    const currentDir = directionRef.current;
    if (status !== 'PLAYING') return;

    if (
      (currentDir === 'UP' && newDir === 'DOWN') ||
      (currentDir === 'DOWN' && newDir === 'UP') ||
      (currentDir === 'LEFT' && newDir === 'RIGHT') ||
      (currentDir === 'RIGHT' && newDir === 'LEFT')
    ) {
      return;
    }

    setDirection(newDir);
  }, [status]);

  return {
    snake,
    food,
    direction,
    status,
    score,
    highScore,
    gridSize: GRID_SIZE,
    startGame,
    pauseGame,
    changeDirection,
  };
};
