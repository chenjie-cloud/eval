import { Minus, Plus } from 'lucide-react'

export default function QuantityStepper({
  value,
  min = 1,
  onChange,
}: {
  value: number
  min?: number
  onChange: (next: number) => void
}) {
  return (
    <div className="inline-flex h-10 items-center overflow-hidden rounded-full border border-[var(--line)] bg-white/55 dark:bg-white/5">
      <button
        type="button"
        aria-label="减少数量"
        className="inline-flex h-full w-10 items-center justify-center transition-colors hover:bg-white/60 dark:hover:bg-white/10"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="min-w-10 px-3 text-center text-sm tabular-nums">{value}</div>
      <button
        type="button"
        aria-label="增加数量"
        className="inline-flex h-full w-10 items-center justify-center transition-colors hover:bg-white/60 dark:hover:bg-white/10"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

