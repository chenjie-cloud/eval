import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type User = { email: string }
type StoredUser = { email: string; passwordHash: string; createdAt: string }

type AuthResult = { ok: true } | { ok: false; error: string }

type AuthState = {
  user: User | null
  register: (email: string, password: string) => Promise<AuthResult>
  login: (email: string, password: string) => Promise<AuthResult>
  logout: () => void
}

const USERS_KEY = 'noire:users'

function normalizeEmail(v: string) {
  return v.trim().toLowerCase()
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

async function sha256Hex(text: string) {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(text))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const arr = raw ? (JSON.parse(raw) as StoredUser[]) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function writeUsers(next: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(next))
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      logout: () => set({ user: null }),
      register: async (email, password) => {
        const e = normalizeEmail(email)
        if (!isValidEmail(e)) return { ok: false, error: '请输入有效邮箱。' }
        if (password.trim().length < 8) return { ok: false, error: '密码至少 8 位。' }

        const users = readUsers()
        if (users.some((u) => u.email === e)) return { ok: false, error: '该邮箱已注册。' }

        const passwordHash = await sha256Hex(password)
        const now = new Date().toISOString()
        writeUsers([{ email: e, passwordHash, createdAt: now }, ...users])
        set({ user: { email: e } })
        return { ok: true }
      },
      login: async (email, password) => {
        const e = normalizeEmail(email)
        if (!isValidEmail(e)) return { ok: false, error: '请输入有效邮箱。' }
        const users = readUsers()
        const target = users.find((u) => u.email === e)
        if (!target) return { ok: false, error: '邮箱或密码不正确。' }
        const passwordHash = await sha256Hex(password)
        if (passwordHash !== target.passwordHash) return { ok: false, error: '邮箱或密码不正确。' }
        set({ user: { email: e } })
        return { ok: true }
      },
    }),
    {
      name: 'noire:session',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (s) => ({ user: s.user }),
    },
  ),
)
