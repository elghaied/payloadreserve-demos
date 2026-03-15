'use client'

import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import type { Booking } from '@/payload-types'

interface CancelDialogProps {
  booking: Booking
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  loading: boolean
}

function isWithin48Hours(booking: Booking): boolean {
  const start = new Date(booking.startTime)
  const now = new Date()
  const hoursUntil = (start.getTime() - now.getTime()) / (1000 * 60 * 60)
  return hoursUntil <= 48
}

export function CancelDialog({
  booking,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: CancelDialogProps) {
  const t = useTranslations('account')
  const tCommon = useTranslations('common')
  const tooSoon = isWithin48Hours(booking)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-none border-[3px] border-black bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-[-1px]">
            {t('cancelBooking')}
          </DialogTitle>
          <DialogDescription className="mt-2 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
            {tooSoon ? t('cancelWarning') : t('cancelConfirm')}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex gap-3 rounded-none border-0 bg-transparent p-0 sm:flex-row">
          {!tooSoon && (
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-[#e53e3e] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-[#c53030] disabled:opacity-50"
            >
              {loading ? '...' : t('cancelBooking')}
            </button>
          )}
          <DialogClose
            render={
              <button className="flex-1 border-[3px] border-black bg-white px-4 py-2.5 font-mono text-[10px] uppercase tracking-[2px] text-black transition-colors hover:bg-neutral-100" />
            }
          >
            {tCommon('close')}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
