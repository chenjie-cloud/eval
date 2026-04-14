(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function r(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(n){if(n.ep)return;n.ep=!0;const i=r(n);fetch(n.href,i)}})();function z(){return{nextInt(t){if(t<=0)return 0;if(typeof crypto<"u"&&typeof crypto.getRandomValues=="function"){const e=new Uint32Array(1);return crypto.getRandomValues(e),e[0]%t}return Math.floor(Math.random()*t)}}}function B(t,e){return t==="up"&&e==="down"||t==="down"&&e==="up"||t==="left"&&e==="right"||t==="right"&&e==="left"}function G(t,e){return{x:t.x+e.x,y:t.y+e.y}}function A(t,e){return t.x===e.x&&t.y===e.y}function V(t){switch(t){case"up":return{x:0,y:-1};case"down":return{x:0,y:1};case"left":return{x:-1,y:0};case"right":return{x:1,y:0}}}function K(t,e){return t.x>=0&&t.x<e.w&&t.y>=0&&t.y<e.h}function L(t,e,r){const o=new Set;for(const i of e)o.add(`${i.x},${i.y}`);const n=[];for(let i=0;i<t.h;i++)for(let a=0;a<t.w;a++){const d=`${a},${i}`;o.has(d)||n.push({x:a,y:i})}return n.length===0?{x:0,y:0}:n[r.nextInt(n.length)]}function T(t,e){const r={x:Math.floor(t.w/2),y:Math.floor(t.h/2)},o=[r,{x:r.x-1,y:r.y},{x:r.x-2,y:r.y}],n=L(t,o,e);return{status:"idle",grid:t,snake:o,direction:"right",queuedDirection:null,food:n,score:0,tick:0}}function U(t,e){return t.queuedDirection||B(t.direction,e)?t:{...t,queuedDirection:e}}function X(t){return t.status==="running"?t:t.status==="over"?{...t,status:"running"}:{...t,status:"running"}}function Y(t){return t.status!=="running"?t:{...t,status:"paused"}}function _(t){return t.status!=="paused"?t:{...t,status:"running"}}function j(t,e){return{...T(t.grid,e),status:"running"}}function J(t,e){if(t.status!=="running")return t;const r=t.queuedDirection&&!B(t.direction,t.queuedDirection)?t.queuedDirection:t.direction,o=t.snake[0],n=G(o,V(r)),i=A(n,t.food),d=(i?t.snake:t.snake.slice(0,-1)).some(p=>A(p,n));if(!K(n,t.grid)||d)return{...t,status:"over",direction:r,queuedDirection:null,tick:t.tick+1};const f=i?[n,...t.snake]:[n,...t.snake.slice(0,Math.max(0,t.snake.length-1))],v=i?L(t.grid,f,e):t.food;return{...t,snake:f,direction:r,queuedDirection:null,food:v,score:i?t.score+1:t.score,tick:t.tick+1}}function Q(t,e,r){const o=Math.max(1,Math.floor(window.devicePixelRatio||1)),n=Math.max(10,Math.floor(r.cssSize/e.grid.w)),i=n*e.grid.w,a=n*e.grid.h,d=i*o,h=a*o;t.width!==d&&(t.width=d),t.height!==h&&(t.height=h),t.style.width=`${i}px`,t.style.height=`${a}px`;const f=t.getContext("2d");return f&&(f.setTransform(o,0,0,o,0,0),f.imageSmoothingEnabled=!1),n}function D(t,e,r,o){t.fillStyle=o,t.fillRect(e.x*r,e.y*r,r,r)}function R(t,e,r,o){t.strokeStyle=o,t.lineWidth=1,t.strokeRect(e.x*r+.5,e.y*r+.5,r-1,r-1)}function Z(t,e,r){const o=e.grid.w*r,n=e.grid.h*r;t.clearRect(0,0,o,n);const i="rgba(255,255,255,0.03)",a="rgba(255,255,255,0.015)";for(let c=0;c<e.grid.h;c++)for(let l=0;l<e.grid.w;l++)t.fillStyle=(l+c)%2===0?i:a,t.fillRect(l*r,c*r,r,r);const d="#21d86b",h="#32ff7e",f="rgba(0,0,0,0.55)",v="#ffd23f",p="#ff6b6b";for(let c=e.snake.length-1;c>=0;c--){const l=e.snake[c];D(t,l,r,c===0?h:d),R(t,l,r,f),c===0&&(t.fillStyle="rgba(0,0,0,0.35)",t.fillRect(l.x*r+Math.max(2,Math.floor(r*.15)),l.y*r+Math.max(2,Math.floor(r*.18)),Math.max(2,Math.floor(r*.18)),Math.max(2,Math.floor(r*.18))))}const y=e.tick%10<5?v:p;if(D(t,e.food,r,y),R(t,e.food,r,"rgba(0,0,0,0.65)"),e.status==="idle"||e.status==="paused"||e.status==="over"){t.fillStyle="rgba(0,0,0,0.55)",t.fillRect(0,0,o,n),t.textAlign="center",t.textBaseline="middle";const c=e.status==="idle"?"PRESS START":e.status==="paused"?"PAUSED":"GAME OVER",l=e.status==="over"?"PRESS RESTART":"ARROWS / WASD";t.fillStyle="rgba(255,255,255,0.92)",t.font=`700 ${Math.max(12,Math.floor(r*1.1))}px ui-monospace, monospace`,t.fillText(c,o/2,n/2-Math.floor(r*.8)),t.fillStyle="rgba(255,255,255,0.72)",t.font=`500 ${Math.max(10,Math.floor(r*.55))}px ui-monospace, monospace`,t.fillText(l,o/2,n/2+Math.floor(r*.55))}}const q="snake.best.v1";function tt(t){switch(t){case"slow":return 160;case"normal":return 120;case"fast":return 80;case"insane":return 50}}function nt(t){switch(t){case"ArrowUp":case"w":case"W":return"up";case"ArrowDown":case"s":case"S":return"down";case"ArrowLeft":case"a":case"A":return"left";case"ArrowRight":case"d":case"D":return"right";default:return null}}function et(t,e,r){return Math.max(e,Math.min(r,t))}function rt(t){const e=z(),r={w:24,h:24};let o=Number(localStorage.getItem(q)??"0");(!Number.isFinite(o)||o<0)&&(o=0);let n=T(r,e),i=t.difficultyEl.value||"normal",a=null,d=24;const h=t.canvas.getContext("2d");if(!h)throw new Error("2d context not found");const f=h;function v(){t.scoreEl.textContent=String(n.score),t.bestEl.textContent=String(o),t.pauseBtn.disabled=n.status==="idle"||n.status==="over",t.restartBtn.disabled=n.status==="idle",t.startBtn.disabled=n.status==="running"||n.status==="paused",t.pauseBtn.textContent=n.status==="paused"?"继续":"暂停"}function p(s){o=s,localStorage.setItem(q,String(o))}function y(s){n=s,n.status==="over"&&n.score>o&&p(n.score),v()}function c(){a!==null&&window.clearInterval(a),a=null}function l(){c();const s=tt(i);a=window.setInterval(()=>{const u=n.status;y(J(n,e)),u==="running"&&n.status==="over"&&c()},s)}function S(){const s=t.canvas.parentElement,u=s==null?void 0:s.getBoundingClientRect(),g=et(Math.floor(((u==null?void 0:u.width)??560)-2),240,720);d=Q(t.canvas,n,{cssSize:g})}function x(){S(),Z(f,n,d),window.requestAnimationFrame(x)}function w(){n.status!=="running"&&n.status!=="paused"&&(y(X(n)),l())}function E(){y(j(n,e)),l()}function M(){if(n.status==="running"){y(Y(n)),c();return}n.status==="paused"&&(y(_(n)),l())}function k(s){n.status==="idle"&&w(),n.status==="running"&&y(U(n,s))}t.startBtn.addEventListener("click",()=>w()),t.restartBtn.addEventListener("click",()=>E()),t.pauseBtn.addEventListener("click",()=>M()),t.difficultyEl.addEventListener("change",()=>{i=t.difficultyEl.value,n.status==="running"&&l()}),window.addEventListener("keydown",s=>{const u=nt(s.key);if(u){s.preventDefault(),k(u);return}if(s.key===" "||s.key==="Spacebar"){s.preventDefault(),M();return}s.key==="Enter"&&w(),(s.key==="r"||s.key==="R")&&n.status!=="idle"&&E()});let b=null;function H(s,u){const g=Math.abs(s),m=Math.abs(u);return Math.max(g,m)<18?null:g>m?s>0?"right":"left":u>0?"down":"up"}t.canvas.addEventListener("touchstart",s=>{if(s.touches.length!==1)return;const u=s.touches[0];b={x:u.clientX,y:u.clientY},s.preventDefault()},{passive:!1}),t.canvas.addEventListener("touchend",s=>{const u=b;b=null;const g=s.changedTouches[0];if(!u||!g)return;const m=H(g.clientX-u.x,g.clientY-u.y);m&&k(m),s.preventDefault()},{passive:!1}),window.addEventListener("resize",()=>S()),v(),window.requestAnimationFrame(x)}const C=document.querySelector("#app");if(!C)throw new Error("#app not found");C.innerHTML=`
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
`;const I=document.querySelector("#game"),O=document.querySelector("#start"),P=document.querySelector("#pause"),N=document.querySelector("#restart"),W=document.querySelector("#score"),F=document.querySelector("#best"),$=document.querySelector("#difficulty");if(!I||!O||!P||!N||!W||!F||!$)throw new Error("missing elements");rt({canvas:I,startBtn:O,pauseBtn:P,restartBtn:N,scoreEl:W,bestEl:F,difficultyEl:$});
