'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useTransition } from 'react'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function switchLocale(next: string) {
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={locale === 'en'
          ? 'text-[#1C1917] dark:text-stone-100 font-semibold underline underline-offset-2'
          : 'text-[#78716C] dark:text-stone-400 hover:text-[#1C1917] dark:hover:text-stone-200 transition-colors'}
      >
        EN
      </button>
      <span className="text-gray-300 dark:text-stone-600 select-none">·</span>
      <button
        onClick={() => switchLocale('fr')}
        disabled={isPending}
        className={locale === 'fr'
          ? 'text-[#1C1917] dark:text-stone-100 font-semibold underline underline-offset-2'
          : 'text-[#78716C] dark:text-stone-400 hover:text-[#1C1917] dark:hover:text-stone-200 transition-colors'}
      >
        FR
      </button>
    </div>
  )
}
