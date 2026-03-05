import { Link } from 'react-router-dom'
import Carousel from '@/components/Carousel'
import NewUserModal from '@/components/NewUserModal'
import ProductCard from '@/components/ProductCard'
import { products } from '@/data/products'

export default function Home() {
  const newIn = [...products].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6)
  const best = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 6)

  return (
    <div className="space-y-12">
      <Carousel
        slides={[
          {
            image:
              'https://images.unsplash.com/photo-1520975958221-2bcd02bf563e?auto=format&fit=crop&w=1800&q=80',
            title: 'Black / Beige / Navy',
            description: '一套更克制的衣橱语法：干净线条、大面积留白与细节质感。',
            align: 'left',
          },
          {
            image:
              'https://images.unsplash.com/photo-1520975869010-4b96f0f8af37?auto=format&fit=crop&w=1800&q=80',
            title: 'Tailored, not loud',
            description: '廓形与比例把握得刚好，让每一次出门都更轻松。',
            align: 'left',
          },
          {
            image:
              'https://images.unsplash.com/photo-1520975894604-9a8b7c1b2e9b?auto=format&fit=crop&w=1800&q=80',
            title: 'Everyday polish',
            description: '通勤、周末、旅行，都能在极简中保持松弛。',
            align: 'left',
          },
        ]}
      />

      <section className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {[
          { k: 'Shipping', v: '满 ¥399 包邮（mock）' },
          { k: 'Return', v: '7 天无忧退换（演示）' },
          { k: 'Support', v: '邮件联系官方' },
        ].map((x) => (
          <div
            key={x.k}
            className="rounded-[var(--radius)] border border-[var(--line)] bg-white/45 px-5 py-4 text-sm shadow-[var(--shadow)] backdrop-blur dark:bg-white/5"
          >
            <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">{x.k}</div>
            <div className="mt-2">{x.v}</div>
          </div>
        ))}
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">New In</div>
            <div className="mt-2 font-[var(--font-display)] text-[22px] tracking-[0.02em]">新品推荐</div>
          </div>
          <Link to="/products?sort=new" className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">
            查看全部
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {newIn.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Best Sellers</div>
            <div className="mt-2 font-[var(--font-display)] text-[22px] tracking-[0.02em]">热销商品</div>
          </div>
          <Link to="/products?sort=hot" className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">
            查看全部
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {best.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <NewUserModal />
    </div>
  )
}
