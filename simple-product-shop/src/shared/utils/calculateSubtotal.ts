import type { CartItem } from '@/shared/types'

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((subtotal, item) => subtotal + item.product.price * item.quantity, 0)
}
