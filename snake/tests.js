import assert from "node:assert/strict"
import { createGame, setDirection, step } from "./logic.js"

function makeRng(values) {
  let i = 0
  return () => {
    const v = values[i % values.length]
    i += 1
    return v
  }
}

{
  const state = createGame({ cols: 10, rows: 10, rng: makeRng([0]) })
  assert.equal(state.snake.length, 3)
  assert.notEqual(`${state.food.x},${state.food.y}`, `${state.snake[0].x},${state.snake[0].y}`)
}

{
  let state = createGame({ cols: 10, rows: 10, rng: makeRng([0]) })
  state = { ...state, status: "running" }
  state = step(state)
  assert.equal(state.snake[0].x, 6)
  assert.equal(state.snake[0].y, 5)
}

{
  const rng = makeRng([0.999])
  let state = createGame({ cols: 6, rows: 6, rng })
  state = { ...state, status: "running", food: { x: 4, y: 3 } }
  state = step(state)
  assert.equal(state.score, 1)
  assert.equal(state.snake.length, 4)
  assert.ok(state.food)
}

{
  let state = createGame({ cols: 4, rows: 4, rng: makeRng([0]) })
  state = { ...state, status: "running" }
  state = step(state)
  state = step(state)
  assert.equal(state.status, "over")
}

{
  let state = createGame({ cols: 8, rows: 8, rng: makeRng([0]) })
  state = { ...state, status: "running" }
  state = setDirection(state, "ArrowLeft")
  state = step(state)
  assert.equal(state.snake[0].x, 5)
}

console.log("ok")
