import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@/components/Button'
import Empty from '@/components/Empty'
import { products } from '@/data/products'
import { useAuthStore } from '@/store/authStore'
import { getCartCount, useCartStore } from '@/store/cartStore'
import type { Address } from '@/store/orderStore'
import { useOrderStore } from '@/store/orderStore'
import { formatCny } from '@/utils/money'

function calcShipping(subtotal: number) {
  return subtotal >= 399 ? 0 : 20
}

function isValidCnPhone(v: string) {
  return /^1\d{10}$/.test(v.trim())
}

export default function Checkout() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const lines = useCartStore((s) => s.lines)
  const clearCart = useCartStore((s) => s.clear)

  const lastAddress = useOrderStore((s) => s.lastAddress)
  const createPaid = useOrderStore((s) => s.createPaid)

  const count = getCartCount(lines)
  const detailed = useMemo(() => {
    return lines
      .map((l) => ({
        line: l,
        product: products.find((p) => p.id === l.productId) ?? null,
      }))
      .filter((x) => x.product)
  }, [lines])

  const subtotal = detailed.reduce((acc, x) => acc + (x.product?.price ?? 0) * x.line.quantity, 0)
  const shippingFee = calcShipping(subtotal)
  const total = subtotal + shippingFee

  const [address, setAddress] = useState<Address>(
    lastAddress ?? {
      recipient: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
    },
  )
  const [error, setError] = useState<string | null>(null)

  if (count === 0) {
    return (
      <div className="py-16">
        <Empty
          title="暂无可结算商品"
          description="购物车为空，先挑选一些喜欢的单品。"
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

  if (!user) {
    return (
      <div className="py-16">
        <Empty
          title="请先登录"
          description="为了结算与查看历史订单，需要使用邮箱登录。"
          action={
            <Link
              to="/auth"
              state={{ from: '/checkout' }}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm text-white transition-opacity hover:opacity-90 dark:text-black"
            >
              去登录
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <div>
          <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Checkout</div>
          <div className="mt-2 font-[var(--font-display)] text-[26px] tracking-[0.02em]">下单结算</div>
          <div className="mt-2 text-sm text-[var(--muted)]">登录邮箱：{user.email}</div>
        </div>

        <div className="mt-6 rounded-[calc(var(--radius)+6px)] border border-[var(--line)] bg-white/45 p-6 shadow-[var(--shadow)] backdrop-blur dark:bg-white/5">
          <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Shipping Address</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={address.recipient}
              onChange={(e) => setAddress((a) => ({ ...a, recipient: e.target.value }))}
              placeholder="收件人"
              className="h-11 rounded-[12px] border border-[var(--line)] bg-white/55 px-4 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-black/35 dark:bg-white/5 dark:placeholder:text-white/25"
            />
            <input
              value={address.phone}
              onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
              placeholder="手机号（11 位）"
              inputMode="tel"
              className="h-11 rounded-[12px] border border-[var(--line)] bg-white/55 px-4 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-black/35 dark:bg-white/5 dark:placeholder:text-white/25"
            />
            <input
              value={address.province}
              onChange={(e) => setAddress((a) => ({ ...a, province: e.target.value }))}
              placeholder="省"
              className="h-11 rounded-[12px] border border-[var(--line)] bg-white/55 px-4 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-black/35 dark:bg-white/5 dark:placeholder:text-white/25"
            />
            <input
              value={address.city}
              onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
              placeholder="市"
              className="h-11 rounded-[12px] border border-[var(--line)] bg-white/55 px-4 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-black/35 dark:bg-white/5 dark:placeholder:text-white/25"
            />
            <input
              value={address.district}
              onChange={(e) => setAddress((a) => ({ ...a, district: e.target.value }))}
              placeholder="区"
              className="h-11 rounded-[12px] border border-[var(--line)] bg-white/55 px-4 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-black/35 dark:bg-white/5 dark:placeholder:text-white/25"
            />
            <input
              value={address.detail}
              onChange={(e) => setAddress((a) => ({ ...a, detail: e.target.value }))}
              placeholder="详细地址"
              className="h-11 rounded-[12px] border border-[var(--line)] bg-white/55 px-4 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-black/35 dark:bg-white/5 dark:placeholder:text-white/25 sm:col-span-2"
            />
          </div>
          {error ? <div className="mt-3 text-sm text-red-700 dark:text-red-300">{error}</div> : null}
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="space-y-4 rounded-[calc(var(--radius)+6px)] border border-[var(--line)] bg-white/45 p-6 shadow-[var(--shadow)] backdrop-blur dark:bg-white/5 lg:sticky lg:top-24">
          <div>
            <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Order</div>
            <div className="mt-2 font-[var(--font-display)] text-[22px] tracking-[0.02em]">订单摘要</div>
          </div>

          <div className="space-y-3">
            {detailed.map(({ line, product }) => {
              if (!product) return null
              return (
                <div key={`${line.productId}-${line.size}`} className="flex items-center gap-3">
                  <div className="h-12 w-9 overflow-hidden rounded-[10px] border border-[var(--line)] bg-black/5">
                    <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{product.title}</div>
                    <div className="mt-0.5 text-xs text-[var(--muted)]">
                      {line.size} · x{line.quantity}
                    </div>
                  </div>
                  <div className="text-sm">{formatCny(product.price * line.quantity)}</div>
                </div>
              )
            })}
          </div>

          <div className="h-px bg-[var(--line)]" />

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-[var(--muted)]">商品小计</div>
              <div>{formatCny(subtotal)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[var(--muted)]">运费</div>
              <div>{shippingFee === 0 ? '包邮' : formatCny(shippingFee)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[var(--muted)]">合计</div>
              <div className="text-[16px] tracking-[0.02em]">{formatCny(total)}</div>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              setError(null)
              if (!address.recipient.trim()) return setError('请填写收件人。')
              if (!isValidCnPhone(address.phone)) return setError('请填写有效手机号。')
              if (!address.province.trim() || !address.city.trim() || !address.district.trim())
                return setError('请填写省市区。')
              if (!address.detail.trim()) return setError('请填写详细地址。')

              const items = detailed
                .map(({ line, product }) => {
                  if (!product) return null
                  return {
                    productId: product.id,
                    title: product.title,
                    image: product.images[0],
                    size: line.size,
                    quantity: line.quantity,
                    unitPrice: product.price,
                  }
                })
                .filter(Boolean)

              const order = createPaid({
                items,
                address,
                subtotal,
                shippingFee,
                total,
              })
              clearCart()
              navigate(`/payment/success?orderId=${encodeURIComponent(order.id)}`)
            }}
          >
            立即支付（mock）
          </Button>

          <div className="text-xs text-[var(--muted)]">
            点击即完成付款，并生成可在“历史订单”中查看的订单记录。
          </div>
        </div>
      </div>
    </div>
  )
}
