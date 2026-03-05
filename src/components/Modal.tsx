import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export default function Modal({
  open,
  title,
  children,
  onClose,
  className,
}: {
  open: boolean
  title?: string
  children: ReactNode
  onClose: () => void
  className?: string
}) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <button
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="关闭弹窗"
        onClick={onClose}
      />
      <div className="pointer-events-none relative flex min-h-dvh items-end justify-center p-4 sm:items-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title ?? '弹窗'}
          className={cn(
            'pointer-events-auto w-full max-w-lg overflow-hidden rounded-[calc(var(--radius)+8px)] border border-[var(--line)] bg-[var(--bg)] shadow-[var(--shadow)]',
            className,
          )}
        >
          <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-4">
            <div className="font-[var(--font-display)] text-[16px] tracking-[0.04em]">{title}</div>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent transition-colors hover:border-[var(--line)] hover:bg-white/40 dark:hover:bg-white/10"
              aria-label="关闭"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-5 py-5">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
