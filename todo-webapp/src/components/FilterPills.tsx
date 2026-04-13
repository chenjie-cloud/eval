import type { TodoFilter } from '../types'

const FILTERS: Array<{ key: TodoFilter; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '未完成' },
  { key: 'completed', label: '已完成' },
]

export type FilterPillsProps = {
  value: TodoFilter
  onChange: (value: TodoFilter) => void
}

export const FilterPills = ({ value, onChange }: FilterPillsProps) => {
  return (
    <div className="filterPills" role="tablist" aria-label="筛选">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          type="button"
          className="pill"
          data-active={value === f.key ? 'true' : 'false'}
          onClick={() => onChange(f.key)}
          role="tab"
          aria-selected={value === f.key}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

