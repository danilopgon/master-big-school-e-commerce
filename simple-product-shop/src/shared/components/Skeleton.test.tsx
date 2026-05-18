import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Skeleton } from '@/shared/components/Skeleton'

afterEach(() => {
  cleanup()
})

describe('Skeleton', () => {
  it('renders an accessible status placeholder with pulse animation', () => {
    render(<Skeleton />)

    const skeleton = screen.getByRole('status', { hidden: true })

    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('applies a text variant class', () => {
    render(<Skeleton variant="text" />)

    expect(screen.getByRole('status', { hidden: true })).toHaveClass('rounded')
  })

  it('applies a rectangular variant class', () => {
    render(<Skeleton variant="rectangular" />)

    expect(screen.getByRole('status', { hidden: true })).toHaveClass('rounded-md')
  })

  it('applies a circular variant class', () => {
    render(<Skeleton variant="circular" />)

    expect(screen.getByRole('status', { hidden: true })).toHaveClass('rounded-full')
  })

  it('accepts custom width and height', () => {
    render(<Skeleton width="12rem" height={48} />)

    expect(screen.getByRole('status', { hidden: true })).toHaveStyle({
      width: '12rem',
      height: '48px',
    })
  })
})
