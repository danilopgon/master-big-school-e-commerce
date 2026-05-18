import { useState } from 'react'

import { PasswordInput } from '@/features/auth/components/PasswordInput'
import { validatePassword } from '@/shared/utils/validatePassword'

type FormStatus = 'idle' | 'success' | 'error' | 'locked'

const MAX_FAILED_ATTEMPTS = 3
const DEMO_EMAIL = 'demo@example.com'

export function LoginDemo() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [failedAttempts, setFailedAttempts] = useState(0)
  const isLocked = status === 'locked'
  const isFormValid = isValidEmail(email) && validatePassword(password).isValid
  const attemptsRemaining = MAX_FAILED_ATTEMPTS - failedAttempts

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isFormValid || isLocked) {
      return
    }

    if (email === DEMO_EMAIL) {
      setStatus('success')
      return
    }

    const nextFailedAttempts = failedAttempts + 1
    setFailedAttempts(nextFailedAttempts)
    setStatus(nextFailedAttempts >= MAX_FAILED_ATTEMPTS ? 'locked' : 'error')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div>
        <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-50">Secure login demo</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Use {DEMO_EMAIL} with a strong password to simulate a successful sign in.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            disabled={isLocked}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-950 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
          />
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</span>
          <fieldset disabled={isLocked} className="disabled:opacity-60">
            <PasswordInput value={password} onChange={setPassword} showRequirements />
          </fieldset>
        </div>
      </div>

      {status === 'success' ? (
        <p className="mt-4 rounded bg-green-100 px-3 py-2 text-sm font-medium text-green-800 dark:bg-green-400/20 dark:text-green-200">
          Welcome, {email}!
        </p>
      ) : null}

      {status === 'error' ? (
        <p className="mt-4 rounded bg-red-100 px-3 py-2 text-sm font-medium text-red-800 dark:bg-red-400/20 dark:text-red-200">
          Invalid credentials. {attemptsRemaining} {attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining.
        </p>
      ) : null}

      {status === 'locked' ? (
        <p className="mt-4 rounded bg-red-100 px-3 py-2 text-sm font-medium text-red-800 dark:bg-red-400/20 dark:text-red-200">
          Too many failed attempts. Please try again later.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!isFormValid || isLocked}
        className="mt-5 w-full rounded bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
      >
        Sign in
      </button>
    </form>
  )
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
