import {
  addTodo,
  clearCompleted,
  deleteTodo,
  filterTodos,
  getRemainingCount,
  setFilter,
  toggleTodo,
  updateTodoTitle,
} from "./logic.js";
import { loadState, saveState } from "./storage.js";

const STORAGE_KEY = "todo.app.state.v1";

const elements = {
  form: document.querySelector("#todo-form"),
  input: document.querySelector("#todo-title"),
  list: document.querySelector("#todo-list"),
  filters: [...document.querySelectorAll("[data-filter]")],
  remaining: document.querySelector("#remaining"),
  clearCompleted: document.querySelector("#clear-completed"),
  empty: document.querySelector("#empty"),
};

let state = loadState(STORAGE_KEY) ?? { todos: [], filter: "all" };

function commit(nextState) {
  state = nextState;
  saveState(STORAGE_KEY, state);
  render();
}

function setSelectedFilter(filter) {
  for (const button of elements.filters) {
    const selected = button.dataset.filter === filter;
    button.setAttribute("aria-selected", selected ? "true" : "false");
  }
}

function render() {
  setSelectedFilter(state.filter);

  const remaining = getRemainingCount(state);
  elements.remaining.textContent = remaining === 0 ? "全部已完成" : `未完成 ${remaining} 项`;
  elements.clearCompleted.disabled = state.todos.every((t) => !t.completed);

  const visible = filterTodos(state);
  elements.list.replaceChildren(...visible.map(renderItem));
  elements.empty.hidden = state.todos.length !== 0;
}

function renderItem(todo) {
  const li = document.createElement("li");
  li.className = todo.completed ? "item item--completed" : "item";
  li.dataset.id = todo.id;

  const check = document.createElement("button");
  check.className = "item__check";
  check.type = "button";
  check.setAttribute("role", "checkbox");
  check.setAttribute("aria-checked", todo.completed ? "true" : "false");
  check.setAttribute("aria-label", todo.completed ? "标记为未完成" : "标记为已完成");
  check.addEventListener("click", () => commit(toggleTodo(state, todo.id)));

  const title = document.createElement("div");
  title.className = "item__title";
  title.textContent = todo.title;

  const actions = document.createElement("div");
  actions.className = "item__actions";

  const edit = document.createElement("button");
  edit.className = "icon-button";
  edit.type = "button";
  edit.textContent = "编辑";
  edit.addEventListener("click", () => beginEdit(li, todo));

  const remove = document.createElement("button");
  remove.className = "icon-button button--danger";
  remove.type = "button";
  remove.textContent = "删除";
  remove.addEventListener("click", () => commit(deleteTodo(state, todo.id)));

  actions.append(edit, remove);
  li.append(check, title, actions);

  return li;
}

function beginEdit(li, todo) {
  const input = document.createElement("input");
  input.className = "item__edit";
  input.type = "text";
  input.value = todo.title;
  input.setAttribute("aria-label", "编辑待办事项");

  const save = document.createElement("button");
  save.className = "icon-button";
  save.type = "button";
  save.textContent = "保存";

  const cancel = document.createElement("button");
  cancel.className = "icon-button";
  cancel.type = "button";
  cancel.textContent = "取消";

  const actions = li.querySelector(".item__actions");
  const title = li.querySelector(".item__title");

  function exit({ save: shouldSave }) {
    const nextTitle = input.value.trim();
    const nextState =
      shouldSave && nextTitle ? updateTodoTitle(state, todo.id, nextTitle) : state;
    commit(nextState);
  }

  function handleKeydown(event) {
    if (event.key === "Enter") exit({ save: true });
    if (event.key === "Escape") exit({ save: false });
  }

  save.addEventListener("click", () => exit({ save: true }));
  cancel.addEventListener("click", () => exit({ save: false }));
  input.addEventListener("keydown", handleKeydown);

  li.replaceChild(input, title);
  actions.replaceChildren(save, cancel);
  input.focus();
  input.select();
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = elements.input.value.trim();
  if (!title) return;
  commit(addTodo(state, title));
  elements.input.value = "";
  elements.input.focus();
});

for (const button of elements.filters) {
  button.addEventListener("click", () => commit(setFilter(state, button.dataset.filter)));
}

elements.clearCompleted.addEventListener("click", () => commit(clearCompleted(state)));

render();
