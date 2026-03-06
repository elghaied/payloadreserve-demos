'use client'

import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'

export function QueueConfirmation({ estimatedAvailability }: { estimatedAvailability: string }) {
  const t = useTranslations('demoStatus')
  const locale = useLocale()

  const estimatedDate = new Date(estimatedAvailability)
  const formatted = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(estimatedDate)

  return (
    <div className="space-y-6 text-center py-4">
      {/* Success icon */}
      <div className="w-12 h-12 rounded-full bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center mx-auto">
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          className="text-violet-500 dark:text-violet-400"
        >
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Message */}
      <div>
        <p className="text-[#1C1917] dark:text-white font-semibold text-sm mb-1.5">
          {t('queue.title')}
        </p>
        <p className="text-[#78716C] dark:text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
          {t('queue.subtitle')}
        </p>
      </div>

      {/* Estimated time */}
      <div className="bg-gray-50 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">
        <p className="text-sm font-medium text-[#1C1917] dark:text-white">
          {t('queue.estimatedTime', { date: formatted })}
        </p>
        <p className="text-xs text-[#78716C] dark:text-zinc-500 mt-1">
          {t('queue.note')}
        </p>
      </div>

      {/* Back home */}
      <Link
        href="/"
        className="inline-block text-xs text-[#78716C] dark:text-zinc-500 hover:text-[#1C1917] dark:hover:text-zinc-300 transition-colors"
      >
        &larr; {t('queue.backHome')}
      </Link>
    </div>
  )
}
