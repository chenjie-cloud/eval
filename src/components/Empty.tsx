import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type EmptyProps = {
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function Empty({ title, description, action, className }: EmptyProps) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-[520px] flex-col items-center justify-center gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-6 py-10 text-center shadow-[var(--shadow)] backdrop-blur',
        className,
      )}
    >
      <div className="font-[var(--font-display)] text-[20px] tracking-[0.02em]">{title ?? '敬请期待'}</div>
      {description ? <div className="text-sm text-[var(--muted)]">{description}</div> : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  )
}
