import type { Difficulty, Direction, EngineState } from "./types";
import { createDefaultRng } from "./rng";
import { createInitialState, pause, queueDirection, restart, resume, start, step } from "./engine";
import { layoutCanvas, render } from "./render";

export type ControllerDeps = Readonly<{
  canvas: HTMLCanvasElement;
  startBtn: HTMLButtonElement;
  pauseBtn: HTMLButtonElement;
  restartBtn: HTMLButtonElement;
  scoreEl: HTMLElement;
  bestEl: HTMLElement;
  difficultyEl: HTMLSelectElement;
}>;

const BEST_KEY = "snake.best.v1";

function getIntervalMs(d: Difficulty): number {
  switch (d) {
    case "slow":
      return 160;
    case "normal":
      return 120;
    case "fast":
      return 80;
    case "insane":
      return 50;
  }
}

function keyToDir(key: string): Direction | null {
  switch (key) {
    case "ArrowUp":
    case "w":
    case "W":
      return "up";
    case "ArrowDown":
    case "s":
    case "S":
      return "down";
    case "ArrowLeft":
    case "a":
    case "A":
      return "left";
    case "ArrowRight":
    case "d":
    case "D":
      return "right";
    default:
      return null;
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function createController(deps: ControllerDeps) {
  const rng = createDefaultRng();
  const grid = { w: 24, h: 24 } as const;

  let best = Number(localStorage.getItem(BEST_KEY) ?? "0");
  if (!Number.isFinite(best) || best < 0) best = 0;

  let state: EngineState = createInitialState(grid, rng);
  let difficulty = (deps.difficultyEl.value as Difficulty) || "normal";
  let timer: number | null = null;
  let cellSize = 24;

  const ctx = deps.canvas.getContext("2d");
  if (!ctx) throw new Error("2d context not found");
  const ctx2d: CanvasRenderingContext2D = ctx;

  function syncHud() {
    deps.scoreEl.textContent = String(state.score);
    deps.bestEl.textContent = String(best);
    deps.pauseBtn.disabled = state.status === "idle" || state.status === "over";
    deps.restartBtn.disabled = state.status === "idle";
    deps.startBtn.disabled = state.status === "running" || state.status === "paused";
    deps.pauseBtn.textContent = state.status === "paused" ? "继续" : "暂停";
  }

  function saveBest(nextBest: number) {
    best = nextBest;
    localStorage.setItem(BEST_KEY, String(best));
  }

  function setState(next: EngineState) {
    state = next;
    if (state.status === "over" && state.score > best) saveBest(state.score);
    syncHud();
  }

  function stopTimer() {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
  }

  function startTimer() {
    stopTimer();
    const ms = getIntervalMs(difficulty);
    timer = window.setInterval(() => {
      const before = state.status;
      setState(step(state, rng));
      if (before === "running" && state.status === "over") stopTimer();
    }, ms);
  }

  function resize() {
    const wrap = deps.canvas.parentElement;
    const rect = wrap?.getBoundingClientRect();
    const cssSize = clamp(Math.floor((rect?.width ?? 560) - 2), 240, 720);
    cellSize = layoutCanvas(deps.canvas, state, { cssSize });
  }

  function renderLoop() {
    resize();
    render(ctx2d, state, cellSize);
    window.requestAnimationFrame(renderLoop);
  }

  function startGame() {
    if (state.status === "running") return;
    if (state.status === "paused") return;
    setState(start(state));
    startTimer();
  }

  function restartGame() {
    setState(restart(state, rng));
    startTimer();
  }

  function togglePause() {
    if (state.status === "running") {
      setState(pause(state));
      stopTimer();
      return;
    }
    if (state.status === "paused") {
      setState(resume(state));
      startTimer();
    }
  }

  function pushDir(d: Direction) {
    if (state.status === "idle") startGame();
    if (state.status !== "running") return;
    setState(queueDirection(state, d));
  }

  deps.startBtn.addEventListener("click", () => startGame());
  deps.restartBtn.addEventListener("click", () => restartGame());
  deps.pauseBtn.addEventListener("click", () => togglePause());

  deps.difficultyEl.addEventListener("change", () => {
    difficulty = deps.difficultyEl.value as Difficulty;
    if (state.status === "running") startTimer();
  });

  window.addEventListener("keydown", (e) => {
    const d = keyToDir(e.key);
    if (d) {
      e.preventDefault();
      pushDir(d);
      return;
    }
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      togglePause();
      return;
    }
    if (e.key === "Enter") {
      startGame();
    }
    if (e.key === "r" || e.key === "R") {
      if (state.status !== "idle") restartGame();
    }
  });

  let touchStart: { x: number; y: number } | null = null;

  function dirFromSwipe(dx: number, dy: number): Direction | null {
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    if (Math.max(ax, ay) < 18) return null;
    if (ax > ay) return dx > 0 ? "right" : "left";
    return dy > 0 ? "down" : "up";
  }

  deps.canvas.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      touchStart = { x: t.clientX, y: t.clientY };
      e.preventDefault();
    },
    { passive: false }
  );

  deps.canvas.addEventListener(
    "touchend",
    (e) => {
      const startPt = touchStart;
      touchStart = null;
      const t = e.changedTouches[0];
      if (!startPt || !t) return;
      const d = dirFromSwipe(t.clientX - startPt.x, t.clientY - startPt.y);
      if (d) pushDir(d);
      e.preventDefault();
    },
    { passive: false }
  );

  window.addEventListener("resize", () => resize());

  syncHud();
  window.requestAnimationFrame(renderLoop);
}
