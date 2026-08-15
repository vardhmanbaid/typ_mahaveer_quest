import { cn } from '@/lib/utils'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)] border border-indigo/10 bg-white/70 backdrop-blur-sm shadow-[0_2px_0_0_rgba(122,31,43,0.08)]',
        className
      )}
      {...props}
    />
  )
}
export function CardContent({ className, ...props }) {
  return <div className={cn('p-4 sm:p-6', className)} {...props} />
}
