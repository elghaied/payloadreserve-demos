import { cn } from '@/lib/utils'

type Props = {
  className?: string
  variant?: 'diamond' | 'line' | 'monogram'
}

export function Ornament({ className, variant = 'diamond' }: Props) {
  if (variant === 'line') {
    return (
      <div className={cn('flex items-center gap-4 justify-center', className)}>
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/40" />
        <div className="w-1.5 h-1.5 rotate-45 bg-primary/60" />
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/40" />
      </div>
    )
  }

  if (variant === 'monogram') {
    return (
      <div className={cn('relative select-none', className)}>
        <span className="font-heading text-6xl lg:text-7xl font-bold text-gradient-copper opacity-20 leading-none">
          GH
        </span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-3 justify-center', className)}>
      <div className="h-px w-8 bg-primary/30" />
      <div className="w-2 h-2 rotate-45 border border-primary/50" />
      <div className="h-px w-8 bg-primary/30" />
    </div>
  )
}
