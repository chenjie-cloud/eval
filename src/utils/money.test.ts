import { describe, expect, it } from 'vitest'
import { formatCny } from '@/utils/money'

describe('formatCny', () => {
  it('formats integer amount', () => {
    const s = formatCny(299)
    expect(s).toMatch(/299/)
  })
})

