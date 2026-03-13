'use client'

import { useTranslations } from 'next-intl'
import { getEventTypeColor } from '@/lib/event-colors'
import type { Booking, EventType, Venue } from '@/payload-types'

const STATUS_COLORS: Record<string, string> = {
  pending: '#d69e2e',
  confirmed: '#38a169',
  completed: '#666666',
  cancelled: '#e53e3e',
  'no-show': '#dd6b20',
}

interface BookingCardProps {
  booking: Booking
  onCancel?: (bookingId: string) => void
}

function isPopulated<T extends { id: string }>(val: string | T): val is T {
  return typeof val === 'object' && val !== null
}

function canCancel(booking: Booking): boolean {
  if (booking.status !== 'confirmed') return false
  const start = new Date(booking.startTime)
  const now = new Date()
  const hoursUntil = (start.getTime() - now.getTime()) / (1000 * 60 * 60)
  return hoursUntil > 48
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const t = useTranslations('account')

  const eventType = isPopulated<EventType>(booking.service)
    ? booking.service
    : null
  const venue = isPopulated<Venue>(booking.resource)
    ? booking.resource
    : null

  const status = booking.status ?? 'pending'
  const statusColor = STATUS_COLORS[status] ?? '#666666'
  const eventTypeColor = eventType ? getEventTypeColor(eventType.name) : '#666666'

  const startDate = new Date(booking.startTime)
  const dateStr = startDate.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeStr = startDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const showCancel = canCancel(booking)

  return (
    <div className="border-[3px] border-black">
      {/* Color bar top */}
      <div className="h-[6px]" style={{ backgroundColor: eventTypeColor }} />

      <div className="p-5">
        {/* Header: event type + status */}
        <div className="mb-4 flex items-start justify-between">
          {eventType && (
            <span
              className="inline-block px-2 py-1 font-mono text-[10px] uppercase tracking-[2px] text-white"
              style={{ backgroundColor: eventTypeColor }}
            >
              {eventType.name}
            </span>
          )}
          <span
            className="inline-block px-2 py-1 font-mono text-[10px] uppercase tracking-[2px] text-white"
            style={{ backgroundColor: statusColor }}
          >
            {t(`status.${status}`)}
          </span>
        </div>

        {/* Venue */}
        {venue && (
          <p className="mb-1 text-lg font-black uppercase tracking-[-0.5px]">
            {venue.name}
          </p>
        )}

        {/* Date / Time */}
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
          {dateStr}
        </div>
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
          {timeStr}
        </div>

        {/* Ticket count */}
        {booking.ticketQuantity && booking.ticketQuantity > 0 && (
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[2px]">
            {t('ticketCount', { count: booking.ticketQuantity })}
          </p>
        )}

        {/* Cancel button */}
        {showCancel && onCancel && (
          <button
            onClick={() => onCancel(booking.id)}
            className="w-full border-[3px] border-[#e53e3e] bg-white px-4 py-2 font-mono text-[10px] uppercase tracking-[2px] text-[#e53e3e] transition-colors hover:bg-[#e53e3e] hover:text-white"
          >
            {t('cancelBooking')}
          </button>
        )}
      </div>
    </div>
  )
}
