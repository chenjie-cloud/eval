export function createGame(options = {}) {
  const cols = options.cols ?? 20
  const rows = options.rows ?? 20
  const rng = options.rng ?? Math.random

  const headX = Math.floor(cols / 2)
  const headY = Math.floor(rows / 2)
  const snake = [
    { x: headX, y: headY },
    { x: headX - 1, y: headY },
    { x: headX - 2, y: headY },
  ]

  const base = {
    cols,
    rows,
    snake,
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    score: 0,
    status: "idle",
    rng,
  }

  return { ...base, food: spawnFood(base) }
}

export function startGame(state) {
  if (state.status === "over") return resetGame(state)
  if (state.status === "running") return state
  return { ...state, status: "running" }
}

export function pauseGame(state) {
  if (state.status !== "running") return state
  return { ...state, status: "paused" }
}

export function resetGame(state) {
  return createGame({ cols: state.cols, rows: state.rows, rng: state.rng })
}

export function setDirection(state, dirKey) {
  const next = dirFromKey(dirKey)
  if (!next) return state
  const base = state.status === "running" ? state.nextDir : state.dir
  if (isOpposite(next, base)) return state
  return { ...state, nextDir: next }
}

export function step(state) {
  if (state.status !== "running") return state

  const dir = state.nextDir
  const head = state.snake[0]
  const newHead = { x: head.x + dir.x, y: head.y + dir.y }

  if (newHead.x < 0 || newHead.x >= state.cols || newHead.y < 0 || newHead.y >= state.rows) {
    return { ...state, status: "over" }
  }

  const eats = newHead.x === state.food.x && newHead.y === state.food.y
  const bodyToCheck = eats ? state.snake : state.snake.slice(0, -1)
  const hitsSelf = bodyToCheck.some((p) => p.x === newHead.x && p.y === newHead.y)
  if (hitsSelf) return { ...state, status: "over" }

  const snake = eats ? [newHead, ...state.snake] : [newHead, ...state.snake.slice(0, -1)]
  const score = eats ? state.score + 1 : state.score

  const base = { ...state, snake, score, dir }
  if (!eats) return base

  return { ...base, food: spawnFood(base) }
}

export function spawnFood(state) {
  const occupied = new Set(state.snake.map((p) => `${p.x},${p.y}`))
  const available = []
  for (let y = 0; y < state.rows; y += 1) {
    for (let x = 0; x < state.cols; x += 1) {
      const k = `${x},${y}`
      if (!occupied.has(k)) available.push({ x, y })
    }
  }
  if (available.length === 0) return { x: 0, y: 0 }
  const idx = Math.floor(state.rng() * available.length)
  return available[Math.min(Math.max(idx, 0), available.length - 1)]
}

function dirFromKey(key) {
  switch (key) {
    case "ArrowUp":
    case "w":
    case "W":
      return { x: 0, y: -1 }
    case "ArrowDown":
    case "s":
    case "S":
      return { x: 0, y: 1 }
    case "ArrowLeft":
    case "a":
    case "A":
      return { x: -1, y: 0 }
    case "ArrowRight":
    case "d":
    case "D":
      return { x: 1, y: 0 }
    default:
      return null
  }
}

function isOpposite(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0
}
