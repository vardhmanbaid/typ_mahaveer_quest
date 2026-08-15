import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide', {
  variants: {
    variant: {
      gold: 'bg-marigold/20 text-maroon-deep border border-marigold/50',
      maroon: 'bg-maroon text-parchment',
      ok: 'bg-ok/15 text-ok border border-ok/40',
      bad: 'bg-bad/15 text-bad border border-bad/40',
      outline: 'border border-indigo/20 text-indigo/70',
    },
  },
  defaultVariants: { variant: 'gold' },
})

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
