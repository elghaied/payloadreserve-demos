import Link from 'next/link'
import type { Homepage, EventType } from '@/payload-types'
import { getEventTypeColor } from '@/lib/event-colors'

export function ProgrammingSection({
  homepage,
  eventTypes,
  locale,
}: {
  homepage: Homepage
  eventTypes: EventType[]
  locale: string
}) {
  return (
    <section className="border-t-[3px] border-black px-6 py-16 lg:px-12 lg:py-24">
      {homepage.programmingHeading && (
        <h2 className="mb-2 text-3xl font-black uppercase tracking-[-1px] md:text-4xl">
          {homepage.programmingHeading}
        </h2>
      )}
      {homepage.programmingSubtitle && (
        <p className="mb-10 text-muted-text">{homepage.programmingSubtitle}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eventTypes.map((et) => {
          const color = getEventTypeColor(et.name)
          return (
            <Link
              key={et.id}
              href={`/${locale}/reserver?eventType=${et.id}`}
              className="group border-[3px] border-black p-6 transition-colors hover:bg-black hover:text-white"
              style={{ borderLeftWidth: '6px', borderLeftColor: color }}
            >
              <h3 className="mb-2 text-lg font-bold">{et.name}</h3>
              <div className="flex gap-4 font-mono text-[10px] uppercase tracking-[2px] text-muted-text group-hover:text-neutral-300">
                <span>{et.duration} min</span>
                {et.price != null && <span>&euro;{et.price}</span>}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
