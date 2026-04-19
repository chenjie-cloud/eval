import { Link, NavLink, useLocation } from 'react-router-dom'
import { Search, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { getCartCount, useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'text-[13px] tracking-[0.14em] uppercase transition-colors',
          isActive ? 'text-[var(--fg)]' : 'text-[var(--muted)] hover:text-[var(--fg)]',
        )
      }
      end={to === '/'}
    >
      {label}
    </NavLink>
  )
}

function IconLink({
  to,
  label,
  children,
}: {
  to: string
  label: string
  children: ReactNode
}) {
  const location = useLocation()

  return (
    <Link
      to={to}
      state={{ from: location.pathname + location.search }}
      aria-label={label}
      className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent transition-colors hover:border-[var(--line)] hover:bg-white/40 dark:hover:bg-white/10"
    >
      <span className="text-[var(--fg)] opacity-80 transition-opacity group-hover:opacity-100">{children}</span>
    </Link>
  )
}

export default function Header() {
  const cartCount = useCartStore((s) => getCartCount(s.lines))
  const user = useAuthStore((s) => s.user)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--bg)]/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="select-none font-[var(--font-display)] text-[18px] tracking-[0.18em]"
        >
          NOIRÉ
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavItem to="/products?sort=new" label="New In" />
          <NavItem to="/products?category=dress" label="Dresses" />
          <NavItem to="/products?category=tops" label="Tops" />
          <NavItem to="/products?category=outerwear" label="Outerwear" />
          <NavItem to="/coming-soon" label="Accessories" />
        </nav>

        <div className="flex items-center gap-1">
          <IconLink to="/products" label="搜索">
            <Search className="h-4 w-4" />
          </IconLink>
          <IconLink to={user ? '/orders' : '/auth'} label="账户">
            <User className="h-4 w-4" />
          </IconLink>
          <IconLink to="/cart" label="购物车">
            <span className="relative">
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[11px] text-white dark:text-black">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              ) : null}
            </span>
          </IconLink>
        </div>
      </div>
    </header>
  )
}
