'use client'

import { useTranslations } from 'next-intl'

export function TestCardBanner() {
  const t = useTranslations('booking')

  return (
    <div className="glass rounded-lg p-4 text-sm mb-8">
      <p className="text-gold font-medium mb-1">{t('testMode')}</p>
      <p className="text-muted">
        {t('testCardNumber')} — {t('testCardHint')}
      </p>
      <p className="text-muted text-xs mt-1">{t('testCardNoCharge')}</p>
    </div>
  )
}
