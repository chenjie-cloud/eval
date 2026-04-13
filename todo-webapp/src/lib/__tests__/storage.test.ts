import { afterEach, describe, expect, it, vi } from 'vitest'
import type { PersistedStateV1 } from '../storage'
import { loadState, saveState } from '../storage'

const STORAGE_KEY = 'todo-webapp:state'

describe('storage', () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('saveState writes JSON and loadState restores it', () => {
    const state: PersistedStateV1 = {
      v: 1,
      filter: 'active',
      todos: [
        { id: 'a', title: '  test  ', completed: false, createdAt: 1 },
        { id: 'b', title: 'done', completed: true, createdAt: 2 },
      ],
    }

    saveState(state)
    const loaded = loadState()
    expect(loaded).toEqual({
      v: 1,
      filter: 'active',
      todos: [
        { id: 'a', title: 'test', completed: false, createdAt: 1 },
        { id: 'b', title: 'done', completed: true, createdAt: 2 },
      ],
    })
  })

  it('loadState returns null for invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadState()).toBeNull()
  })

  it('loadState returns null for wrong version', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ v: 2, todos: [], filter: 'all' }),
    )
    expect(loadState()).toBeNull()
  })

  it('loadState drops invalid todos and falls back filter', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        v: 1,
        todos: [
          { id: 'ok', title: 'ok', completed: false, createdAt: 1 },
          { bad: true },
        ],
        filter: 'weird',
      }),
    )

    expect(loadState()).toEqual({
      v: 1,
      todos: [{ id: 'ok', title: 'ok', completed: false, createdAt: 1 }],
      filter: 'all',
    })
  })

  it('saveState ignores storage errors', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })

    saveState({ v: 1, todos: [], filter: 'all' })
    expect(spy).toHaveBeenCalled()
  })
})

