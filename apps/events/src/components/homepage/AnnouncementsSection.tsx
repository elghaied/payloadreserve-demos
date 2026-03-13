import Link from 'next/link'
import Image from 'next/image'
import type { Homepage, Announcement, EventType, Media } from '@/payload-types'
import { getEventTypeColor } from '@/lib/event-colors'

export function AnnouncementsSection({
  homepage,
  announcements,
  locale,
}: {
  homepage: Homepage
  announcements: Announcement[]
  locale: string
}) {
  return (
    <section className="border-t-[3px] border-black px-6 py-16 lg:px-12 lg:py-24">
      {homepage.announcementsHeading && (
        <h2 className="mb-2 text-3xl font-black uppercase tracking-[-1px] md:text-4xl">
          {homepage.announcementsHeading}
        </h2>
      )}
      {homepage.announcementsSubtitle && (
        <p className="mb-10 text-muted-text">{homepage.announcementsSubtitle}</p>
      )}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {announcements.map((ann) => {
          const eventType = ann.eventType as EventType | null
          const image = ann.image as Media | null
          const color = eventType ? getEventTypeColor(eventType.name) : '#666666'

          return (
            <div key={ann.id} className="min-w-[300px] flex-shrink-0 border-[3px] border-black">
              <div style={{ borderTop: `4px solid ${color}` }}>
                {image?.url && (
                  <div className="relative h-48">
                    <Image
                      src={image.url}
                      alt={image.alt || ann.title}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  </div>
                )}
                <div className="p-5">
                  <p className="mb-2 font-mono text-[9px] uppercase tracking-[2px] text-muted-text">
                    {new Date(ann.startDate).toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric',
                    })}
                    {ann.endDate &&
                      ` — ${new Date(ann.endDate).toLocaleDateString(locale, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}`}
                  </p>
                  <h3 className="mb-3 text-lg font-bold">{ann.title}</h3>
                  {ann.ctaText && ann.slug && (
                    <Link
                      href={`/${locale}/programme/${ann.slug}`}
                      className="inline-block border-[2px] border-black px-4 py-2 font-mono text-[9px] uppercase tracking-[2px] transition-colors hover:bg-black hover:text-white"
                    >
                      {ann.ctaText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
