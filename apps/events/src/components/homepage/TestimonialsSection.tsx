import type { Homepage, Testimonial, EventType } from '@/payload-types'
import { getEventTypeColor } from '@/lib/event-colors'

export function TestimonialsSection({
  homepage,
  testimonials,
}: {
  homepage: Homepage
  testimonials: Testimonial[]
}) {
  return (
    <section className="border-t-[3px] border-black px-6 py-16 lg:px-12 lg:py-24">
      {homepage.testimonialsHeading && (
        <h2 className="mb-2 text-3xl font-black uppercase tracking-[-1px] md:text-4xl">
          {homepage.testimonialsHeading}
        </h2>
      )}
      {homepage.testimonialsSubtitle && (
        <p className="mb-10 text-muted-text">{homepage.testimonialsSubtitle}</p>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => {
          const eventType = t.eventType as EventType | null
          const color = eventType ? getEventTypeColor(eventType.name) : '#666666'

          return (
            <div key={t.id} className="border-[3px] border-black p-6">
              <div className="mb-4 text-lg">
                {'★'.repeat(t.rating)}
                {'☆'.repeat(5 - t.rating)}
              </div>
              <blockquote className="mb-4 text-sm leading-relaxed text-muted-text">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{t.author}</span>
                {eventType && (
                  <span
                    className="px-2 py-0.5 font-mono text-[8px] uppercase tracking-[2px] text-white"
                    style={{ backgroundColor: color }}
                  >
                    {eventType.name}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
