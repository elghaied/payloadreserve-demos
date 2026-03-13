'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import type { Announcement, EventType, Venue } from '@/payload-types'
import { getEventTypeColor } from '@/lib/event-colors'
import { EventGrid } from './EventGrid'
import { EventList } from './EventList'
import { CalendarView } from './CalendarView'

type ViewMode = 'grid' | 'list' | 'calendar'
type DateFilter = 'all' | 'this-week' | 'this-month'

function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day // Monday is start of week
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfWeek(date: Date): Date {
  const start = startOfWeek(date)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

export function EventFilters({
  announcements,
  eventTypes,
  venues,
  locale,
}: {
  announcements: Announcement[]
  eventTypes: EventType[]
  venues: Venue[]
  locale: string
}) {
  const t = useTranslations('programme')
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set())
  const [selectedVenue, setSelectedVenue] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const toggleType = (typeId: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(typeId)) {
        next.delete(typeId)
      } else {
        next.add(typeId)
      }
      return next
    })
  }

  const filtered = useMemo(() => {
    const now = new Date()
    return announcements.filter((ann) => {
      // Type filter
      if (selectedTypes.size > 0) {
        const etId = typeof ann.eventType === 'string' ? ann.eventType : ann.eventType?.id
        if (!etId || !selectedTypes.has(etId)) return false
      }

      // Venue filter
      if (selectedVenue !== 'all') {
        const vId = typeof ann.venue === 'string' ? ann.venue : ann.venue?.id
        if (vId !== selectedVenue) return false
      }

      // Date filter
      if (dateFilter === 'this-week') {
        const annStart = new Date(ann.startDate)
        const annEnd = ann.endDate ? new Date(ann.endDate) : annStart
        const weekStart = startOfWeek(now)
        const weekEnd = endOfWeek(now)
        // Event overlaps the week
        if (annEnd < weekStart || annStart > weekEnd) return false
      } else if (dateFilter === 'this-month') {
        const annStart = new Date(ann.startDate)
        const annEnd = ann.endDate ? new Date(ann.endDate) : annStart
        const monthStart = startOfMonth(now)
        const monthEnd = endOfMonth(now)
        if (annEnd < monthStart || annStart > monthEnd) return false
      }

      return true
    })
  }, [announcements, selectedTypes, selectedVenue, dateFilter])

  return (
    <div>
      {/* Filter controls */}
      <div className="mb-8 space-y-5">
        {/* Event type pills */}
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
            {t('filterByType')}
          </p>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((et) => {
              const color = getEventTypeColor(et.name)
              const isActive = selectedTypes.has(et.id)
              return (
                <button
                  key={et.id}
                  onClick={() => toggleType(et.id)}
                  className="border-[2px] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[2px] transition-colors"
                  style={{
                    borderColor: color,
                    backgroundColor: isActive ? color : 'transparent',
                    color: isActive ? '#fff' : color,
                  }}
                >
                  {et.name}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-6">
          {/* Venue dropdown */}
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {t('filterByVenue')}
            </p>
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="border-[3px] border-black bg-white px-4 py-2 font-mono text-[10px] uppercase tracking-[2px] focus:outline-none"
            >
              <option value="all">{t('all')}</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date quick filters */}
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {t('filterByDate')}
            </p>
            <div className="flex gap-0">
              {(['all', 'this-week', 'this-month'] as DateFilter[]).map((df) => {
                const label =
                  df === 'all' ? t('all') : df === 'this-week' ? t('thisWeek') : t('thisMonth')
                const isActive = dateFilter === df
                return (
                  <button
                    key={df}
                    onClick={() => setDateFilter(df)}
                    className={`border-[2px] border-black px-3 py-1.5 font-mono text-[10px] uppercase tracking-[2px] transition-colors ${
                      isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
                    } ${df !== 'all' ? '-ml-[2px]' : ''}`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* View toggle */}
          <div className="ml-auto">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              &nbsp;
            </p>
            <div className="flex gap-0">
              {(['grid', 'list', 'calendar'] as ViewMode[]).map((vm) => {
                const label =
                  vm === 'grid' ? t('gridView') : vm === 'list' ? t('listView') : t('calendarView')
                const isActive = viewMode === vm
                return (
                  <button
                    key={vm}
                    onClick={() => setViewMode(vm)}
                    className={`border-[2px] border-black px-3 py-1.5 font-mono text-[10px] uppercase tracking-[2px] transition-colors ${
                      isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
                    } ${vm !== 'grid' ? '-ml-[2px]' : ''}`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center border-[3px] border-black">
          <p className="font-mono text-[11px] uppercase tracking-[2px] text-neutral-500">
            {t('noEvents')}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <EventGrid announcements={filtered} locale={locale} bookLabel={t('book')} />
      ) : viewMode === 'list' ? (
        <EventList announcements={filtered} locale={locale} bookLabel={t('book')} />
      ) : (
        <CalendarView announcements={filtered} locale={locale} bookLabel={t('book')} />
      )}
    </div>
  )
}
