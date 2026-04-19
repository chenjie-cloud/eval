import { Link, useParams } from 'react-router-dom'
import Empty from '@/components/Empty'
import { useAuthStore } from '@/store/authStore'
import { useOrderStore } from '@/store/orderStore'
import { formatCny } from '@/utils/money'

export default function OrderDetail() {
  const user = useAuthStore((s) => s.user)
  const { id } = useParams()
  const order = useOrderStore((s) => (id ? s.getById(id) : null))

  if (!user) {
    return (
      <div className="py-16">
        <Empty
          title="请先登录"
          description="登录后可查看订单详情。"
          action={
            <Link
              to="/auth"
              state={{ from: `/orders/${id ?? ''}` }}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm text-white transition-opacity hover:opacity-90 dark:text-black"
            >
              去登录
            </Link>
          }
        />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="py-16">
        <Empty
          title="未找到订单"
          description="你访问的订单可能不存在。"
          action={
            <Link
              to="/orders"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm text-white transition-opacity hover:opacity-90 dark:text-black"
            >
              返回订单列表
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Order</div>
          <div className="mt-2 font-[var(--font-display)] text-[26px] tracking-[0.02em]">订单详情</div>
          <div className="mt-2 text-sm text-[var(--muted)]">订单号：{order.id}</div>
        </div>
        <Link to="/orders" className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">
          返回订单列表
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-[calc(var(--radius)+6px)] border border-[var(--line)] bg-white/45 p-6 shadow-[var(--shadow)] backdrop-blur dark:bg-white/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Status</div>
                <div className="mt-2 text-sm">{order.status === 'paid' ? '已支付' : '待支付'}</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Total</div>
                <div className="mt-2 text-[18px] tracking-[0.02em]">{formatCny(order.total)}</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-[var(--muted)]">
              创建：{new Date(order.createdAt).toLocaleString('zh-CN')}
              {order.paidAt ? ` · 支付：${new Date(order.paidAt).toLocaleString('zh-CN')}` : null}
            </div>
          </div>

          <div className="rounded-[calc(var(--radius)+6px)] border border-[var(--line)] bg-white/45 p-6 shadow-[var(--shadow)] backdrop-blur dark:bg-white/5">
            <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Items</div>
            <div className="mt-4 space-y-3">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  <div className="h-14 w-10 overflow-hidden rounded-[10px] border border-[var(--line)] bg-black/5">
                    <img src={it.image} alt={it.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{it.title}</div>
                    <div className="mt-0.5 text-xs text-[var(--muted)]">
                      {it.size} · x{it.quantity}
                    </div>
                  </div>
                  <div className="text-sm">{formatCny(it.unitPrice * it.quantity)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-[calc(var(--radius)+6px)] border border-[var(--line)] bg-white/45 p-6 shadow-[var(--shadow)] backdrop-blur dark:bg-white/5 lg:sticky lg:top-24">
            <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Address</div>
            <div className="mt-3 text-sm">{order.address.recipient}</div>
            <div className="mt-1 text-sm text-[var(--muted)]">{order.address.phone}</div>
            <div className="mt-3 text-sm text-[var(--muted)]">
              {order.address.province} {order.address.city} {order.address.district}
            </div>
            <div className="mt-1 text-sm text-[var(--muted)]">{order.address.detail}</div>

            <div className="mt-6 h-px bg-[var(--line)]" />

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="text-[var(--muted)]">商品小计</div>
                <div>{formatCny(order.subtotal)}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[var(--muted)]">运费</div>
                <div>{order.shippingFee === 0 ? '包邮' : formatCny(order.shippingFee)}</div>
              </div>
              <div className="h-px bg-[var(--line)]" />
              <div className="flex items-center justify-between">
                <div className="text-[var(--muted)]">合计</div>
                <div className="text-[16px] tracking-[0.02em]">{formatCny(order.total)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
