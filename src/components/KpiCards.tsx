import type { KpiSummary } from '@/data/types'
import { cn } from '@/lib/utils'
import { formatCompactNumber, formatCurrencyCny, formatDeltaPct, formatPercent } from '@/utils/format'
import { ArrowDownRight, ArrowUpRight, BadgeDollarSign, Percent, Users } from 'lucide-react'
import type { ReactNode } from 'react'

function KpiCard({
  label,
  value,
  valueClassName,
  delta,
  icon,
}: {
  label: string
  value: string
  valueClassName?: string
  delta: number
  icon: ReactNode
}) {
  const up = delta >= 0
  const DeltaIcon = up ? ArrowUpRight : ArrowDownRight
  const deltaColor = up ? 'text-emerald-300/90' : 'text-rose-300/90'

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--card)] shadow-[var(--shadow)]',
        'px-5 py-4 transition-transform duration-200 will-change-transform hover:-translate-y-0.5',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-[color:var(--muted)]">{label}</p>
          <p className={cn('mt-2 truncate text-[28px] font-semibold tracking-tight text-[color:var(--text)]', valueClassName)}>
            {value}
          </p>
          <div className={cn('mt-1 inline-flex items-center gap-1 text-xs', deltaColor)}>
            <DeltaIcon className="h-3.5 w-3.5" />
            <span className="tabular-nums">{formatDeltaPct(delta)}</span>
            <span className="text-[color:var(--muted-2)]">较昨日</span>
          </div>
        </div>
        <div className="relative mt-0.5 shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 text-[color:var(--text)]">
          {icon}
        </div>
      </div>
      <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[color:var(--accent)]/10 blur-2xl" />
    </div>
  )
}

export default function KpiCards({ data }: { data: KpiSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <KpiCard
        label="用户数"
        value={formatCompactNumber(data.users)}
        delta={data.deltas.usersPct}
        icon={<Users className="h-5 w-5" />}
      />
      <KpiCard
        label="转化率"
        value={formatPercent(data.conversionRate, 1)}
        delta={data.deltas.conversionRatePct}
        icon={<Percent className="h-5 w-5" />}
      />
      <KpiCard
        label="日均收入"
        value={formatCurrencyCny(data.avgDailyRevenue)}
        delta={data.deltas.avgDailyRevenuePct}
        icon={<BadgeDollarSign className="h-5 w-5" />}
      />
    </div>
  )
}
