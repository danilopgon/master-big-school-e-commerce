import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Toast } from '@/shared/components/Toast'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('Toast', () => {
  it('renders the message as an accessible alert', () => {
    render(<Toast message="Product added to cart" variant="success" onClose={vi.fn()} />)

    const toast = screen.getByRole('alert')

    expect(toast).toHaveAttribute('aria-live', 'assertive')
    expect(toast).toHaveTextContent('Product added to cart')
  })

  it('applies the success color variant', () => {
    render(<Toast message="Saved" variant="success" onClose={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveClass('bg-green-100')
  })

  it('applies the error color variant', () => {
    render(<Toast message="Failed" variant="error" onClose={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveClass('bg-red-100')
  })

  it('applies the info color variant', () => {
    render(<Toast message="Syncing" variant="info" onClose={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveClass('bg-blue-100')
  })

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn()
    render(<Toast message="Saved" variant="success" onClose={onClose} />)

    fireEvent.click(screen.getByRole('button', { name: 'Close notification' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('auto-closes after 3 seconds', () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    render(<Toast message="Saved" variant="success" onClose={onClose} />)

    vi.advanceTimersByTime(3000)

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
