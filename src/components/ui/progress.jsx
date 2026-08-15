import { cn } from '@/lib/utils'

export function Progress({ value = 0, className, barClassName }) {
  return (
    <div className={cn('h-3 w-full overflow-hidden rounded-full bg-indigo/10', className)}>
      <div
        className={cn('h-full rounded-full bg-gradient-to-r from-marigold to-maroon transition-all duration-500 ease-out', barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
