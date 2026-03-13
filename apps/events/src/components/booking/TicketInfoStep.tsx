'use client'

import { useTranslations } from 'next-intl'
import type { EventType } from '@/payload-types'

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export function TicketInfoStep({
  eventType,
  ticketQuantity,
  customerInfo,
  onChangeQuantity,
  onChangeCustomerInfo,
}: {
  eventType: EventType
  ticketQuantity: number
  customerInfo: CustomerInfo
  onChangeQuantity: (qty: number) => void
  onChangeCustomerInfo: (info: CustomerInfo) => void
}) {
  const t = useTranslations('booking')
  const price = eventType.price ?? 0
  const total = price * ticketQuantity

  const updateField = (field: keyof CustomerInfo, value: string) => {
    onChangeCustomerInfo({ ...customerInfo, [field]: value })
  }

  return (
    <div className="space-y-10">
      {/* Ticket Quantity */}
      <div>
        <h2 className="mb-6 text-2xl font-black uppercase tracking-[-1px]">
          {t('tickets')}
        </h2>
        <div className="border-[3px] border-black p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                {t('pricePerTicket')}
              </p>
              <p className="mt-1 text-xl font-bold">{price}&euro;</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                {t('quantity')}
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => onChangeQuantity(Math.max(1, ticketQuantity - 1))}
                  className="flex h-10 w-10 items-center justify-center border-[3px] border-black font-mono text-lg font-bold transition-colors hover:bg-neutral-100"
                >
                  &minus;
                </button>
                <span className="flex h-10 w-12 items-center justify-center border-y-[3px] border-black font-mono text-lg font-bold">
                  {ticketQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => onChangeQuantity(Math.min(10, ticketQuantity + 1))}
                  className="flex h-10 w-10 items-center justify-center border-[3px] border-black font-mono text-lg font-bold transition-colors hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 border-t-[3px] border-black pt-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                {t('totalPrice')}
              </span>
              <span className="text-2xl font-black">{total}&euro;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div>
        <h2 className="mb-6 text-2xl font-black uppercase tracking-[-1px]">
          {t('customerInfo')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {t('firstName')} *
            </label>
            <input
              type="text"
              required
              value={customerInfo.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              className="w-full border-[3px] border-black px-4 py-3 font-mono text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {t('lastName')} *
            </label>
            <input
              type="text"
              required
              value={customerInfo.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              className="w-full border-[3px] border-black px-4 py-3 font-mono text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {t('email')} *
            </label>
            <input
              type="email"
              required
              value={customerInfo.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full border-[3px] border-black px-4 py-3 font-mono text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {t('phone')} *
            </label>
            <input
              type="tel"
              required
              value={customerInfo.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full border-[3px] border-black px-4 py-3 font-mono text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
