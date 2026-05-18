import { createContext } from 'react'

import type { CartItem, Product } from '@/shared/types'

export type DiscountBreakdownItem = {
  name: string
  amount: number
}

export type CartContextValue = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  discount: number
  total: number
  discountBreakdown: DiscountBreakdownItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
