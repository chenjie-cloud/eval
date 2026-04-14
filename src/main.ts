import "./style.css";
import { createController } from "./snake/controller";

const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("#app not found");

root.innerHTML = `
  <div class="app">
    <header class="header">
      <div class="brand">
        <div class="brand-title">SNAKE</div>
        <div class="brand-sub">PIXEL EDITION</div>
      </div>
      <div class="brand-sub">方向键/WASD · 空格暂停</div>
    </header>

    <main class="main">
      <section class="panel" aria-label="Game Panel">
        <div class="panel-title">屏幕</div>
        <div class="canvas-wrap">
          <canvas id="game" width="576" height="576"></canvas>
        </div>
        <div class="hud">
          <div class="note">移动端：在画面上滑动控制方向</div>
        </div>
      </section>

      <aside class="panel" aria-label="Controls">
        <div class="panel-title">面板</div>

        <div class="stats">
          <div class="stat">
            <div class="stat-label">得分</div>
            <div class="stat-value" id="score">0</div>
          </div>
          <div class="stat">
            <div class="stat-label">最高分</div>
            <div class="stat-value" id="best">0</div>
          </div>
        </div>

        <div class="row">
          <label for="difficulty">速度</label>
          <select id="difficulty" class="select">
            <option value="slow">SLOW</option>
            <option value="normal" selected>NORMAL</option>
            <option value="fast">FAST</option>
            <option value="insane">INSANE</option>
          </select>
        </div>

        <div class="actions">
          <button id="start" class="btn primary" type="button">开始</button>
          <button id="pause" class="btn" type="button" disabled>暂停</button>
          <button id="restart" class="btn" type="button" disabled>重新开始</button>
        </div>

        <div class="note">
          规则：吃到食物 +1，撞墙/自撞结束。速度可在游戏中调整并立即生效。
        </div>
      </aside>
    </main>

    <footer class="footer">
      <span>Touch: Swipe</span>
      <span>Best: localStorage</span>
    </footer>
  </div>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#game");
const startBtn = document.querySelector<HTMLButtonElement>("#start");
const pauseBtn = document.querySelector<HTMLButtonElement>("#pause");
const restartBtn = document.querySelector<HTMLButtonElement>("#restart");
const scoreEl = document.querySelector<HTMLDivElement>("#score");
const bestEl = document.querySelector<HTMLDivElement>("#best");
const difficultyEl = document.querySelector<HTMLSelectElement>("#difficulty");

if (!canvas || !startBtn || !pauseBtn || !restartBtn || !scoreEl || !bestEl || !difficultyEl) {
  throw new Error("missing elements");
}

createController({
  canvas,
  startBtn,
  pauseBtn,
  restartBtn,
  scoreEl,
  bestEl,
  difficultyEl
});

