import { type ReactNode, useEffect, useReducer, useRef } from 'react'

import { CartContext } from '@/context/CartContextValue'
import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import { DiscountCalculator } from '@/shared/strategies/DiscountCalculator'
import type { CartItem, Product } from '@/shared/types'
import { calculateSubtotal } from '@/shared/utils'

const STORAGE_KEY = 'cart'
const discountCalculator = new DiscountCalculator()

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }

function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = items.find((item) => item.product.id === action.product.id)

      if (existingItem) {
        return items.map((item) =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + BUSINESS_RULES.quantity.step }
            : item,
        )
      }

      return [...items, { product: action.product, quantity: BUSINESS_RULES.quantity.minimum }]
    }
    case 'REMOVE_ITEM':
      return items.filter((item) => item.product.id !== action.productId)
    case 'UPDATE_QUANTITY':
      if (action.quantity < BUSINESS_RULES.quantity.minimum) {
        return items.filter((item) => item.product.id !== action.productId)
      }

      return items.map((item) =>
        item.product.id === action.productId ? { ...item, quantity: action.quantity } : item,
      )
    case 'CLEAR_CART':
      return []
  }
}

function initializeCart(): CartItem[] {
  const storedCart = localStorage.getItem(STORAGE_KEY)

  if (!storedCart) {
    return []
  }

  return JSON.parse(storedCart) as CartItem[]
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, initializeCart)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  const subtotal = calculateSubtotal(items)
  const discountBreakdown = discountCalculator.getBreakdown(items, subtotal)
  const discount = discountCalculator.calculate(items, subtotal)
  const total = subtotal - discount

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        total,
        discountBreakdown,
        addItem: (product) => dispatch({ type: 'ADD_ITEM', product }),
        removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', productId }),
        updateQuantity: (productId, quantity) =>
          dispatch({ type: 'UPDATE_QUANTITY', productId, quantity }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
