'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type Props = {
  locale: string
  className?: string
}

export function LanguageSwitcher({ locale, className }: Props) {
  const pathname = usePathname()
  const otherLocale = locale === 'en' ? 'fr' : 'en'
  const otherPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  return (
    <a
      href={otherPath}
      className={cn(
        'inline-flex items-center justify-center h-8 w-8 rounded-md text-xs font-medium',
        'border border-border text-muted hover:text-foreground hover:border-primary/40 transition-all duration-300',
        className,
      )}
    >
      {otherLocale.toUpperCase()}
    </a>
  )
}
