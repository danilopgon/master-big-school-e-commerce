import { useEffect } from 'react'

type ToastVariant = 'success' | 'error' | 'info'

type ToastProps = {
  message: string
  variant: ToastVariant
  onClose: () => void
}

const variantClasses: Record<ToastVariant, string> = {
  success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-400/20 dark:text-green-200 dark:border-green-400/30',
  error: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-400/20 dark:text-red-200 dark:border-red-400/30',
  info: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-400/20 dark:text-blue-200 dark:border-blue-400/30',
}

export function Toast({ message, variant, onClose }: ToastProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, 3000)

    return () => window.clearTimeout(timeoutId)
  }, [onClose])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-center justify-between gap-4 rounded border px-4 py-3 shadow-sm ${variantClasses[variant]}`}
    >
      <p className="text-sm font-medium">{message}</p>
      <button
        type="button"
        aria-label="Close notification"
        onClick={onClose}
        className="rounded p-1 font-semibold leading-none transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current dark:hover:bg-white/10"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}
