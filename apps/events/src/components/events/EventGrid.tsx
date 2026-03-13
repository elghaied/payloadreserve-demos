import type { Announcement } from '@/payload-types'
import { EventCard } from './EventCard'

export function EventGrid({
  announcements,
  locale,
  bookLabel,
}: {
  announcements: Announcement[]
  locale: string
  bookLabel: string
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {announcements.map((ann) => (
        <EventCard key={ann.id} announcement={ann} locale={locale} bookLabel={bookLabel} />
      ))}
    </div>
  )
}
