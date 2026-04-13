import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore, INITIAL_SNAKE, INITIAL_DIRECTION, GRID_SIZE } from '../src/store/useGameStore';

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('initializes correctly', () => {
    const state = useGameStore.getState();
    expect(state.status).toBe('idle');
    expect(state.snake).toEqual(INITIAL_SNAKE);
    expect(state.direction).toEqual(INITIAL_DIRECTION);
  });

  it('starts the game', () => {
    useGameStore.getState().startGame();
    const state = useGameStore.getState();
    expect(state.status).toBe('playing');
    expect(state.score).toBe(0);
    // initial snake length is 3
    expect(state.snake.length).toBe(3);
  });

  it('moves the snake', () => {
    useGameStore.getState().startGame();
    const oldHead = useGameStore.getState().snake[0];
    const oldDir = useGameStore.getState().direction;
    useGameStore.getState().moveSnake();
    const newHead = useGameStore.getState().snake[0];
    
    expect(newHead.x).toBe(oldHead.x + oldDir.x);
    expect(newHead.y).toBe(oldHead.y + oldDir.y);
    // length shouldn't change unless it eats food
    expect(useGameStore.getState().snake.length).toBe(3);
  });

  it('handles game over on wall collision', () => {
    useGameStore.getState().startGame();
    // Force snake to the edge
    useGameStore.setState({ snake: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }] });
    useGameStore.setState({ direction: { x: 0, y: -1 } }); // Moving up into the wall
    useGameStore.getState().moveSnake();
    
    expect(useGameStore.getState().status).toBe('gameover');
  });

  it('handles eating food', () => {
    useGameStore.getState().startGame();
    const state = useGameStore.getState();
    const head = state.snake[0];
    const dir = state.direction;
    const nextPos = { x: head.x + dir.x, y: head.y + dir.y };
    
    // Put food exactly where the snake will move
    useGameStore.setState({ food: nextPos });
    
    useGameStore.getState().moveSnake();
    
    const newState = useGameStore.getState();
    expect(newState.score).toBe(10);
    expect(newState.snake.length).toBe(4);
    expect(newState.food).not.toEqual(nextPos); // food should have respawned
  });

  it('prevents 180 degree turns', () => {
    useGameStore.getState().startGame();
    useGameStore.setState({ direction: { x: 0, y: -1 } }); // moving up
    
    useGameStore.getState().setDirection({ x: 0, y: 1 }); // try to move down
    expect(useGameStore.getState().directionQueue).toEqual([]);
    
    useGameStore.getState().setDirection({ x: -1, y: 0 }); // move left
    expect(useGameStore.getState().directionQueue).toEqual([{ x: -1, y: 0 }]);
  });
});
