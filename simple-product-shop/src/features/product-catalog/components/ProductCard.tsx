import { useEffect, useRef, useState } from 'react'

import { UI_TEXT } from '@/shared/constants'
import { useCurrency } from '@/shared/hooks'
import type { Product } from '@/shared/types'

type ProductCardProps = {
  product: Product
  onAddToCart: (product: Product) => void | Promise<void>
}

type ButtonState = 'idle' | 'loading' | 'success' | 'error'

const buttonStyles: Record<ButtonState, string> = {
  idle: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-500 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400',
  loading:
    'cursor-wait bg-slate-500 text-white focus-visible:outline-slate-500 dark:bg-slate-600 dark:text-slate-50',
  success:
    'bg-green-600 text-white hover:bg-green-700 focus-visible:outline-green-500 dark:bg-green-500 dark:text-slate-950 dark:hover:bg-green-400',
  error:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-500 dark:bg-red-500 dark:text-slate-950 dark:hover:bg-red-400',
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [buttonState, setButtonState] = useState<ButtonState>('idle')
  const timeoutId = useRef<number | null>(null)
  const currency = useCurrency()

  useEffect(() => {
    return () => {
      if (timeoutId.current !== null) {
        window.clearTimeout(timeoutId.current)
      }
    }
  }, [])

  function resetButtonAfterFeedback() {
    if (timeoutId.current !== null) {
      window.clearTimeout(timeoutId.current)
    }

    timeoutId.current = window.setTimeout(() => {
      setButtonState('idle')
      timeoutId.current = null
    }, 1500)
  }

  async function handleAddToCart() {
    if (buttonState === 'loading') {
      return
    }

    setButtonState('loading')

    try {
      await onAddToCart(product)
      setButtonState('success')
    } catch {
      setButtonState('error')
    }

    resetButtonAfterFeedback()
  }

  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <img src={product.image} alt={product.name} className="mb-4 h-40 w-full rounded object-cover" />
      <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">{product.name}</h2>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
        {product.description}
      </p>
      <p className="mt-1 font-medium text-slate-700 dark:text-slate-200">
        {currency.format(product.price)}
      </p>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={buttonState === 'loading'}
        className={`mt-4 inline-flex items-center gap-2 rounded px-4 py-2 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait ${buttonStyles[buttonState]}`}
      >
        {buttonState === 'loading' && (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {buttonState === 'success' && <span aria-hidden="true">✓</span>}
        {buttonState === 'idle' && UI_TEXT.addToCart}
        {buttonState === 'loading' && 'Adding...'}
        {buttonState === 'success' && UI_TEXT.addedToCart}
        {buttonState === 'error' && 'Failed'}
      </button>
    </article>
  )
}
