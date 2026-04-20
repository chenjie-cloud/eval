import assert from "node:assert/strict";
import {
  addTodo,
  clearCompleted,
  createInitialState,
  deleteTodo,
  filterTodos,
  getRemainingCount,
  normalizeState,
  setFilter,
  toggleTodo,
  updateTodoTitle,
} from "./logic.js";
import { clearState, loadState, saveState } from "./storage.js";

function makeSeq(values) {
  let i = 0;
  return () => values[i++] ?? values[values.length - 1];
}

class MemoryStorage {
  constructor() {
    this.map = new Map();
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  setItem(key, value) {
    this.map.set(key, String(value));
  }
  removeItem(key) {
    this.map.delete(key);
  }
}

{
  const now = makeSeq([1000, 2000, 3000, 4000]);
  const id = makeSeq(["a", "b", "c"]);
  const s0 = createInitialState();
  const s1 = addTodo(s0, "  买牛奶  ", { now, id });

  assert.equal(s1.todos.length, 1);
  assert.equal(s1.todos[0].id, "a");
  assert.equal(s1.todos[0].title, "买牛奶");
  assert.equal(s1.todos[0].completed, false);
  assert.equal(s1.todos[0].createdAt, 1000);
  assert.equal(s1.todos[0].updatedAt, 1000);

  const s2 = toggleTodo(s1, "a", { now });
  assert.equal(s2.todos[0].completed, true);
  assert.equal(s2.todos[0].updatedAt, 2000);

  const s3 = updateTodoTitle(s2, "a", "  买豆浆  ", { now });
  assert.equal(s3.todos[0].title, "买豆浆");
  assert.equal(s3.todos[0].updatedAt, 3000);

  const s4 = deleteTodo(s3, "a");
  assert.equal(s4.todos.length, 0);
  assert.equal(getRemainingCount(s4), 0);
}

{
  const now = makeSeq([1, 2, 3]);
  const id = makeSeq(["t1", "t2"]);
  const s0 = createInitialState();
  const s1 = addTodo(s0, "A", { now, id });
  const s2 = addTodo(s1, "B", { now, id });
  const s3 = toggleTodo(s2, "t2", { now });

  assert.equal(getRemainingCount(s3), 1);

  const all = filterTodos(setFilter(s3, "all"));
  const active = filterTodos(setFilter(s3, "active"));
  const completed = filterTodos(setFilter(s3, "completed"));

  assert.equal(all.length, 2);
  assert.equal(active.length, 1);
  assert.equal(completed.length, 1);
  assert.equal(active[0].id, "t1");

  const s4 = clearCompleted(s3);
  assert.equal(s4.todos.length, 1);
  assert.equal(s4.todos[0].id, "t1");
}

{
  const normalized = normalizeState({
    filter: "active",
    todos: [
      { id: "1", title: "X", completed: true, createdAt: 10, updatedAt: 12 },
      { id: "", title: "bad" },
      null,
    ],
  });

  assert.equal(normalized.filter, "active");
  assert.equal(normalized.todos.length, 1);
  assert.equal(normalized.todos[0].id, "1");
}

{
  const storage = new MemoryStorage();
  const key = "k";
  const now = makeSeq([10]);
  const id = makeSeq(["id"]);
  const state = addTodo(createInitialState(), "X", { now, id });

  assert.equal(loadState(key, { storage }), null);
  assert.equal(saveState(key, state, { storage }), true);
  const loaded = loadState(key, { storage });
  assert.equal(loaded.todos.length, 1);
  assert.equal(loaded.todos[0].id, "id");

  assert.equal(clearState(key, { storage }), true);
  assert.equal(loadState(key, { storage }), null);
}

console.log("ok");

