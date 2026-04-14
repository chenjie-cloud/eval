(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function r(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(e){if(e.ep)return;e.ep=!0;const i=r(e);fetch(e.href,i)}})();function H(){return{nextInt(t){if(t<=0)return 0;if(typeof crypto<"u"&&typeof crypto.getRandomValues=="function"){const n=new Uint32Array(1);return crypto.getRandomValues(n),n[0]%t}return Math.floor(Math.random()*t)}}}function q(t,n){return t==="up"&&n==="down"||t==="down"&&n==="up"||t==="left"&&n==="right"||t==="right"&&n==="left"}function z(t,n){return{x:t.x+n.x,y:t.y+n.y}}function k(t,n){return t.x===n.x&&t.y===n.y}function G(t){switch(t){case"up":return{x:0,y:-1};case"down":return{x:0,y:1};case"left":return{x:-1,y:0};case"right":return{x:1,y:0}}}function V(t,n){return t.x>=0&&t.x<n.w&&t.y>=0&&t.y<n.h}function B(t,n,r){const o=new Set;for(const i of n)o.add(`${i.x},${i.y}`);const e=[];for(let i=0;i<t.h;i++)for(let a=0;a<t.w;a++){const d=`${a},${i}`;o.has(d)||e.push({x:a,y:i})}return e.length===0?{x:0,y:0}:e[r.nextInt(e.length)]}function L(t,n){const r={x:Math.floor(t.w/2),y:Math.floor(t.h/2)},o=[r,{x:r.x-1,y:r.y},{x:r.x-2,y:r.y}],e=B(t,o,n);return{status:"idle",grid:t,snake:o,direction:"right",queuedDirection:null,food:e,score:0,tick:0}}function K(t,n){return t.queuedDirection||q(t.direction,n)?t:{...t,queuedDirection:n}}function U(t){return t.status==="running"?t:t.status==="over"?{...t,status:"running"}:{...t,status:"running"}}function X(t){return t.status!=="running"?t:{...t,status:"paused"}}function Y(t){return t.status!=="paused"?t:{...t,status:"running"}}function _(t,n){return{...L(t.grid,n),status:"running"}}function j(t,n){if(t.status!=="running")return t;const r=t.queuedDirection&&!q(t.direction,t.queuedDirection)?t.queuedDirection:t.direction,o=t.snake[0],e=z(o,G(r)),i=k(e,t.food),d=(i?t.snake:t.snake.slice(0,-1)).some(h=>k(h,e));if(!V(e,t.grid)||d)return{...t,status:"over",direction:r,queuedDirection:null,tick:t.tick+1};const f=i?[e,...t.snake]:[e,...t.snake.slice(0,Math.max(0,t.snake.length-1))],v=i?B(t.grid,f,n):t.food;return{...t,snake:f,direction:r,queuedDirection:null,food:v,score:i?t.score+1:t.score,tick:t.tick+1}}function J(t,n,r){const o=Math.max(1,Math.floor(window.devicePixelRatio||1)),e=Math.max(10,Math.floor(r.cssSize/n.grid.w)),i=e*n.grid.w,a=e*n.grid.h,d=i*o,y=a*o;t.width!==d&&(t.width=d),t.height!==y&&(t.height=y),t.style.width=`${i}px`,t.style.height=`${a}px`;const f=t.getContext("2d");return f&&(f.setTransform(o,0,0,o,0,0),f.imageSmoothingEnabled=!1),e}function A(t,n,r,o){t.fillStyle=o,t.fillRect(n.x*r,n.y*r,r,r)}function D(t,n,r,o){t.strokeStyle=o,t.lineWidth=1,t.strokeRect(n.x*r+.5,n.y*r+.5,r-1,r-1)}function Q(t,n,r){const o=n.grid.w*r,e=n.grid.h*r;t.clearRect(0,0,o,e);const i="rgba(255,255,255,0.03)",a="rgba(255,255,255,0.015)";for(let c=0;c<n.grid.h;c++)for(let l=0;l<n.grid.w;l++)t.fillStyle=(l+c)%2===0?i:a,t.fillRect(l*r,c*r,r,r);const d="#21d86b",y="#32ff7e",f="rgba(0,0,0,0.55)",v="#ffd23f",h="#ff6b6b";for(let c=n.snake.length-1;c>=0;c--){const l=n.snake[c];A(t,l,r,c===0?y:d),D(t,l,r,f),c===0&&(t.fillStyle="rgba(0,0,0,0.35)",t.fillRect(l.x*r+Math.max(2,Math.floor(r*.15)),l.y*r+Math.max(2,Math.floor(r*.18)),Math.max(2,Math.floor(r*.18)),Math.max(2,Math.floor(r*.18))))}const p=n.tick%10<5?v:h;if(A(t,n.food,r,p),D(t,n.food,r,"rgba(0,0,0,0.65)"),n.status==="idle"||n.status==="paused"||n.status==="over"){t.fillStyle="rgba(0,0,0,0.55)",t.fillRect(0,0,o,e),t.textAlign="center",t.textBaseline="middle";const c=n.status==="idle"?"PRESS START":n.status==="paused"?"PAUSED":"GAME OVER",l=n.status==="over"?"PRESS RESTART":"ARROWS / WASD";t.fillStyle="rgba(255,255,255,0.92)",t.font=`700 ${Math.max(12,Math.floor(r*1.1))}px ui-monospace, monospace`,t.fillText(c,o/2,e/2-Math.floor(r*.8)),t.fillStyle="rgba(255,255,255,0.72)",t.font=`500 ${Math.max(10,Math.floor(r*.55))}px ui-monospace, monospace`,t.fillText(l,o/2,e/2+Math.floor(r*.55))}}const R="snake.best.v1";function Z(t){switch(t){case"slow":return 160;case"normal":return 120;case"fast":return 80;case"insane":return 50}}function tt(t){switch(t){case"ArrowUp":case"w":case"W":return"up";case"ArrowDown":case"s":case"S":return"down";case"ArrowLeft":case"a":case"A":return"left";case"ArrowRight":case"d":case"D":return"right";default:return null}}function et(t,n,r){return Math.max(n,Math.min(r,t))}function nt(t){const n=H(),r={w:24,h:24};let o=Number(localStorage.getItem(R)??"0");(!Number.isFinite(o)||o<0)&&(o=0);let e=L(r,n),i=t.difficultyEl.value||"normal",a=null,d=24;const y=t.canvas.getContext("2d");if(!y)throw new Error("2d context not found");function f(){t.scoreEl.textContent=String(e.score),t.bestEl.textContent=String(o),t.pauseBtn.disabled=e.status==="idle"||e.status==="over",t.restartBtn.disabled=e.status==="idle",t.startBtn.disabled=e.status==="running"||e.status==="paused",t.pauseBtn.textContent=e.status==="paused"?"继续":"暂停"}function v(s){o=s,localStorage.setItem(R,String(o))}function h(s){e=s,e.status==="over"&&e.score>o&&v(e.score),f()}function p(){a!==null&&window.clearInterval(a),a=null}function c(){p();const s=Z(i);a=window.setInterval(()=>{const u=e.status;h(j(e,n)),u==="running"&&e.status==="over"&&p()},s)}function l(){const s=t.canvas.parentElement,u=s==null?void 0:s.getBoundingClientRect(),g=et(Math.floor(((u==null?void 0:u.width)??560)-2),240,720);d=J(t.canvas,e,{cssSize:g})}function S(){l(),Q(y,e,d),window.requestAnimationFrame(S)}function w(){e.status!=="running"&&e.status!=="paused"&&(h(U(e)),c())}function x(){h(_(e,n)),c()}function E(){if(e.status==="running"){h(X(e)),p();return}e.status==="paused"&&(h(Y(e)),c())}function M(s){e.status==="idle"&&w(),e.status==="running"&&h(K(e,s))}t.startBtn.addEventListener("click",()=>w()),t.restartBtn.addEventListener("click",()=>x()),t.pauseBtn.addEventListener("click",()=>E()),t.difficultyEl.addEventListener("change",()=>{i=t.difficultyEl.value,e.status==="running"&&c()}),window.addEventListener("keydown",s=>{const u=tt(s.key);if(u){s.preventDefault(),M(u);return}if(s.key===" "||s.key==="Spacebar"){s.preventDefault(),E();return}s.key==="Enter"&&w(),(s.key==="r"||s.key==="R")&&e.status!=="idle"&&x()});let b=null;function $(s,u){const g=Math.abs(s),m=Math.abs(u);return Math.max(g,m)<18?null:g>m?s>0?"right":"left":u>0?"down":"up"}t.canvas.addEventListener("touchstart",s=>{if(s.touches.length!==1)return;const u=s.touches[0];b={x:u.clientX,y:u.clientY},s.preventDefault()},{passive:!1}),t.canvas.addEventListener("touchend",s=>{const u=b;b=null;const g=s.changedTouches[0];if(!u||!g)return;const m=$(g.clientX-u.x,g.clientY-u.y);m&&M(m),s.preventDefault()},{passive:!1}),window.addEventListener("resize",()=>l()),f(),window.requestAnimationFrame(S)}const T=document.querySelector("#app");if(!T)throw new Error("#app not found");T.innerHTML=`
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
`;const C=document.querySelector("#game"),I=document.querySelector("#start"),O=document.querySelector("#pause"),P=document.querySelector("#restart"),N=document.querySelector("#score"),W=document.querySelector("#best"),F=document.querySelector("#difficulty");if(!C||!I||!O||!P||!N||!W||!F)throw new Error("missing elements");nt({canvas:C,startBtn:I,pauseBtn:O,restartBtn:P,scoreEl:N,bestEl:W,difficultyEl:F});
