import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { formatCny } from '@/utils/money'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group block overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-white/40 shadow-[var(--shadow)] backdrop-blur transition-transform hover:-translate-y-0.5 dark:bg-white/5"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-black/5">
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="flex items-start justify-between gap-3 px-4 py-4">
        <div className="min-w-0">
          <div className="truncate text-sm">{product.title}</div>
          {product.subtitle ? (
            <div className="mt-1 truncate text-xs text-[var(--muted)]">{product.subtitle}</div>
          ) : null}
        </div>
        <div className="shrink-0 text-sm tracking-[0.02em]">{formatCny(product.price)}</div>
      </div>
    </Link>
  )
}

