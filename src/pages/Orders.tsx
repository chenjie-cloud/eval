import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Empty from '@/components/Empty'
import { useAuthStore } from '@/store/authStore'
import { useOrderStore } from '@/store/orderStore'
import { formatCny } from '@/utils/money'

export default function Orders() {
  const user = useAuthStore((s) => s.user)
  const orders = useOrderStore((s) => s.orders)

  if (!user) {
    return (
      <div className="py-16">
        <Empty
          title="请先登录"
          description="登录后可查看历史订单。"
          action={
            <Link
              to="/auth"
              state={{ from: '/orders' }}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm text-white transition-opacity hover:opacity-90 dark:text-black"
            >
              去登录
            </Link>
          }
        />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="py-16">
        <Empty
          title="还没有订单"
          description="完成一次 mock 支付后，订单会出现在这里。"
          action={
            <Link
              to="/products?sort=new"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm text-white transition-opacity hover:opacity-90 dark:text-black"
            >
              去逛新品
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Orders</div>
        <div className="mt-2 font-[var(--font-display)] text-[26px] tracking-[0.02em]">历史订单</div>
        <div className="mt-2 text-sm text-[var(--muted)]">登录邮箱：{user.email}</div>
      </div>

      <div className="space-y-3">
        {orders.map((o) => (
          <Link
            key={o.id}
            to={`/orders/${o.id}`}
            className="group flex items-center gap-4 rounded-[calc(var(--radius)+6px)] border border-[var(--line)] bg-white/45 p-5 shadow-[var(--shadow)] backdrop-blur transition-transform hover:-translate-y-0.5 dark:bg-white/5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <div className="text-sm tracking-[0.02em]">订单号：{o.id}</div>
                <div className="rounded-full border border-[var(--line)] bg-white/55 px-3 py-1 text-xs text-[var(--muted)] dark:bg-white/5">
                  {o.status === 'paid' ? '已支付' : '待支付'}
                </div>
              </div>
              <div className="mt-2 text-xs text-[var(--muted)]">
                {new Date(o.createdAt).toLocaleString('zh-CN')} · {o.items.length} 件商品
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Total</div>
              <div className="mt-2 text-[16px] tracking-[0.02em]">{formatCny(o.total)}</div>
            </div>

            <ChevronRight className="h-4 w-4 text-[var(--muted)] transition-colors group-hover:text-[var(--fg)]" />
          </Link>
        ))}
      </div>
    </div>
  )
}
