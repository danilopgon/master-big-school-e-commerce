import { useState } from 'react'

import { hasSpecialCharacter, validatePassword } from '@/shared/utils/validatePassword'

type PasswordInputProps = {
  value: string
  onChange: (value: string) => void
  showRequirements: boolean
}

type Requirement = {
  label: string
  isMet: boolean
}

const strengthStyles = {
  weak: {
    width: 'w-1/3',
    color: 'bg-red-500',
    value: 1,
  },
  medium: {
    width: 'w-2/3',
    color: 'bg-amber-400',
    value: 2,
  },
  strong: {
    width: 'w-full',
    color: 'bg-green-500',
    value: 3,
  },
} as const

export function PasswordInput({ value, onChange, showRequirements }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const validation = validatePassword(value)
  const strength = strengthStyles[validation.strength]
  const requirements: Requirement[] = [
    { label: 'At least 12 characters', isMet: value.length >= 12 },
    { label: 'At least one uppercase letter', isMet: /[A-Z]/.test(value) },
    { label: 'At least one lowercase letter', isMet: /[a-z]/.test(value) },
    { label: 'At least one number', isMet: /\d/.test(value) },
    { label: 'At least one special character', isMet: hasSpecialCharacter(value) },
  ]

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          aria-label="Password"
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 pr-11 text-slate-950 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
        />
        <button
          type="button"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

      {showRequirements ? (
        <ul className="space-y-1 text-sm">
          {requirements.map((requirement) => (
            <li
              key={requirement.label}
              className={requirement.isMet ? 'font-medium text-green-700' : 'font-medium text-red-700'}
            >
              <span aria-hidden="true">{requirement.isMet ? '✓' : '✗'}</span> {requirement.label}
            </li>
          ))}
        </ul>
      ) : null}

      <div>
        <div className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
          <span>Strength: {validation.strength}</span>
        </div>
        <div
          role="meter"
          aria-label="Password strength"
          aria-valuemin={0}
          aria-valuemax={3}
          aria-valuenow={strength.value}
          aria-valuetext={validation.strength}
          className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        >
          <div className={`h-full rounded-full ${strength.width} ${strength.color}`} />
        </div>
      </div>
    </div>
  )
}
