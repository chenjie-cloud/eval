import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import Button from '@/components/Button'
import Empty from '@/components/Empty'
import QuantityStepper from '@/components/QuantityStepper'
import { products } from '@/data/products'
import { getCartCount, useCartStore } from '@/store/cartStore'
import { formatCny } from '@/utils/money'

function calcShipping(subtotal: number) {
  return subtotal >= 399 ? 0 : 20
}

export default function Cart() {
  const lines = useCartStore((s) => s.lines)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const remove = useCartStore((s) => s.remove)

  const count = getCartCount(lines)
  const detailed = lines
    .map((l) => ({
      line: l,
      product: products.find((p) => p.id === l.productId) ?? null,
    }))
    .filter((x) => x.product)

  const subtotal = detailed.reduce((acc, x) => acc + (x.product?.price ?? 0) * x.line.quantity, 0)
  const shippingFee = calcShipping(subtotal)
  const total = subtotal + shippingFee

  if (count === 0) {
    return (
      <div className="py-16">
        <Empty
          title="购物车为空"
          description="把喜欢的单品加入购物车，再回来结算。"
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
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Cart</div>
            <div className="mt-2 font-[var(--font-display)] text-[26px] tracking-[0.02em]">
              购物车（{count}）
            </div>
          </div>
          <Link to="/products" className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">
            继续逛逛
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          {detailed.map(({ line, product }) => {
            if (!product) return null
            return (
              <div
                key={`${line.productId}-${line.size}`}
                className="flex gap-4 rounded-[calc(var(--radius)+6px)] border border-[var(--line)] bg-white/45 p-4 shadow-[var(--shadow)] backdrop-blur dark:bg-white/5"
              >
                <Link
                  to={`/products/${product.id}`}
                  className="h-28 w-20 shrink-0 overflow-hidden rounded-[12px] border border-[var(--line)] bg-black/5"
                >
                  <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/products/${product.id}`} className="truncate text-sm hover:opacity-80">
                        {product.title}
                      </Link>
                      <div className="mt-1 text-xs text-[var(--muted)]">尺码：{line.size}</div>
                    </div>
                    <div className="shrink-0 text-sm tracking-[0.02em]">
                      {formatCny(product.price * line.quantity)}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <QuantityStepper
                      value={line.quantity}
                      onChange={(next) => setQuantity(line.productId, line.size, next)}
                    />
                    <button
                      type="button"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/55 px-4 text-sm transition-colors hover:bg-white/75 dark:bg-white/5 dark:hover:bg-white/10"
                      onClick={() => remove(line.productId, line.size)}
                    >
                      <Trash2 className="h-4 w-4" />
                      删除
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="space-y-4 rounded-[calc(var(--radius)+6px)] border border-[var(--line)] bg-white/45 p-6 shadow-[var(--shadow)] backdrop-blur dark:bg-white/5 lg:sticky lg:top-24">
          <div>
            <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Summary</div>
            <div className="mt-2 font-[var(--font-display)] text-[22px] tracking-[0.02em]">订单摘要</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-[var(--muted)]">商品小计</div>
              <div>{formatCny(subtotal)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[var(--muted)]">运费</div>
              <div>{shippingFee === 0 ? '包邮' : formatCny(shippingFee)}</div>
            </div>
            <div className="h-px bg-[var(--line)]" />
            <div className="flex items-center justify-between">
              <div className="text-[var(--muted)]">合计</div>
              <div className="text-[16px] tracking-[0.02em]">{formatCny(total)}</div>
            </div>
          </div>

          <Link to="/checkout">
            <Button className="w-full">去结算</Button>
          </Link>

          <div className="text-xs text-[var(--muted)]">支付为演示用 mock，点击即付款完成。</div>
        </div>
      </div>
    </div>
  )
}
