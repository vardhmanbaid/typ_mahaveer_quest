import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-label text-base tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-marigold',
  {
    variants: {
      variant: {
        primary: 'bg-maroon text-parchment shadow-[0_4px_0_0_var(--color-maroon-deep)] hover:brightness-110',
        gold: 'bg-marigold text-indigo shadow-[0_4px_0_0_#a97a26] hover:brightness-105',
        outline: 'border-2 border-maroon text-maroon bg-transparent hover:bg-maroon/5',
        ghost: 'text-maroon hover:bg-maroon/10',
        subtle: 'bg-parchment-dim text-indigo border border-indigo/10 hover:bg-parchment',
      },
      size: {
        default: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        sm: 'h-9 px-4 text-sm',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  }
)

export const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
))
Button.displayName = 'Button'
