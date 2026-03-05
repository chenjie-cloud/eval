import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import Empty from '@/components/Empty'
import { useOrderStore } from '@/store/orderStore'
import { formatCny } from '@/utils/money'

export default function PaymentSuccess() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')
  const order = useOrderStore((s) => (orderId ? s.getById(orderId) : null))

  if (!order) {
    return (
      <div className="py-16">
        <Empty title="未找到订单" description="请从结算页完成支付后再查看。" />
      </div>
    )
  }

  return (
    <div className="py-10 sm:py-14">
      <div className="mx-auto max-w-2xl rounded-[calc(var(--radius)+10px)] border border-[var(--line)] bg-white/45 p-6 shadow-[var(--shadow)] backdrop-blur dark:bg-white/5 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-white dark:text-black">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-[var(--font-display)] text-[26px] tracking-[0.02em]">付款完成</div>
            <div className="mt-2 text-sm text-[var(--muted)]">订单号：{order.id}</div>
            <div className="mt-1 text-sm text-[var(--muted)]">
              支付时间：{order.paidAt ? new Date(order.paidAt).toLocaleString('zh-CN') : '-'}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs tracking-[0.14em] uppercase text-[var(--muted)]">Total</div>
            <div className="mt-2 text-[18px] tracking-[0.02em]">{formatCny(order.total)}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
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

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            to={`/orders/${order.id}`}
            className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm text-white transition-opacity hover:opacity-90 dark:text-black"
          >
            查看订单详情
          </Link>
          <Link
            to="/products?sort=new"
            className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--line)] bg-white/55 px-5 text-sm transition-colors hover:bg-white/75 dark:bg-white/5 dark:hover:bg-white/10"
          >
            继续购物
          </Link>
        </div>

        <div className="mt-6 text-xs text-[var(--muted)]">
          支付流程为 mock：点击支付即完成，并写入本地订单记录。
        </div>
      </div>
    </div>
  )
}
