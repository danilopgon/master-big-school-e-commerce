import { use } from 'react'

import { CartContext } from '@/context/CartContextValue'

export function useCart() {
  const cart = use(CartContext)

  if (!cart) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return cart
}
