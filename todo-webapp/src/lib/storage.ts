import type { Todo, TodoFilter } from '../types'

export type PersistedStateV1 = {
  v: 1
  todos: Todo[]
  filter: TodoFilter
}

const STORAGE_KEY = 'todo-webapp:state'

const isTodo = (value: unknown): value is Todo => {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.title === 'string' &&
    typeof v.completed === 'boolean' &&
    typeof v.createdAt === 'number'
  )
}

const isFilter = (value: unknown): value is TodoFilter =>
  value === 'all' || value === 'active' || value === 'completed'

export const loadState = (): PersistedStateV1 | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const v = parsed as Record<string, unknown>
    if (v.v !== 1) return null

    const todosRaw = v.todos
    if (!Array.isArray(todosRaw)) return null
    const todos = todosRaw.filter(isTodo).map((t) => ({
      ...t,
      title: t.title.trim(),
    }))

    const filter = isFilter(v.filter) ? v.filter : 'all'
    return { v: 1, todos, filter }
  } catch {
    return null
  }
}

export const saveState = (state: PersistedStateV1) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    return
  }
}

