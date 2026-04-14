import { createInitialState, queueDirection, spawnFood, step } from "./engine";
import type { Rng } from "./rng";
import { expect, test } from "vitest";

function createSeqRng(seq: number[]): Rng {
  let i = 0;
  return {
    nextInt(maxExclusive) {
      const v = seq[i % seq.length] ?? 0;
      i++;
      return maxExclusive <= 0 ? 0 : ((v % maxExclusive) + maxExclusive) % maxExclusive;
    }
  };
}

test("吃到食物会加分并增长", () => {
  const rng = createSeqRng([0]);
  const state0 = createInitialState({ w: 10, h: 10 }, rng);
  const head = state0.snake[0];
  const food = { x: head.x + 1, y: head.y };
  const state1 = { ...state0, status: "running" as const, food };
  const state2 = step(state1, rng);

  expect(state2.score).toBe(1);
  expect(state2.snake.length).toBe(state1.snake.length + 1);
  expect(state2.status).toBe("running");
});

test("撞墙会结束", () => {
  const rng = createSeqRng([0]);
  const state0 = createInitialState({ w: 5, h: 5 }, rng);
  const snake = [{ x: 4, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 2 }];
  const state1 = { ...state0, status: "running" as const, snake, direction: "right" as const };
  const state2 = step(state1, rng);
  expect(state2.status).toBe("over");
});

test("撞到自己会结束（考虑尾巴移动）", () => {
  const rng = createSeqRng([0]);
  const state0 = createInitialState({ w: 8, h: 8 }, rng);
  const snake = [
    { x: 3, y: 3 },
    { x: 3, y: 4 },
    { x: 2, y: 4 },
    { x: 2, y: 3 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 4, y: 2 },
    { x: 4, y: 3 },
    { x: 4, y: 4 }
  ];
  const state1 = { ...state0, status: "running" as const, snake, direction: "down" as const, food: { x: 0, y: 0 } };
  const state2 = queueDirection(state1, "left");
  const state3 = step(state2, rng);
  expect(state3.status).toBe("over");
});

test("食物不会生成在蛇身上", () => {
  const rng = createSeqRng([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const grid = { w: 4, h: 4 };
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 }
  ];
  const food = spawnFood(grid, snake, rng);
  const key = `${food.x},${food.y}`;
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
  expect(occupied.has(key)).toBe(false);
});
