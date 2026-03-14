'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { cancelReservation } from '../../actions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type Props = {
  reservationId: string
  locale: string
}

export function CancelButton({ reservationId }: Props) {
  const t = useTranslations('account')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" />}>
        {t('cancelReservation')}
      </DialogTrigger>

      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>{t('cancelReservation')}</DialogTitle>
          <DialogDescription>{t('cancelConfirm')}</DialogDescription>
        </DialogHeader>

        {error && (
          <div
            role="alert"
            className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20"
          >
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">{t('cancellationReason')}</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full border border-border px-4 py-3 text-sm bg-surface text-foreground rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            {tCommon('cancel')}
          </Button>
          <Button variant="destructive" onClick={handleCancel} disabled={loading}>
            {loading ? '...' : t('cancelReservation')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
