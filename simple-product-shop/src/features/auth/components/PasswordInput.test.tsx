import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { PasswordInput } from '@/features/auth/components/PasswordInput'

afterEach(() => {
  cleanup()
})

describe('PasswordInput', () => {
  it('renders a password input', () => {
    render(<PasswordInput value="" onChange={vi.fn()} showRequirements={false} />)

    const input = screen.getByLabelText('Password')

    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'password')
  })

  it('calls onChange when the user types', () => {
    const onChange = vi.fn()
    render(<PasswordInput value="" onChange={onChange} showRequirements={false} />)

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'ValidPass12!' },
    })

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('shows password requirements when showRequirements is true', () => {
    render(<PasswordInput value="ValidPass" onChange={vi.fn()} showRequirements />)

    expect(screen.getByText('At least 12 characters')).toBeInTheDocument()
    expect(screen.getByText('At least one uppercase letter')).toBeInTheDocument()
    expect(screen.getByText('At least one lowercase letter')).toBeInTheDocument()
    expect(screen.getByText('At least one number')).toBeInTheDocument()
    expect(screen.getByText('At least one special character')).toBeInTheDocument()
  })

  it('marks punctuation characters as meeting the special character requirement', () => {
    render(<PasswordInput value="ValidPassword123?" onChange={vi.fn()} showRequirements />)

    expect(screen.getByText('At least one special character').closest('li')).toHaveClass('text-green-700')
  })

  it('shows a visual strength indicator', () => {
    render(<PasswordInput value="ValidPassword123!" onChange={vi.fn()} showRequirements={false} />)

    expect(screen.getByText('Strength: strong')).toBeInTheDocument()
    expect(screen.getByRole('meter', { name: 'Password strength' })).toBeInTheDocument()
  })

  it('uses a descriptive label for the password visibility toggle', () => {
    render(<PasswordInput value="ValidPassword123!" onChange={vi.fn()} showRequirements={false} />)

    const toggleButton = screen.getByRole('button', { name: 'Show password' })
    fireEvent.click(toggleButton)

    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument()
  })
})
