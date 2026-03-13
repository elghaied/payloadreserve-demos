import type { Schedule } from '@/payload-types'

const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

export function VenueSchedule({
  schedule,
  dayLabels,
  closedLabel,
}: {
  schedule: Schedule
  dayLabels: Record<string, string>
  closedLabel: string
}) {
  const slots = schedule.recurringSlots || []

  const slotsByDay = new Map<string, { startTime: string; endTime: string }>()
  for (const slot of slots) {
    slotsByDay.set(slot.day, { startTime: slot.startTime, endTime: slot.endTime })
  }

  return (
    <div className="border-[3px] border-black">
      {DAY_ORDER.map((day) => {
        const slot = slotsByDay.get(day)
        return (
          <div
            key={day}
            className="flex items-center justify-between border-b border-neutral-200 px-5 py-3 last:border-b-0"
          >
            <span className="font-mono text-[10px] uppercase tracking-[2px]">
              {dayLabels[day] || day}
            </span>
            {slot ? (
              <span className="font-mono text-sm font-bold">
                {slot.startTime} — {slot.endTime}
              </span>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
                {closedLabel}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
