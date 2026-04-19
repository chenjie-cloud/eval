import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Address = {
  recipient: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
}

export type OrderStatus = 'created' | 'paid'

export type OrderItem = {
  id: string
  productId: string
  title: string
  image: string
  size: string
  quantity: number
  unitPrice: number
}

export type Order = {
  id: string
  status: OrderStatus
  items: OrderItem[]
  address: Address
  subtotal: number
  shippingFee: number
  total: number
  createdAt: string
  paidAt?: string
}

type OrderState = {
  orders: Order[]
  lastAddress: Address | null
  createPaid: (payload: {
    items: Omit<OrderItem, 'id'>[]
    address: Address
    subtotal: number
    shippingFee: number
    total: number
  }) => Order
  setLastAddress: (address: Address) => void
  getById: (id: string) => Order | null
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      lastAddress: null,
      setLastAddress: (address) => set({ lastAddress: address }),
      getById: (id) => get().orders.find((o) => o.id === id) ?? null,
      createPaid: ({ items, address, subtotal, shippingFee, total }) => {
        const now = new Date().toISOString()
        const order: Order = {
          id: uid('o'),
          status: 'paid',
          items: items.map((it) => ({ ...it, id: uid('oi') })),
          address,
          subtotal,
          shippingFee,
          total,
          createdAt: now,
          paidAt: now,
        }
        set({ orders: [order, ...get().orders], lastAddress: address })
        return order
      },
    }),
    {
      name: 'noire:orders',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
)

