import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type CartLine = {
  productId: string
  size: string
  quantity: number
}

type CartState = {
  lines: CartLine[]
  add: (line: Omit<CartLine, 'quantity'> & { quantity?: number }) => void
  setQuantity: (productId: string, size: string, quantity: number) => void
  remove: (productId: string, size: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: ({ productId, size, quantity }) => {
        const q = Math.max(1, Math.floor(quantity ?? 1))
        const existing = get().lines
        const idx = existing.findIndex((l) => l.productId === productId && l.size === size)
        if (idx >= 0) {
          const next = [...existing]
          next[idx] = { ...next[idx], quantity: next[idx].quantity + q }
          set({ lines: next })
          return
        }
        set({ lines: [...existing, { productId, size, quantity: q }] })
      },
      setQuantity: (productId, size, quantity) => {
        const q = Math.max(1, Math.floor(quantity))
        set({
          lines: get()
            .lines.map((l) => (l.productId === productId && l.size === size ? { ...l, quantity: q } : l)),
        })
      },
      remove: (productId, size) => {
        set({ lines: get().lines.filter((l) => !(l.productId === productId && l.size === size)) })
      },
      clear: () => set({ lines: [] }),
    }),
    {
      name: 'noire:cart',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
)

export function getCartCount(lines: CartLine[]) {
  return lines.reduce((acc, l) => acc + l.quantity, 0)
}

