import { cn } from '@/lib/utils'
import type { PropsWithChildren, ReactNode } from 'react'

type ChartCardProps = PropsWithChildren<{
  title: string
  subtitle?: string
  right?: ReactNode
  className?: string
  bodyClassName?: string
}>

export default function ChartCard({
  title,
  subtitle,
  right,
  className,
  bodyClassName,
  children,
}: ChartCardProps) {
  return (
    <section
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--card)] shadow-[var(--shadow)]',
        'transition-transform duration-200 will-change-transform hover:-translate-y-0.5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-5">
        <div className="min-w-0">
          <h2 className="truncate font-[Fraunces] text-[15px] font-semibold tracking-[0.02em] text-[color:var(--text)]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-xs text-[color:var(--muted)]">{subtitle}</p>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className={cn('px-3 pb-4', bodyClassName)}>{children}</div>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[color:var(--accent)]/10 blur-2xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[color:var(--accent-2)]/10 blur-2xl" />
      </div>
    </section>
  )
}

