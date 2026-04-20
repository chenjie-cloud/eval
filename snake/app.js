import { createGame, pauseGame, resetGame, setDirection, startGame, step } from "./logic.js"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const btnStart = document.getElementById("btnStart")
const btnPause = document.getElementById("btnPause")
const btnRestart = document.getElementById("btnRestart")
const scoreValue = document.getElementById("scoreValue")
const statusEl = document.getElementById("status")

const cols = 20
const rows = 20
const cell = canvas.width / cols

let state = createGame({ cols, rows })
let timer = null

function setStatusText() {
  switch (state.status) {
    case "idle":
      statusEl.textContent = "未开始"
      return
    case "running":
      statusEl.textContent = "进行中"
      return
    case "paused":
      statusEl.textContent = "已暂停"
      return
    case "over":
      statusEl.textContent = `结束：得分 ${state.score}`
      return
    default:
      statusEl.textContent = ""
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.save()
  ctx.globalAlpha = 0.6
  ctx.strokeStyle = "rgba(255,255,255,0.08)"
  for (let x = 0; x <= cols; x += 1) {
    ctx.beginPath()
    ctx.moveTo(x * cell, 0)
    ctx.lineTo(x * cell, canvas.height)
    ctx.stroke()
  }
  for (let y = 0; y <= rows; y += 1) {
    ctx.beginPath()
    ctx.moveTo(0, y * cell)
    ctx.lineTo(canvas.width, y * cell)
    ctx.stroke()
  }
  ctx.restore()

  ctx.fillStyle = "#7cf2c4"
  ctx.fillRect(state.food.x * cell + 2, state.food.y * cell + 2, cell - 4, cell - 4)

  for (let i = state.snake.length - 1; i >= 0; i -= 1) {
    const p = state.snake[i]
    const t = i === 0 ? 1 : 0.7
    ctx.fillStyle = `rgba(255,255,255,${0.15 + 0.75 * t})`
    ctx.fillRect(p.x * cell + 2, p.y * cell + 2, cell - 4, cell - 4)
  }

  if (state.status === "over") {
    ctx.save()
    ctx.fillStyle = "rgba(0,0,0,0.55)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(255,255,255,0.95)"
    ctx.font = "600 28px ui-sans-serif, system-ui, -apple-system, Segoe UI, PingFang SC, Microsoft YaHei, Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("游戏结束", canvas.width / 2, canvas.height / 2 - 18)
    ctx.fillStyle = "rgba(255,255,255,0.75)"
    ctx.font = "500 16px ui-sans-serif, system-ui, -apple-system, Segoe UI, PingFang SC, Microsoft YaHei, Arial"
    ctx.fillText(`得分：${state.score}（点击“重新开始”）`, canvas.width / 2, canvas.height / 2 + 20)
    ctx.restore()
  }
}

function render() {
  scoreValue.textContent = String(state.score)
  setStatusText()
  draw()
}

function stopLoop() {
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }
}

function ensureLoop() {
  stopLoop()
  timer = window.setInterval(() => {
    const next = step(state)
    if (next !== state) state = next
    render()
    if (state.status !== "running") stopLoop()
  }, 120)
}

btnStart.addEventListener("click", () => {
  state = startGame(state)
  render()
  if (state.status === "running") ensureLoop()
})

btnPause.addEventListener("click", () => {
  state = pauseGame(state)
  render()
  if (state.status !== "running") stopLoop()
})

btnRestart.addEventListener("click", () => {
  stopLoop()
  state = resetGame(state)
  state = startGame(state)
  render()
  ensureLoop()
})

window.addEventListener("keydown", (e) => {
  state = setDirection(state, e.key)
})

render()

