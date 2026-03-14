'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { createPaymentSession } from '../../actions'
import { Button } from '@/components/ui/button'

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
        <div className="bg-destructive/10 text-destructive text-sm p-3 mb-3 rounded-lg border border-destructive/20">
          {error}
        </div>
      )}
      <Button onClick={handleClick} disabled={loading}>
        {loading ? '...' : t('completePayment')}
      </Button>
    </div>
  )
}
