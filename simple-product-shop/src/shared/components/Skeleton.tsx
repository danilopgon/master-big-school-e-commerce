type SkeletonVariant = 'text' | 'rectangular' | 'circular'

type SkeletonProps = {
  variant?: SkeletonVariant
  width?: string | number
  height?: string | number
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: 'rounded',
  rectangular: 'rounded-md',
  circular: 'rounded-full',
}

function toSizeValue(value: string | number | undefined) {
  return typeof value === 'number' ? `${value}px` : value
}

export function Skeleton({ variant = 'text', width, height }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-hidden="true"
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${variantClasses[variant]}`}
      style={{
        width: toSizeValue(width),
        height: toSizeValue(height),
      }}
    />
  )
}
