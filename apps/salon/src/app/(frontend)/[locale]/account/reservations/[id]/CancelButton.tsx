'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { cancelReservation } from '../../actions'
import { Modal } from '@/components/Modal'

type Props = {
  reservationId: string
  locale: string
}

export function CancelButton({ reservationId, locale }: Props) {
  const t = useTranslations('account')
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCancel = async () => {
    setLoading(true)
    setError('')
    try {
      await cancelReservation(reservationId, reason)
      setOpen(false)
      router.refresh()
    } catch (e) {
      if (e instanceof Error && e.message === 'TOO_LATE') {
        setError(t('tooLateToCancel'))
      } else {
        setError(t('cancelNotice'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border border-error text-error px-6 py-3 text-sm hover:bg-error hover:text-white transition-colors"
      >
        {t('cancelReservation')}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={t('cancelReservation')}>
        <p className="text-sm text-muted mb-4">{t('cancelConfirm')}</p>

        {error && (
          <div className="bg-error/10 text-error text-sm p-3 mb-4">{error}</div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5">{t('cancellationReason')}</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm text-muted hover:text-foreground"
          >
            {locale === 'fr' ? 'Non' : 'No'}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="bg-error text-white px-4 py-2 text-sm hover:bg-error/90 disabled:opacity-50"
          >
            {loading ? '...' : t('cancelReservation')}
          </button>
        </div>
      </Modal>
    </>
  )
}
