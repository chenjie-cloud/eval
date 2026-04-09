import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // UP

export const useSnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snakeHighScore')) || 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Use a ref to store the latest processed direction to prevent rapid reverse key presses
  const directionRef = useRef(direction);
  // Next direction queue
  const nextDirectionRef = useRef(direction);

  const generateFood = useCallback((currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  }, [generateFood]);

  // Initialize food on mount
  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, [generateFood]);

  // Handle high score updates
  useEffect(() => {
    if (gameOver) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('snakeHighScore', score.toString());
      }
    }
  }, [gameOver, score, highScore]);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      const currentDir = directionRef.current;
      let newDir = null;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) newDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) newDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) newDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) newDir = { x: 1, y: 0 };
          break;
        case ' ': // Space to pause
          setIsPaused(p => !p);
          break;
        default:
          break;
      }

      if (newDir) {
        // Only update if it's a valid move (not opposite of current moving direction)
        // This prevents the bug where rapid keystrokes can cause the snake to reverse into itself
        const isOpposite = (newDir.x === -currentDir.x && newDir.x !== 0) || 
                           (newDir.y === -currentDir.y && newDir.y !== 0);
        if (!isOpposite) {
          nextDirectionRef.current = newDir;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        // Update the actual direction being processed
        directionRef.current = nextDirectionRef.current;
        const currentDir = directionRef.current;

        const head = prevSnake[0];
        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        const isSelfCollision = prevSnake.some(
          (segment, index) => {
            // If the new head hits any part of the body (excluding the tail if we aren't eating)
            // But we don't know if we are eating yet. To be safe, check all but the last segment
            // because the tail will move forward.
            if (index === prevSnake.length - 1) return false;
            return segment.x === newHead.x && segment.y === newHead.y;
          }
        );

        if (isSelfCollision) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 150); // Speed: 150ms per move
    return () => clearInterval(interval);
  }, [gameOver, isPaused, food, generateFood]);

  return {
    snake,
    food,
    score,
    highScore,
    gameOver,
    isPaused,
    GRID_SIZE,
    resetGame,
  };
};
