'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { BookingCard } from './BookingCard'
import { CancelDialog } from './CancelDialog'
import { fetchBookings, cancelBooking } from '@/app/(frontend)/[locale]/(customer)/account/actions'
import type { Booking, Customer } from '@/payload-types'

interface AccountViewProps {
  locale: string
}

export function AccountView({ locale: _locale }: AccountViewProps) {
  const t = useTranslations('account')

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  // Cancel dialog state
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  const loadBookings = useCallback(async (customerId: string) => {
    const result = await fetchBookings(customerId)
    if (result.success) {
      setBookings(result.bookings as Booking[])
    }
  }, [])

  // Fetch customer session and bookings on mount
  useEffect(() => {
    fetch('/api/customer-session', { credentials: 'include' })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.user) {
          setCustomer(data.user as Customer)
          await loadBookings(data.user.id)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [loadBookings])

  const handleCancelRequest = useCallback(
    (bookingId: string) => {
      const booking = bookings.find((b) => b.id === bookingId)
      if (booking) setCancelTarget(booking)
    },
    [bookings],
  )

  const handleCancelConfirm = useCallback(async () => {
    if (!cancelTarget || !customer) return
    setCancelLoading(true)
    const result = await cancelBooking(cancelTarget.id)
    if (result.success) {
      await loadBookings(customer.id)
    }
    setCancelLoading(false)
    setCancelTarget(null)
  }, [cancelTarget, customer, loadBookings])

  if (loading) {
    return (
      <div>
        <p className="text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
          {t('title')}...
        </p>
      </div>
    )
  }

  const now = new Date()
  const upcomingBookings = bookings.filter(
    (b) =>
      new Date(b.startTime) > now &&
      b.status !== 'cancelled' &&
      b.status !== 'completed',
  )
  const pastBookings = bookings.filter(
    (b) =>
      new Date(b.startTime) <= now ||
      b.status === 'cancelled' ||
      b.status === 'completed',
  )

  return (
    <div>
      {/* Upcoming bookings */}
      <div className="mb-12">
        <h2 className="mb-1 text-2xl font-black uppercase tracking-[-0.5px]">
          {t('upcomingBookings')}
        </h2>
        <div className="mb-6 h-[3px] w-12 bg-black" />

        {upcomingBookings.length === 0 ? (
          <p className="py-10 text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
            {t('noUpcoming')}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelRequest}
              />
            ))}
          </div>
        )}
      </div>

      {/* Past bookings */}
      <div>
        <h2 className="mb-1 text-2xl font-black uppercase tracking-[-0.5px]">
          {t('pastBookings')}
        </h2>
        <div className="mb-6 h-[3px] w-12 bg-black" />

        {pastBookings.length === 0 ? (
          <p className="py-10 text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
            {t('noPast')}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>

      {/* Cancel dialog */}
      {cancelTarget && (
        <CancelDialog
          booking={cancelTarget}
          open={!!cancelTarget}
          onOpenChange={(open) => {
            if (!open) setCancelTarget(null)
          }}
          onConfirm={handleCancelConfirm}
          loading={cancelLoading}
        />
      )}
    </div>
  )
}
