import './App.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FilterPills } from './components/FilterPills'
import { TodoItem } from './components/TodoItem'
import { loadState, saveState } from './lib/storage'
import type { Todo, TodoFilter } from './types'

function App() {
  const initial = useMemo(() => loadState(), [])
  const [todos, setTodos] = useState<Todo[]>(() => initial?.todos ?? [])
  const [filter, setFilter] = useState<TodoFilter>(() => initial?.filter ?? 'all')
  const [title, setTitle] = useState('')
  const composerRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    saveState({ v: 1, todos, filter })
  }, [todos, filter])

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed)
    if (filter === 'completed') return todos.filter((t) => t.completed)
    return todos
  }, [todos, filter])

  const remaining = useMemo(
    () => todos.reduce((acc, t) => acc + (t.completed ? 0 : 1), 0),
    [todos],
  )

  const completed = todos.length - remaining

  const createTodo = () => {
    const nextTitle = title.trim()
    if (!nextTitle) return

    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`

    const next: Todo = {
      id,
      title: nextTitle,
      completed: false,
      createdAt: Date.now(),
    }

    setTodos((prev) => [next, ...prev])
    setTitle('')
    composerRef.current?.focus()
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  const renameTodo = (id: string, nextTitle: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title: nextTitle } : t)))
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  return (
    <div className="appShell">
      <header className="top">
        <div className="brand">
          <div className="mark" aria-hidden="true" />
          <div className="brandText">
            <p className="kicker">今日待办</p>
            <h1>把想做的事写下来</h1>
          </div>
        </div>

        <div className="composer">
          <label className="composerLabel" htmlFor="composerInput">
            新建待办
          </label>
          <div className="composerRow">
            <input
              ref={composerRef}
              id="composerInput"
              className="composerInput"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') createTodo()
              }}
              placeholder="例如：给未来的自己写一封信"
              autoComplete="off"
            />
            <button
              type="button"
              className="primary"
              onClick={createTodo}
              disabled={!title.trim()}
            >
              添加
            </button>
          </div>
          <div className="meta">
            <span>{remaining} 未完成</span>
            <span aria-hidden="true">·</span>
            <span>{completed} 已完成</span>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="toolbar">
          <FilterPills value={filter} onChange={setFilter} />
          <button
            type="button"
            className="ghost"
            onClick={clearCompleted}
            disabled={completed === 0}
          >
            清空已完成
          </button>
        </section>

        <section className="panel" aria-label="待办列表">
          {visibleTodos.length === 0 ? (
            <div className="empty" role="status">
              <p className="emptyTitle">这里很干净。</p>
              <p className="emptyDesc">写下一件小事，从今天开始推进。</p>
            </div>
          ) : (
            <ol className="todoList">
              {visibleTodos.map((t) => (
                <TodoItem
                  key={t.id}
                  todo={t}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onRename={renameTodo}
                />
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
