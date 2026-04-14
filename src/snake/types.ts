export type Direction = "up" | "down" | "left" | "right";

export type Vec = Readonly<{
  x: number;
  y: number;
}>;

export type GameStatus = "idle" | "running" | "paused" | "over";

export type Difficulty = "slow" | "normal" | "fast" | "insane";

export type Grid = Readonly<{
  w: number;
  h: number;
}>;

export type EngineState = Readonly<{
  status: GameStatus;
  grid: Grid;
  snake: ReadonlyArray<Vec>;
  direction: Direction;
  queuedDirection: Direction | null;
  food: Vec;
  score: number;
  tick: number;
}>;

