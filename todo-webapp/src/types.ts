export type TodoId = string

export type Todo = {
  id: TodoId
  title: string
  completed: boolean
  createdAt: number
}

export type TodoFilter = 'all' | 'active' | 'completed'

