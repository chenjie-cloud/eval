import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Star } from 'lucide-react'
import Button from '@/components/Button'
import Empty from '@/components/Empty'
import { getProductById } from '@/data/products'
import { getReviewsByProductId } from '@/data/reviews'
import { useCartStore } from '@/store/cartStore'
import { formatCny } from '@/utils/money'

function Stars({ value }: { value: number }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 text-[var(--accent)]"
          fill={i < value ? 'currentColor' : 'transparent'}
        />
      ))}
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const product = id ? getProductById(id) : null

  const add = useCartStore((s) => s.add)
  const [activeImg, setActiveImg] = useState(0)
  const [size, setSize] = useState<string | null>(null)
  const [hint, setHint] = useState<string | null>(null)

  const reviews = useMemo(() => (product ? getReviewsByProductId(product.id) : []), [product])

  if (!product) {
    return (
      <div className="py-16">
        <Empty
          title="商品不存在"
          description="你访问的商品可能已下架或链接有误。"
          action={
            <Link
              to="/products"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm text-white transition-opacity hover:opacity-90 dark:text-black"
            >
              返回商品列表
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <div className="overflow-hidden rounded-[calc(var(--radius)+6px)] border border-[var(--line)] bg-black/5 shadow-[var(--shadow)]">
          <div className="relative aspect-[3/4]">
            <img
              src={product.images[activeImg] ?? product.images[0]}
              alt={product.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-transparent" />
          </div>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {product.images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActiveImg(i)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-[12px] border transition-colors ${
                i === activeImg ? 'border-[var(--accent)]' : 'border-[var(--line)] hover:border-black/30'
              }`}
            >
              <img src={src} alt={`${product.title} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="space-y-6 rounded-[calc(var(--radius)+6px)] border border-[var(--line)] bg-white/45 p-6 shadow-[var(--shadow)] backdrop-blur dark:bg-white/5 lg:sticky lg:top-24">
          <div className="space-y-2">
            <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">
              {product.category}
            </div>
            <div className="font-[var(--font-display)] text-[28px] leading-[1.15] tracking-[0.02em]">
              {product.title}
            </div>
            {product.subtitle ? <div className="text-sm text-[var(--muted)]">{product.subtitle}</div> : null}
            <div className="pt-2 text-[18px] tracking-[0.02em]">{formatCny(product.price)}</div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs tracking-[0.14em] uppercase text-[var(--muted)]">Size</div>
              <button className="text-xs text-[var(--muted)] hover:text-[var(--fg)]" type="button">
                尺码建议
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSize(s)
                    setHint(null)
                  }}
                  className={`h-10 rounded-full border px-4 text-sm transition-colors ${
                    size === s
                      ? 'border-transparent bg-[var(--accent)] text-white dark:text-black'
                      : 'border-[var(--line)] bg-white/55 hover:bg-white/75 dark:bg-white/5 dark:hover:bg-white/10'
                  }`}
                  type="button"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => {
                if (!size) {
                  setHint('请选择尺码后再加入购物车。')
                  return
                }
                add({ productId: product.id, size })
                setHint('已加入购物车')
                window.setTimeout(() => setHint(null), 2200)
              }}
            >
              加入购物车
            </Button>
            {hint ? (
              <div className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
                {hint === '已加入购物车' ? <Check className="h-4 w-4" /> : null}
                <span>{hint}</span>
                {hint === '已加入购物车' ? (
                  <Link to="/cart" className="text-[var(--fg)] underline underline-offset-4">
                    去结算
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="grid gap-2 text-sm">
            <div className="text-xs tracking-[0.14em] uppercase text-[var(--muted)]">尺码信息</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[12px] border border-[var(--line)] bg-white/55 px-4 py-3 dark:bg-white/5">
                <div className="text-xs text-[var(--muted)]">版型</div>
                <div className="mt-1">常规 / 轻修身</div>
              </div>
              <div className="rounded-[12px] border border-[var(--line)] bg-white/55 px-4 py-3 dark:bg-white/5">
                <div className="text-xs text-[var(--muted)]">建议</div>
                <div className="mt-1">介于两码选大一号</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs tracking-[0.14em] uppercase text-[var(--muted)]">用户评价</div>
            {reviews.length === 0 ? (
              <div className="text-sm text-[var(--muted)]">暂时还没有评价。</div>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 3).map((r) => (
                  <div key={r.id} className="rounded-[12px] border border-[var(--line)] bg-white/55 p-4 dark:bg-white/5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {r.title ? <div className="truncate text-sm">{r.title}</div> : null}
                        <div className="mt-1 text-xs text-[var(--muted)]">
                          {new Date(r.createdAt).toLocaleDateString('zh-CN')}
                        </div>
                      </div>
                      <Stars value={r.rating} />
                    </div>
                    <div className="mt-3 text-sm text-[var(--muted)]">{r.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--bg)]/80 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm">{product.title}</div>
            <div className="mt-0.5 text-xs text-[var(--muted)]">{formatCny(product.price)}</div>
          </div>
          <Button
            className="ml-auto shrink-0"
            onClick={() => {
              if (!size) {
                setHint('请选择尺码后再加入购物车。')
                window.scrollTo({ top: 0, behavior: 'smooth' })
                return
              }
              add({ productId: product.id, size })
              setHint('已加入购物车')
              window.setTimeout(() => setHint(null), 2200)
            }}
          >
            加入购物车
          </Button>
        </div>
      </div>
    </div>
  )
}
