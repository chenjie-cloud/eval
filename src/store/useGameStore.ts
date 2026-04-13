import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Point = { x: number; y: number };
export type Direction = { x: number; y: number };
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 200; // ms per tick
export const MIN_SPEED = 50;
export const SPEED_INCREMENT = 5; // how much to decrease interval

export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION: Direction = { x: 0, y: -1 }; // up (y decreases upwards)

interface GameState {
  snake: Point[];
  direction: Direction;
  directionQueue: Direction[];
  food: Point;
  status: GameStatus;
  score: number;
  highScore: number;
  speed: number;

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  setDirection: (dir: Direction) => void;
  moveSnake: () => void;
  resetGame: () => void;
}

const generateFood = (snake: Point[]): Point => {
  if (snake.length >= GRID_SIZE * GRID_SIZE) {
    return { x: -1, y: -1 }; // No space left
  }

  let newFood: Point = { x: 0, y: 0 };
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    isOccupied = snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    );
  }
  return newFood;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      snake: INITIAL_SNAKE,
      direction: INITIAL_DIRECTION,
      directionQueue: [],
      food: { x: 5, y: 5 }, // initial dummy food
      status: 'idle',
      score: 0,
      highScore: 0,
      speed: INITIAL_SPEED,

      startGame: () => {
        const { highScore } = get();
        const newSnake = INITIAL_SNAKE;
        set({
          snake: newSnake,
          direction: INITIAL_DIRECTION,
          directionQueue: [],
          food: generateFood(newSnake),
          status: 'playing',
          score: 0,
          highScore: highScore,
          speed: INITIAL_SPEED,
        });
      },

      pauseGame: () => {
        const { status } = get();
        if (status === 'playing') {
          set({ status: 'paused' });
        }
      },

      resumeGame: () => {
        const { status } = get();
        if (status === 'paused') {
          set({ status: 'playing' });
        }
      },

      setDirection: (dir: Direction) => {
        const { direction, directionQueue, status } = get();
        if (status !== 'playing') return;

        // Limit queue size to prevent massive buffering
        if (directionQueue.length >= 2) return;

        // The direction we are currently heading (or will head after pending turns)
        const currentHeading = directionQueue.length > 0 
          ? directionQueue[directionQueue.length - 1] 
          : direction;

        // Prevent reversing direction
        if (currentHeading.x + dir.x === 0 && currentHeading.y + dir.y === 0) {
          return;
        }

        // Prevent redundant direction commands
        if (currentHeading.x === dir.x && currentHeading.y === dir.y) {
          return;
        }

        set({ directionQueue: [...directionQueue, dir] });
      },

      moveSnake: () => {
        const state = get();
        if (state.status !== 'playing') return;

        const { snake, directionQueue, direction, food, score, speed, highScore } = state;
        
        // Process next direction from queue
        let nextDirection = direction;
        let newQueue = directionQueue;
        if (directionQueue.length > 0) {
          nextDirection = directionQueue[0];
          newQueue = directionQueue.slice(1);
        }

        const head = snake[0];
        const newHead = {
          x: head.x + nextDirection.x,
          y: head.y + nextDirection.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          set({
            status: 'gameover',
            highScore: Math.max(score, highScore),
          });
          return;
        }

        // Check self collision
        // If we move forward and don't eat, the tail segment will leave its current cell.
        // So colliding with the tail cell is not a collision unless we also ate food in that same tick
        // But food and tail cannot be in the same cell. So we check against all segments except the last one.
        const isSelfCollision = snake.some((segment, index) => {
          if (index === snake.length - 1) return false;
          return segment.x === newHead.x && segment.y === newHead.y;
        });

        if (isSelfCollision) {
          set({
            status: 'gameover',
            highScore: Math.max(score, highScore),
          });
          return;
        }

        const newSnake = [newHead, ...snake];
        let newScore = score;
        let newSpeed = speed;
        let newFood = food;

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          newScore += 10;
          newFood = generateFood(newSnake);
          newSpeed = Math.max(MIN_SPEED, speed - SPEED_INCREMENT);
        } else {
          newSnake.pop(); // Remove tail
        }

        set({
          snake: newSnake,
          direction: nextDirection,
          directionQueue: newQueue,
          score: newScore,
          food: newFood,
          speed: newSpeed,
          highScore: Math.max(newScore, highScore),
        });
      },

      resetGame: () => {
        set({
          snake: INITIAL_SNAKE,
          direction: INITIAL_DIRECTION,
          directionQueue: [],
          status: 'idle',
          score: 0,
          speed: INITIAL_SPEED,
        });
      },
    }),
    {
      name: 'snake-game-storage',
      partialize: (state) => ({ highScore: state.highScore }),
    }
  )
);
