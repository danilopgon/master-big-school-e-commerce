import { Skeleton } from '@/shared/components/Skeleton'

export function ProductCardSkeleton() {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <Skeleton variant="rectangular" width="100%" height="10rem" />
      <div className="mt-4 space-y-2">
        <Skeleton variant="text" width="70%" height="1.5rem" />
        <Skeleton variant="text" width="100%" height="1rem" />
        <Skeleton variant="text" width="85%" height="1rem" />
        <Skeleton variant="text" width="4.5rem" height="1.25rem" />
      </div>
      <div className="mt-4">
        <Skeleton variant="rectangular" width="7rem" height="2.5rem" />
      </div>
    </article>
  )
}
