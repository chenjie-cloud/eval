import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import Empty from '@/components/Empty'
import ProductCard from '@/components/ProductCard'
import { products } from '@/data/products'
import type { ProductCategory } from '@/types'

const categoryLabel: Record<ProductCategory, string> = {
  dress: '连衣裙',
  tops: '上装',
  outerwear: '外套',
  bottoms: '下装',
}

type SortKey = 'new' | 'hot' | 'price-asc' | 'price-desc'

function normalizeSort(v: string | null): SortKey {
  if (v === 'hot' || v === 'price-asc' || v === 'price-desc') return v
  return 'new'
}

function normalizeCategory(v: string | null): ProductCategory | null {
  if (v === 'dress' || v === 'tops' || v === 'outerwear' || v === 'bottoms') return v
  return null
}

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')

  const category = normalizeCategory(params.get('category'))
  const sort = normalizeSort(params.get('sort'))

  const list = useMemo(() => {
    let base = [...products]
    if (category) base = base.filter((p) => p.category === category)
    if (q.trim()) {
      const s = q.trim()
      base = base.filter((p) => p.title.includes(s) || (p.subtitle ?? '').includes(s))
    }
    if (sort === 'hot') base.sort((a, b) => b.popularity - a.popularity)
    if (sort === 'new') base.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    if (sort === 'price-asc') base.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') base.sort((a, b) => b.price - a.price)
    return base
  }, [category, q, sort])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Catalog</div>
          <div className="mt-2 font-[var(--font-display)] text-[26px] tracking-[0.02em]">女装</div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[320px]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索：针织 / 衬衫 / 西装…"
              className="h-11 w-full rounded-full border border-[var(--line)] bg-white/55 px-4 pr-10 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-black/35 dark:bg-white/5 dark:placeholder:text-white/25"
            />
            <SlidersHorizontal className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          </div>

          <select
            value={sort}
            onChange={(e) => {
              const next = new URLSearchParams(params)
              next.set('sort', e.target.value)
              setParams(next)
            }}
            className="h-11 rounded-full border border-[var(--line)] bg-white/55 px-4 text-sm outline-none transition-colors focus:border-black/35 dark:bg-white/5"
          >
            <option value="new">最新</option>
            <option value="hot">热销</option>
            <option value="price-asc">价格升序</option>
            <option value="price-desc">价格降序</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            const next = new URLSearchParams(params)
            next.delete('category')
            setParams(next)
          }}
          className={`h-9 rounded-full border px-4 text-sm transition-colors ${
            !category
              ? 'border-transparent bg-[var(--accent)] text-white dark:text-black'
              : 'border-[var(--line)] bg-white/45 hover:bg-white/65 dark:bg-white/5 dark:hover:bg-white/10'
          }`}
        >
          全部
        </button>
        {(Object.keys(categoryLabel) as ProductCategory[]).map((c) => (
          <button
            key={c}
            onClick={() => {
              const next = new URLSearchParams(params)
              next.set('category', c)
              setParams(next)
            }}
            className={`h-9 rounded-full border px-4 text-sm transition-colors ${
              category === c
                ? 'border-transparent bg-[var(--accent)] text-white dark:text-black'
                : 'border-[var(--line)] bg-white/45 hover:bg-white/65 dark:bg-white/5 dark:hover:bg-white/10'
            }`}
          >
            {categoryLabel[c]}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="py-16">
          <Empty
            title="没有找到匹配商品"
            description="尝试更换类目或清空搜索关键词。"
            action={
              <Link
                to="/products"
                className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm text-white transition-opacity hover:opacity-90 dark:text-black"
              >
                清空筛选
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
