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
    <div className="flex items-center gap-0.5 rounded-full border border-gray-200 dark:border-stone-700 bg-gray-50 dark:bg-stone-800 p-0.5 text-xs font-semibold">
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={`px-2.5 py-1 rounded-full transition-colors ${
          locale === 'en'
            ? 'bg-white dark:bg-stone-700 text-[#1C1917] dark:text-stone-100 shadow-sm'
            : 'text-[#78716C] dark:text-stone-400 hover:text-[#1C1917] dark:hover:text-stone-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('fr')}
        disabled={isPending}
        className={`px-2.5 py-1 rounded-full transition-colors ${
          locale === 'fr'
            ? 'bg-white dark:bg-stone-700 text-[#1C1917] dark:text-stone-100 shadow-sm'
            : 'text-[#78716C] dark:text-stone-400 hover:text-[#1C1917] dark:hover:text-stone-200'
        }`}
      >
        FR
      </button>
    </div>
  )
}
