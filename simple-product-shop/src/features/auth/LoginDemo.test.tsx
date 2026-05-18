import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { LoginDemo } from '@/features/auth/LoginDemo'

afterEach(() => {
  cleanup()
})

function fillLoginForm(email: string, password = 'ValidPassword123!') {
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: email },
  })
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: password },
  })
}

describe('LoginDemo', () => {
  it('renders email and password inputs', () => {
    render(<LoginDemo />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('disables the submit button when the form is invalid', () => {
    render(<LoginDemo />)

    expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled()
  })

  it('enables the submit button when the form is valid', () => {
    render(<LoginDemo />)

    fillLoginForm('demo@example.com')

    expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled()
  })

  it('shows a success message when signing in with the demo email', () => {
    render(<LoginDemo />)
    fillLoginForm('demo@example.com')

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByText('Welcome, demo@example.com!')).toBeInTheDocument()
  })

  it('shows a lockout message after 3 failed attempts', () => {
    render(<LoginDemo />)

    fillLoginForm('first@example.com')
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    fillLoginForm('second@example.com')
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    fillLoginForm('third@example.com')
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByText('Too many failed attempts. Please try again later.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeDisabled()
    expect(screen.getByLabelText('Password')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled()
  })
})
