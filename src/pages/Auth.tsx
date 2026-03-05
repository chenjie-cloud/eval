import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import Button from '@/components/Button'
import { useAuthStore } from '@/store/authStore'

type Mode = 'login' | 'register'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const register = useAuthStore((s) => s.register)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const from = useMemo(() => {
    const st = location.state as { from?: string } | null
    return st?.from && typeof st.from === 'string' ? st.from : '/'
  }, [location.state])

  async function onSubmit() {
    setError(null)
    setPending(true)
    try {
      const res = mode === 'register' ? await register(email, password) : await login(email, password)
      if (res.ok === false) {
        setError(res.error)
        return
      }
      navigate(from)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        <div className="rounded-[calc(var(--radius)+10px)] border border-[var(--line)] bg-white/45 p-7 shadow-[var(--shadow)] backdrop-blur dark:bg-white/5">
          <div className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)]">Account</div>
          <div className="mt-2 font-[var(--font-display)] text-[28px] tracking-[0.02em]">登录 / 注册</div>
          <div className="mt-3 text-sm text-[var(--muted)]">
            使用邮箱完成登录与注册。数据仅保存在本地，用于演示下单与订单查询。
          </div>

          <div className="mt-6 grid gap-3">
            <div className="grid grid-cols-2 gap-2 rounded-full border border-[var(--line)] bg-white/55 p-1 text-sm dark:bg-white/5">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`h-10 rounded-full transition-colors ${
                  mode === 'login' ? 'bg-[var(--accent)] text-white dark:text-black' : 'hover:bg-white/60 dark:hover:bg-white/10'
                }`}
              >
                登录
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`h-10 rounded-full transition-colors ${
                  mode === 'register'
                    ? 'bg-[var(--accent)] text-white dark:text-black'
                    : 'hover:bg-white/60 dark:hover:bg-white/10'
                }`}
              >
                注册
              </button>
            </div>

            {user ? (
              <div className="rounded-[16px] border border-[var(--line)] bg-white/55 p-5 text-sm dark:bg-white/5">
                <div className="text-xs tracking-[0.14em] uppercase text-[var(--muted)]">Signed in</div>
                <div className="mt-2">{user.email}</div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Link to="/orders" className="w-full sm:w-auto">
                    <Button className="w-full" variant="outline">
                      查看历史订单
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      logout()
                      setEmail('')
                      setPassword('')
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    退出登录
                  </Button>
                </div>
              </div>
            ) : (
              <form
                className="grid gap-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  onSubmit()
                }}
              >
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="邮箱"
                  inputMode="email"
                  autoComplete={mode === 'register' ? 'email' : 'username'}
                  className="h-11 rounded-[12px] border border-[var(--line)] bg-white/55 px-4 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-black/35 dark:bg-white/5 dark:placeholder:text-white/25"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="密码（至少 8 位）"
                  type="password"
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  className="h-11 rounded-[12px] border border-[var(--line)] bg-white/55 px-4 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-black/35 dark:bg-white/5 dark:placeholder:text-white/25"
                />

                {error ? <div className="text-sm text-red-700 dark:text-red-300">{error}</div> : null}

                <Button className="mt-1 w-full" disabled={pending}>
                  {pending ? '处理中…' : mode === 'register' ? '创建账号' : '登录'}
                </Button>

                <div className="text-xs text-[var(--muted)]">
                  {mode === 'register' ? '注册即表示你同意演示站点的使用说明。' : '忘记密码功能暂未开放。'}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="overflow-hidden rounded-[calc(var(--radius)+10px)] border border-[var(--line)] bg-black/5 shadow-[var(--shadow)]">
          <div className="relative aspect-[16/10] sm:aspect-[16/9]">
            <img
              src="/images/editorial.svg"
              alt="Editorial"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/18 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-16 sm:px-8 sm:pb-8">
              <div className="max-w-xl">
                <div className="font-[var(--font-display)] text-[28px] leading-[1.1] tracking-[0.03em] text-white sm:text-[34px]">
                  A cleaner wardrobe rhythm.
                </div>
                <div className="mt-3 text-sm text-white/80">
                  登录后可在结算页填写收货地址，并在历史订单中查看付款记录。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
