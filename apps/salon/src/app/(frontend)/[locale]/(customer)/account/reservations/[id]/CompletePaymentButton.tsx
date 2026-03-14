'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { createPaymentSession } from '../../actions'

type Props = {
  reservationId: string
  locale: string
}

export function CompletePaymentButton({ reservationId, locale }: Props) {
  const t = useTranslations('account')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClick = async () => {
    setLoading(true)
    setError('')
    try {
      const { checkoutUrl } = await createPaymentSession(reservationId, locale)
      window.location.href = checkoutUrl
    } catch {
      setError(t('completePaymentError'))
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="bg-error/10 text-error text-sm p-3 mb-3">{error}</div>
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-primary text-white px-6 py-3 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {loading ? '...' : t('completePayment')}
      </button>
    </div>
  )
}
