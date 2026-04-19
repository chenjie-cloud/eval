import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/Button'
import Modal from '@/components/Modal'

const SEEN_KEY = 'noire:newUserModalSeen'

export default function NewUserModal() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')

  const shouldShow = useMemo(() => {
    return localStorage.getItem(SEEN_KEY) !== '1'
  }, [])

  useEffect(() => {
    if (!shouldShow) return
    const t = window.setTimeout(() => setOpen(true), 650)
    return () => window.clearTimeout(t)
  }, [shouldShow])

  function close() {
    localStorage.setItem(SEEN_KEY, '1')
    setOpen(false)
  }

  return (
    <Modal open={open} title="新用户礼遇" onClose={close}>
      <div className="space-y-4">
        <div className="text-sm text-[var(--muted)]">
          首次访问为你保留新人折扣码：<span className="font-medium text-[var(--fg)]">NOIRE-NEW</span>
        </div>

        <div className="grid gap-2">
          <label className="text-xs tracking-[0.14em] uppercase text-[var(--muted)]">Email（可选）</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputMode="email"
            placeholder="you@example.com"
            className="h-11 rounded-[12px] border border-[var(--line)] bg-white/55 px-4 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-black/35 dark:bg-white/5 dark:placeholder:text-white/25"
          />
          <div className="text-xs text-[var(--muted)]">
            仅用于演示，不会实际发送或保存订阅信息。
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link to="/products?sort=new" onClick={close} className="w-full sm:w-auto">
            <Button className="w-full">去逛新品</Button>
          </Link>
          <Button variant="outline" className="w-full sm:w-auto" onClick={close}>
            稍后再说
          </Button>
        </div>
      </div>
    </Modal>
  )
}

