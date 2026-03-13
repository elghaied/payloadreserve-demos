'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Announcement, EventType, Venue } from '@/payload-types'
import { getEventTypeColor } from '@/lib/event-colors'

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  // Returns 0=Sun, 1=Mon, ... We want Mon=0
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

const DAY_HEADERS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_HEADERS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export function CalendarView({
  announcements,
  locale,
  bookLabel,
}: {
  announcements: Announcement[]
  locale: string
  bookLabel: string
}) {
  const now = new Date()
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const monthNames = locale === 'fr' ? MONTH_NAMES_FR : MONTH_NAMES_EN
  const dayHeaders = locale === 'fr' ? DAY_HEADERS_FR : DAY_HEADERS_EN

  // Build a map of day -> announcements for the current month
  const dayMap = useMemo(() => {
    const map: Record<number, Announcement[]> = {}
    announcements.forEach((ann) => {
      const start = new Date(ann.startDate)
      const end = ann.endDate ? new Date(ann.endDate) : start

      // Check each day of the event range
      const cursor = new Date(start)
      cursor.setHours(0, 0, 0, 0)
      const endNorm = new Date(end)
      endNorm.setHours(23, 59, 59, 999)

      while (cursor <= endNorm) {
        if (cursor.getFullYear() === currentYear && cursor.getMonth() === currentMonth) {
          const day = cursor.getDate()
          if (!map[day]) map[day] = []
          map[day].push(ann)
        }
        cursor.setDate(cursor.getDate() + 1)
      }
    })
    return map
  }, [announcements, currentYear, currentMonth])

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedDay(null)
  }

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedDay(null)
  }

  const selectedEvents = selectedDay ? (dayMap[selectedDay] ?? []) : []

  return (
    <div>
      {/* Month navigation */}
      <div className="mb-6 flex items-center justify-between border-[3px] border-black px-5 py-3">
        <button
          onClick={handlePrev}
          className="font-mono text-[10px] uppercase tracking-[2px] transition-colors hover:text-neutral-600"
          aria-label="Previous month"
        >
          ← Prev
        </button>
        <h3 className="font-black uppercase tracking-[-1px]">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={handleNext}
          className="font-mono text-[10px] uppercase tracking-[2px] transition-colors hover:text-neutral-600"
          aria-label="Next month"
        >
          Next →
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-[3px] border-black">
        {/* Day headers */}
        {dayHeaders.map((day) => (
          <div
            key={day}
            className="border-b-[2px] border-r-[1px] border-black bg-black py-2 text-center font-mono text-[9px] uppercase tracking-[2px] text-white last:border-r-0"
          >
            {day}
          </div>
        ))}

        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="border-b-[1px] border-r-[1px] border-neutral-200 p-2 last:border-r-0" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const events = dayMap[day]
          const hasEvents = events && events.length > 0
          const isSelected = selectedDay === day
          const isToday =
            day === now.getDate() &&
            currentMonth === now.getMonth() &&
            currentYear === now.getFullYear()

          return (
            <button
              key={day}
              onClick={() => hasEvents && setSelectedDay(isSelected ? null : day)}
              disabled={!hasEvents}
              className={`relative min-h-[60px] border-b-[1px] border-r-[1px] border-neutral-200 p-2 text-left transition-colors last:border-r-0 ${
                isSelected ? 'bg-black text-white' : ''
              } ${hasEvents ? 'cursor-pointer hover:bg-neutral-100' : 'cursor-default'} ${
                isSelected && hasEvents ? 'hover:bg-neutral-800' : ''
              }`}
            >
              <span
                className={`font-mono text-[11px] ${
                  isToday && !isSelected ? 'font-bold text-black' : ''
                } ${isToday && isSelected ? 'font-bold' : ''}`}
              >
                {day}
              </span>
              {hasEvents && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {events.slice(0, 3).map((evt) => {
                    const et = evt.eventType as EventType | null
                    const color = et ? getEventTypeColor(et.name) : '#666666'
                    return (
                      <span
                        key={evt.id}
                        className="block h-2 w-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    )
                  })}
                  {events.length > 3 && (
                    <span className={`font-mono text-[8px] ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`}>
                      +{events.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Expanded day events */}
      {selectedDay && selectedEvents.length > 0 && (
        <div className="mt-6 border-[3px] border-black">
          <div className="border-b-[2px] border-black bg-black px-5 py-3">
            <h4 className="font-mono text-[10px] uppercase tracking-[2px] text-white">
              {new Date(currentYear, currentMonth, selectedDay).toLocaleDateString(locale, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </h4>
          </div>
          {selectedEvents.map((ann, i) => {
            const eventType = ann.eventType as EventType | null
            const venue = ann.venue as Venue | null
            const color = eventType ? getEventTypeColor(eventType.name) : '#666666'

            return (
              <div
                key={ann.id}
                className={`flex flex-col items-start gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-5 ${
                  i > 0 ? 'border-t-[1px] border-neutral-200' : ''
                }`}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="min-w-0 flex-1 font-bold">{ann.title}</span>
                {venue && (
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                    {venue.name}
                  </span>
                )}
                {eventType?.price != null && (
                  <span className="shrink-0 font-mono text-sm font-bold">{eventType.price}€</span>
                )}
                {ann.slug && (
                  <Link
                    href={`/${locale}/events/${ann.slug}`}
                    className="shrink-0 bg-black px-5 py-2.5 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800"
                  >
                    {bookLabel}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
