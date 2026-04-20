const FILTERS = new Set(["all", "active", "completed"]);

function defaultNow() {
  return Date.now();
}

function defaultId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`;
}

export function createInitialState() {
  return { todos: [], filter: "all" };
}

export function normalizeState(raw) {
  const initial = createInitialState();
  if (!raw || typeof raw !== "object") return initial;

  const filter = FILTERS.has(raw.filter) ? raw.filter : "all";
  const todos = Array.isArray(raw.todos) ? raw.todos : [];

  const normalizedTodos = [];
  for (const t of todos) {
    if (!t || typeof t !== "object") continue;
    const id = typeof t.id === "string" && t.id ? t.id : null;
    const title = typeof t.title === "string" ? t.title.trim() : "";
    if (!id || !title) continue;

    const completed = Boolean(t.completed);
    const createdAt = typeof t.createdAt === "number" ? t.createdAt : 0;
    const updatedAt = typeof t.updatedAt === "number" ? t.updatedAt : createdAt;

    normalizedTodos.push({ id, title, completed, createdAt, updatedAt });
  }

  return { ...initial, filter, todos: normalizedTodos };
}

export function addTodo(state, title, deps = {}) {
  const nextTitle = typeof title === "string" ? title.trim() : "";
  if (!nextTitle) return state;

  const now = deps.now ?? defaultNow;
  const id = deps.id ?? defaultId;
  const timestamp = typeof now === "function" ? now() : defaultNow();
  const nextId = typeof id === "function" ? id() : defaultId();

  const todo = {
    id: nextId,
    title: nextTitle,
    completed: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return { ...state, todos: [todo, ...state.todos] };
}

export function toggleTodo(state, id, deps = {}) {
  if (!id) return state;
  const now = deps.now ?? defaultNow;
  const timestamp = typeof now === "function" ? now() : defaultNow();

  let changed = false;
  const todos = state.todos.map((t) => {
    if (t.id !== id) return t;
    changed = true;
    return { ...t, completed: !t.completed, updatedAt: timestamp };
  });

  return changed ? { ...state, todos } : state;
}

export function deleteTodo(state, id) {
  if (!id) return state;
  const next = state.todos.filter((t) => t.id !== id);
  return next.length === state.todos.length ? state : { ...state, todos: next };
}

export function updateTodoTitle(state, id, title, deps = {}) {
  const nextTitle = typeof title === "string" ? title.trim() : "";
  if (!id || !nextTitle) return state;

  const now = deps.now ?? defaultNow;
  const timestamp = typeof now === "function" ? now() : defaultNow();

  let changed = false;
  const todos = state.todos.map((t) => {
    if (t.id !== id) return t;
    changed = true;
    return { ...t, title: nextTitle, updatedAt: timestamp };
  });

  return changed ? { ...state, todos } : state;
}

export function setFilter(state, filter) {
  const nextFilter = FILTERS.has(filter) ? filter : "all";
  if (state.filter === nextFilter) return state;
  return { ...state, filter: nextFilter };
}

export function filterTodos(state) {
  if (state.filter === "active") return state.todos.filter((t) => !t.completed);
  if (state.filter === "completed") return state.todos.filter((t) => t.completed);
  return state.todos;
}

export function clearCompleted(state) {
  const next = state.todos.filter((t) => !t.completed);
  return next.length === state.todos.length ? state : { ...state, todos: next };
}

export function getRemainingCount(state) {
  let remaining = 0;
  for (const t of state.todos) if (!t.completed) remaining += 1;
  return remaining;
}

