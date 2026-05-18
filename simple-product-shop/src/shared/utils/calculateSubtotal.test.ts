import { describe, expect, it } from 'vitest'

import type { CartItem } from '@/shared/types'
import { calculateSubtotal } from '@/shared/utils/calculateSubtotal'

describe('calculateSubtotal', () => {
  const keyboard: CartItem = {
    product: {
      id: 'mechanical-keyboard',
      name: 'Mechanical Keyboard',
      price: 119.99,
      image: 'https://picsum.photos/seed/keyboard/200',
      description: 'Compact mechanical keyboard with tactile switches and backlit keys.',
    },
    quantity: 2,
  }

  const usbHub: CartItem = {
    product: {
      id: 'usb-c-hub',
      name: 'USB-C Hub',
      price: 34.99,
      image: 'https://picsum.photos/seed/usb-hub/200',
      description: 'Portable multiport hub with HDMI, USB, and fast data transfer.',
    },
    quantity: 3,
  }

  it('returns 0 for an empty cart', () => {
    expect(calculateSubtotal([])).toBe(0)
  })

  it('returns the subtotal for one item', () => {
    expect(calculateSubtotal([keyboard])).toBe(239.98)
  })

  it('returns the subtotal for multiple items', () => {
    expect(calculateSubtotal([keyboard, usbHub])).toBe(344.95)
  })
})
