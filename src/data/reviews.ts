import type { Review } from '@/types'

export const reviews: Review[] = [
  {
    id: 'r-001',
    productId: 'p-003',
    rating: 5,
    title: '肩线很利落',
    content: '版型很挺，搭配牛仔裤也很有气场。面料不易皱，通勤友好。',
    createdAt: '2026-02-26T10:00:00.000Z',
  },
  {
    id: 'r-002',
    productId: 'p-003',
    rating: 4,
    title: '颜色高级',
    content: '深蓝比想象中更耐看，内搭白衬衫很好看。建议按平时尺码选。',
    createdAt: '2026-02-22T10:00:00.000Z',
  },
  {
    id: 'r-003',
    productId: 'p-001',
    rating: 5,
    title: '显瘦',
    content: '针织弹力很好，修身但不紧。上身很干净，搭配外套也不臃肿。',
    createdAt: '2026-02-19T10:00:00.000Z',
  },
  {
    id: 'r-004',
    productId: 'p-002',
    rating: 4,
    title: '面料舒适',
    content: '棉质挺括但不硬，单穿或叠穿都好看。袖口细节不错。',
    createdAt: '2026-02-14T10:00:00.000Z',
  },
]

export function getReviewsByProductId(productId: string) {
  return reviews.filter((r) => r.productId === productId)
}

