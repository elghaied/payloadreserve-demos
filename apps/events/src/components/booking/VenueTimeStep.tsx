'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import type { EventType, Venue, Media } from '@/payload-types'
import Image from 'next/image'
import { Calendar } from '@/components/ui/calendar'

function generateTimeSlots(durationMinutes: number): string[] {
  const slots: string[] = []
  const startHour = 10
  const endHour = 22
  const stepMinutes = Math.max(durationMinutes, 120)

  for (let minutes = startHour * 60; minutes + durationMinutes <= endHour * 60; minutes += stepMinutes) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }

  return slots
}

export function VenueTimeStep({
  venues,
  selectedEventType,
  selectedVenueId,
  selectedDate,
  selectedTime,
  locale: _locale,
  onSelectVenue,
  onSelectDate,
  onSelectTime,
}: {
  venues: Venue[]
  selectedEventType: EventType
  selectedVenueId: string | null
  selectedDate: Date | null
  selectedTime: string | null
  locale: string
  onSelectVenue: (venue: Venue) => void
  onSelectDate: (date: Date) => void
  onSelectTime: (time: string) => void
}) {
  const t = useTranslations('booking')
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())

  // Filter venues that support the selected event type
  const filteredVenues = useMemo(() => {
    return venues.filter((v) =>
      v.services.some((s) => {
        const serviceId = typeof s === 'string' ? s : s.id
        return serviceId === selectedEventType.id
      }),
    )
  }, [venues, selectedEventType.id])

  const timeSlots = useMemo(
    () => generateTimeSlots(selectedEventType.duration),
    [selectedEventType.duration],
  )

  const tomorrow = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  return (
    <div className="space-y-8">
      {/* Venue Selection */}
      <div>
        <h2 className="mb-6 text-2xl font-black uppercase tracking-[-1px]">
          {t('selectVenue')}
        </h2>
        {filteredVenues.length === 0 ? (
          <p className="py-10 text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
            No venues available
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredVenues.map((venue) => {
              const image = venue.image as Media | null
              const isSelected = selectedVenueId === venue.id

              return (
                <button
                  key={venue.id}
                  type="button"
                  onClick={() => onSelectVenue(venue)}
                  className={`group text-left transition-shadow hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] ${
                    isSelected
                      ? 'border-[3px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)]'
                      : 'border-[3px] border-black'
                  }`}
                >
                  <div className="relative h-40 overflow-hidden">
                    {image?.url ? (
                      <Image
                        src={image.url}
                        alt={image.alt || venue.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-100">
                        <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-black uppercase tracking-[-1px]">
                      {venue.name}
                    </h3>
                    {venue.description && (
                      <p className="mt-1 line-clamp-1 text-sm text-neutral-600">
                        {venue.description}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Date Selection */}
      {selectedVenueId && (
        <div>
          <h2 className="mb-6 text-2xl font-black uppercase tracking-[-1px]">
            {t('selectDate')}
          </h2>
          <div className="inline-block border-[3px] border-black p-4">
            <Calendar
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={(date) => date && onSelectDate(date)}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              disabled={{ before: tomorrow }}
            />
          </div>
        </div>
      )}

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <h2 className="mb-6 text-2xl font-black uppercase tracking-[-1px]">
            {t('selectTime')}
          </h2>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
            {t('availableSlots')}
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectTime(slot)}
                  className={`py-3 font-mono text-sm font-bold transition-colors ${
                    isSelected
                      ? 'border-[3px] border-black bg-black text-white'
                      : 'border-[3px] border-black hover:bg-neutral-100'
                  }`}
                >
                  {slot}
                </button>
              )
            })}
          </div>
          {timeSlots.length === 0 && (
            <p className="py-6 text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
              {t('noSlots')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
