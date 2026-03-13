'use client'

import { useTranslations } from 'next-intl'
import type { EventType } from '@/payload-types'
import { getEventTypeColor } from '@/lib/event-colors'

export function EventTypeStep({
  eventTypes,
  selectedId,
  onSelect,
}: {
  eventTypes: EventType[]
  selectedId: string | null
  onSelect: (eventType: EventType) => void
}) {
  const t = useTranslations('booking')

  return (
    <div>
      <h2 className="mb-6 text-2xl font-black uppercase tracking-[-1px]">
        {t('selectEventType')}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eventTypes.map((et) => {
          const color = getEventTypeColor(et.name)
          const isSelected = selectedId === et.id

          return (
            <button
              key={et.id}
              type="button"
              onClick={() => onSelect(et)}
              className={`group text-left transition-shadow hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] ${
                isSelected
                  ? 'border-[3px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)]'
                  : 'border-[3px] border-black'
              }`}
            >
              <div style={{ borderTop: `4px solid ${color}` }} className="p-5">
                <span
                  className="mb-3 inline-block px-2 py-0.5 font-mono text-[9px] uppercase tracking-[2px] text-white"
                  style={{ backgroundColor: color }}
                >
                  {et.name}
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                    {et.duration} min
                  </span>
                  {et.price != null && (
                    <span className="font-mono text-sm font-bold">
                      {et.price}&euro;
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
