import type { EngineState, Vec } from "./types";

export type RenderOpts = Readonly<{
  cssSize: number;
}>;

export function layoutCanvas(canvas: HTMLCanvasElement, state: EngineState, opts: RenderOpts): number {
  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  const cell = Math.max(10, Math.floor(opts.cssSize / state.grid.w));
  const cssW = cell * state.grid.w;
  const cssH = cell * state.grid.h;
  const pxW = cssW * dpr;
  const pxH = cssH * dpr;

  if (canvas.width !== pxW) canvas.width = pxW;
  if (canvas.height !== pxH) canvas.height = pxH;
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return cell;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
  return cell;
}

function fillCell(ctx: CanvasRenderingContext2D, p: Vec, cell: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(p.x * cell, p.y * cell, cell, cell);
}

function strokeCell(ctx: CanvasRenderingContext2D, p: Vec, cell: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(p.x * cell + 0.5, p.y * cell + 0.5, cell - 1, cell - 1);
}

export function render(ctx: CanvasRenderingContext2D, state: EngineState, cell: number) {
  const w = state.grid.w * cell;
  const h = state.grid.h * cell;

  ctx.clearRect(0, 0, w, h);

  const bgA = "rgba(255,255,255,0.03)";
  const bgB = "rgba(255,255,255,0.015)";
  for (let y = 0; y < state.grid.h; y++) {
    for (let x = 0; x < state.grid.w; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? bgA : bgB;
      ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }

  const snakeBody = "#21d86b";
  const snakeHead = "#32ff7e";
  const snakeEdge = "rgba(0,0,0,0.55)";
  const foodA = "#ffd23f";
  const foodB = "#ff6b6b";

  for (let i = state.snake.length - 1; i >= 0; i--) {
    const s = state.snake[i];
    fillCell(ctx, s, cell, i === 0 ? snakeHead : snakeBody);
    strokeCell(ctx, s, cell, snakeEdge);
    if (i === 0) {
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(s.x * cell + Math.max(2, Math.floor(cell * 0.15)), s.y * cell + Math.max(2, Math.floor(cell * 0.18)), Math.max(2, Math.floor(cell * 0.18)), Math.max(2, Math.floor(cell * 0.18)));
    }
  }

  const foodColor = state.tick % 10 < 5 ? foodA : foodB;
  fillCell(ctx, state.food, cell, foodColor);
  strokeCell(ctx, state.food, cell, "rgba(0,0,0,0.65)");

  if (state.status === "idle" || state.status === "paused" || state.status === "over") {
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const title = state.status === "idle" ? "PRESS START" : state.status === "paused" ? "PAUSED" : "GAME OVER";
    const sub = state.status === "over" ? "PRESS RESTART" : "ARROWS / WASD";

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = `700 ${Math.max(12, Math.floor(cell * 1.1))}px ui-monospace, monospace`;
    ctx.fillText(title, w / 2, h / 2 - Math.floor(cell * 0.8));

    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = `500 ${Math.max(10, Math.floor(cell * 0.55))}px ui-monospace, monospace`;
    ctx.fillText(sub, w / 2, h / 2 + Math.floor(cell * 0.55));
  }
}

