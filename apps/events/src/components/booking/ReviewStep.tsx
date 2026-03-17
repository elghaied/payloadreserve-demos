'use client'

import { useTranslations } from 'next-intl'
import type { EventType, Venue } from '@/payload-types'
import { getEventTypeColor } from '@/lib/event-colors'
import { toBcp47 } from '@/lib/utils'
import type { CustomerInfo } from './TicketInfoStep'
import { TestCardBanner } from './TestCardBanner'

export function ReviewStep({
  eventType,
  venue,
  date,
  time,
  ticketQuantity,
  customerInfo,
  cancellationPolicy,
  locale,
  isSubmitting,
  onConfirm,
}: {
  eventType: EventType
  venue: Venue
  date: Date
  time: string
  ticketQuantity: number
  customerInfo: CustomerInfo
  cancellationPolicy: string
  locale: string
  isSubmitting: boolean
  onConfirm: () => void
}) {
  const t = useTranslations('booking')
  const color = getEventTypeColor(eventType.name)
  const price = eventType.price ?? 0
  const total = price * ticketQuantity

  const formattedDate = date.toLocaleDateString(toBcp47(locale), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div>
      <h2 className="mb-6 text-2xl font-black uppercase tracking-[-1px]">
        {t('review')}
      </h2>
      <TestCardBanner />
      <div className="border-[3px] border-black">
        <table className="w-full">
          <tbody>
            <tr className="border-b-[3px] border-black">
              <td className="px-5 py-4 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                {t('eventType')}
              </td>
              <td className="px-5 py-4 text-right">
                <span
                  className="inline-block px-2 py-0.5 font-mono text-[9px] uppercase tracking-[2px] text-white"
                  style={{ backgroundColor: color }}
                >
                  {eventType.name}
                </span>
              </td>
            </tr>
            <tr className="border-b-[3px] border-black">
              <td className="px-5 py-4 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                {t('venue')}
              </td>
              <td className="px-5 py-4 text-right font-bold">{venue.name}</td>
            </tr>
            <tr className="border-b-[3px] border-black">
              <td className="px-5 py-4 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                {t('date')}
              </td>
              <td className="px-5 py-4 text-right font-bold">{formattedDate}</td>
            </tr>
            <tr className="border-b-[3px] border-black">
              <td className="px-5 py-4 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                {t('time')}
              </td>
              <td className="px-5 py-4 text-right font-bold">{time}</td>
            </tr>
            <tr className="border-b-[3px] border-black">
              <td className="px-5 py-4 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                {t('tickets')}
              </td>
              <td className="px-5 py-4 text-right font-bold">
                {ticketQuantity} &times; {price}&euro;
              </td>
            </tr>
            <tr className="border-b-[3px] border-black bg-neutral-50">
              <td className="px-5 py-4 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                {t('totalPrice')}
              </td>
              <td className="px-5 py-4 text-right text-xl font-black">{total}&euro;</td>
            </tr>
            <tr>
              <td className="px-5 py-4 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                {t('customerInfo')}
              </td>
              <td className="px-5 py-4 text-right text-sm">
                <p className="font-bold">{customerInfo.firstName} {customerInfo.lastName}</p>
                <p className="text-neutral-600">{customerInfo.email}</p>
                <p className="text-neutral-600">{customerInfo.phone}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {cancellationPolicy && (
        <div className="mt-6 border-l-[3px] border-black pl-4">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
            {t('cancellationNote')}
          </p>
          <p className="text-sm text-neutral-600">{cancellationPolicy}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onConfirm}
        disabled={isSubmitting}
        className="mt-8 w-full bg-black px-8 py-4 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? '...' : t('confirm')}
      </button>
    </div>
  )
}
