export type ProductCategory = 'dress' | 'tops' | 'outerwear' | 'bottoms'

export type Product = {
  id: string
  title: string
  subtitle?: string
  category: ProductCategory
  price: number
  currency: 'CNY'
  images: string[]
  sizes: string[]
  color?: string
  popularity: number
  createdAt: string
}

export type Review = {
  id: string
  productId: string
  rating: number
  title?: string
  content: string
  createdAt: string
}

