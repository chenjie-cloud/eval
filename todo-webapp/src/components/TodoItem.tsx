import { useEffect, useRef, useState } from 'react'
import type { Todo } from '../types'

export type TodoItemProps = {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
}

export const TodoItem = ({ todo, onToggle, onDelete, onRename }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!isEditing) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [isEditing])

  const startEditing = () => {
    setDraft(todo.title)
    setIsEditing(true)
  }

  const commit = () => {
    const next = draft.trim()
    if (!next) {
      setDraft(todo.title)
      setIsEditing(false)
      return
    }
    onRename(todo.id, next)
    setIsEditing(false)
  }

  const cancel = () => {
    setDraft(todo.title)
    setIsEditing(false)
  }

  return (
    <li className="todoItem" data-completed={todo.completed ? 'true' : 'false'}>
      <label className="check">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={todo.completed ? '标记为未完成' : '标记为已完成'}
        />
        <span className="checkMark" aria-hidden="true" />
      </label>

      <div className="content">
        {!isEditing ? (
          <button
            type="button"
            className="title"
            onDoubleClick={startEditing}
            onClick={startEditing}
            aria-label="编辑标题"
          >
            {todo.title}
          </button>
        ) : (
          <input
            ref={inputRef}
            className="editInput"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit()
              if (e.key === 'Escape') cancel()
            }}
            aria-label="编辑待办标题"
          />
        )}
      </div>

      <div className="actions">
        <button type="button" className="ghost" onClick={startEditing}>
          编辑
        </button>
        <button type="button" className="ghost danger" onClick={() => onDelete(todo.id)}>
          删除
        </button>
      </div>
    </li>
  )
}
