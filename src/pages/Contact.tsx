import { useMemo, useState } from 'react'
import { Mail, Send } from 'lucide-react'
import Button from '@/components/Button'

const SUPPORT_EMAIL = 'support@noire.example'

export default function Contact() {
  const [subject, setSubject] = useState('咨询')
  const [orderId, setOrderId] = useState('')
  const [message, setMessage] = useState('')

  const mailto = useMemo(() => {
    const s = orderId.trim() ? `${subject}（订单号：${orderId.trim()}）` : subject
    const body = message.trim() ? message.trim() : '你好，我想咨询以下问题：'
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(body)}`
  }, [message, orderId, subject])

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        <div className="rounded-[calc(var(--radius)+10px)] border border-[var(--line)] bg-white/45 p-7 shadow-[var(--shadow)] backdrop-blur dark:bg-white/5">
          <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Contact</div>
          <div className="mt-2 font-[var(--font-display)] text-[28px] tracking-[0.02em]">邮件联系官方</div>
          <div className="mt-3 text-sm text-[var(--muted)]">
            通过邮件进行咨询、售后或合作。演示站点会使用本地邮件客户端发送。
          </div>

          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/55 px-5 py-3 text-sm transition-colors hover:bg-white/75 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <Mail className="h-4 w-4" />
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="rounded-[calc(var(--radius)+10px)] border border-[var(--line)] bg-white/45 p-7 shadow-[var(--shadow)] backdrop-blur dark:bg-white/5">
          <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Email Draft</div>
          <div className="mt-2 font-[var(--font-display)] text-[22px] tracking-[0.02em]">快速生成邮件内容</div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="主题"
              className="h-11 rounded-[12px] border border-[var(--line)] bg-white/55 px-4 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-black/35 dark:bg-white/5 dark:placeholder:text-white/25"
            />
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="订单号（可选）"
              className="h-11 rounded-[12px] border border-[var(--line)] bg-white/55 px-4 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-black/35 dark:bg-white/5 dark:placeholder:text-white/25"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="描述你的问题…"
              className="min-h-40 rounded-[12px] border border-[var(--line)] bg-white/55 px-4 py-3 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-black/35 dark:bg-white/5 dark:placeholder:text-white/25 sm:col-span-2"
            />
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
            <a href={mailto} className="w-full sm:w-auto">
              <Button className="w-full">
                <Send className="h-4 w-4" />
                打开邮件并发送
              </Button>
            </a>
            <div className="text-xs text-[var(--muted)]">
              发送依赖本地邮件客户端；不会在站内保存你的内容。
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[calc(var(--radius)+10px)] border border-[var(--line)] bg-white/30 p-7 text-sm text-[var(--muted)] shadow-[var(--shadow)] backdrop-blur dark:bg-white/5">
          常见问题与政策页面尚未上线，入口将展示“敬请期待”。
        </div>
      </div>
    </div>
  )
}
