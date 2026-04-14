import type { Direction, EngineState, Grid, Vec } from "./types";
import type { Rng } from "./rng";

export function isOpposite(a: Direction, b: Direction): boolean {
  return (
    (a === "up" && b === "down") ||
    (a === "down" && b === "up") ||
    (a === "left" && b === "right") ||
    (a === "right" && b === "left")
  );
}

export function add(a: Vec, b: Vec): Vec {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function eq(a: Vec, b: Vec): boolean {
  return a.x === b.x && a.y === b.y;
}

export function dirToVec(d: Direction): Vec {
  switch (d) {
    case "up":
      return { x: 0, y: -1 };
    case "down":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
  }
}

export function inBounds(p: Vec, grid: Grid): boolean {
  return p.x >= 0 && p.x < grid.w && p.y >= 0 && p.y < grid.h;
}

export function spawnFood(grid: Grid, snake: ReadonlyArray<Vec>, rng: Rng): Vec {
  const occupied = new Set<string>();
  for (const s of snake) occupied.add(`${s.x},${s.y}`);

  const free: Vec[] = [];
  for (let y = 0; y < grid.h; y++) {
    for (let x = 0; x < grid.w; x++) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) free.push({ x, y });
    }
  }

  if (free.length === 0) return { x: 0, y: 0 };
  return free[rng.nextInt(free.length)];
}

export function createInitialState(grid: Grid, rng: Rng): EngineState {
  const start: Vec = { x: Math.floor(grid.w / 2), y: Math.floor(grid.h / 2) };
  const snake: Vec[] = [start, { x: start.x - 1, y: start.y }, { x: start.x - 2, y: start.y }];
  const food = spawnFood(grid, snake, rng);
  return {
    status: "idle",
    grid,
    snake,
    direction: "right",
    queuedDirection: null,
    food,
    score: 0,
    tick: 0
  };
}

export function queueDirection(state: EngineState, next: Direction): EngineState {
  if (state.queuedDirection) return state;
  if (isOpposite(state.direction, next)) return state;
  return { ...state, queuedDirection: next };
}

export function start(state: EngineState): EngineState {
  if (state.status === "running") return state;
  if (state.status === "over") return { ...state, status: "running" };
  return { ...state, status: "running" };
}

export function pause(state: EngineState): EngineState {
  if (state.status !== "running") return state;
  return { ...state, status: "paused" };
}

export function resume(state: EngineState): EngineState {
  if (state.status !== "paused") return state;
  return { ...state, status: "running" };
}

export function restart(state: EngineState, rng: Rng): EngineState {
  const next = createInitialState(state.grid, rng);
  return { ...next, status: "running" };
}

export function step(state: EngineState, rng: Rng): EngineState {
  if (state.status !== "running") return state;

  const nextDirection =
    state.queuedDirection && !isOpposite(state.direction, state.queuedDirection)
      ? state.queuedDirection
      : state.direction;
  const head = state.snake[0];
  const nextHead = add(head, dirToVec(nextDirection));

  const willEat = eq(nextHead, state.food);
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
  const hitSelf = bodyToCheck.some((s) => eq(s, nextHead));
  const hitWall = !inBounds(nextHead, state.grid);

  if (hitWall || hitSelf) {
    return { ...state, status: "over", direction: nextDirection, queuedDirection: null, tick: state.tick + 1 };
  }

  const nextSnake = willEat
    ? [nextHead, ...state.snake]
    : [nextHead, ...state.snake.slice(0, Math.max(0, state.snake.length - 1))];

  const nextFood = willEat ? spawnFood(state.grid, nextSnake, rng) : state.food;

  return {
    ...state,
    snake: nextSnake,
    direction: nextDirection,
    queuedDirection: null,
    food: nextFood,
    score: willEat ? state.score + 1 : state.score,
    tick: state.tick + 1
  };
}

