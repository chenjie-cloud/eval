import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg)]/60 backdrop-blur">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <div className="font-[var(--font-display)] text-[18px] tracking-[0.16em]">NOIRÉ</div>
          <div className="mt-3 max-w-md text-sm text-[var(--muted)]">
            以大图与克制版式呈现衣橱必备单品。支付流程为演示用 mock，实现“点击即支付完成”。
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:col-span-7 md:grid-cols-3">
          <div className="grid gap-2 text-sm">
            <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Shop</div>
            <Link className="hover:opacity-80" to="/products?sort=new">
              New In
            </Link>
            <Link className="hover:opacity-80" to="/products?category=dress">
              Dresses
            </Link>
            <Link className="hover:opacity-80" to="/products?category=outerwear">
              Outerwear
            </Link>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Help</div>
            <Link className="hover:opacity-80" to="/coming-soon">
              Shipping
            </Link>
            <Link className="hover:opacity-80" to="/coming-soon">
              Returns
            </Link>
            <Link className="hover:opacity-80" to="/coming-soon">
              Size Guide
            </Link>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Contact</div>
            <Link className="inline-flex items-center gap-2 hover:opacity-80" to="/contact">
              <Mail className="h-4 w-4" />
              邮件联系
            </Link>
            <div className="text-xs text-[var(--muted)]">support@noire.example</div>
          </div>
        </div>

        <div className="md:col-span-12">
          <div className="flex flex-col justify-between gap-3 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)] sm:flex-row">
            <div>© {new Date().getFullYear()} NOIRÉ</div>
            <div className="flex gap-4">
              <Link className="hover:opacity-80" to="/coming-soon">
                隐私政策
              </Link>
              <Link className="hover:opacity-80" to="/coming-soon">
                服务条款
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

