import { beforeEach, describe, expect, it } from 'vitest'
import { getCartCount, useCartStore } from '@/store/cartStore'

beforeEach(() => {
  localStorage.clear()
  useCartStore.setState({ lines: [] })
})

describe('cartStore', () => {
  it('counts total quantity', () => {
    expect(getCartCount([])).toBe(0)
    useCartStore.getState().add({ productId: 'p-001', size: 'S', quantity: 2 })
    useCartStore.getState().add({ productId: 'p-002', size: 'M', quantity: 1 })
    expect(getCartCount(useCartStore.getState().lines)).toBe(3)
  })

  it('merges same product and size', () => {
    useCartStore.getState().add({ productId: 'p-001', size: 'S', quantity: 1 })
    useCartStore.getState().add({ productId: 'p-001', size: 'S', quantity: 2 })
    const lines = useCartStore.getState().lines
    expect(lines).toHaveLength(1)
    expect(lines[0].quantity).toBe(3)
  })

  it('clamps quantity to minimum 1', () => {
    useCartStore.getState().add({ productId: 'p-001', size: 'S', quantity: 1 })
    useCartStore.getState().setQuantity('p-001', 'S', 0)
    const line = useCartStore.getState().lines[0]
    expect(line.quantity).toBe(1)
  })

  it('removes line', () => {
    useCartStore.getState().add({ productId: 'p-001', size: 'S', quantity: 1 })
    useCartStore.getState().remove('p-001', 'S')
    expect(useCartStore.getState().lines).toHaveLength(0)
  })
})
