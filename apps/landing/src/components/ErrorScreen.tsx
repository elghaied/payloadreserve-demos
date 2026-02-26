import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export function ErrorScreen({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  const t = useTranslations('demoStatus')

  const isRateLimit =
    message.toLowerCase().includes('24 hours') || message.toLowerCase().includes('already have')
  const isCapacity = message.toLowerCase().includes('slots') || message.toLowerCase().includes('capacity')

  return (
    <div className="space-y-6 text-center py-4">
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="text-red-400"
        >
          <path d="M12 9v4M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Message */}
      <div>
        <p className="text-white font-medium text-sm mb-1.5">
          {isRateLimit ? t('error.rateLimitTitle') : isCapacity ? t('error.capacityTitle') : t('error.defaultTitle')}
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">{message}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {onRetry && !isRateLimit && (
          <button
            onClick={onRetry}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            {t('error.tryAgain')}
          </button>
        )}
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          ← {t('error.backHome')}
        </Link>
      </div>
    </div>
  )
}
