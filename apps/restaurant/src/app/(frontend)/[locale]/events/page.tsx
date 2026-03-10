import { getPayload } from 'payload'
import config from '@payload-config'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { ScrollReveal, StaggerChildren } from '@/components/ScrollReveal'
import { Badge } from '@/components/ui/badge'
import type { Announcement, Media } from '@/payload-types'

type Props = { params: Promise<{ locale: string }> }

function getMediaUrl(img: Announcement['image']): string | null {
  if (!img || typeof img !== 'object') return null
  return (img as Media).url ?? null
}

function getMediaAlt(img: Announcement['image'], fallback: string): string {
  if (!img || typeof img !== 'object') return fallback
  return (img as Media).alt ?? fallback
}

function formatDateRange(
  startDate: string,
  endDate: string | null | undefined,
  locale: string,
): string {
  const localeStr = locale === 'fr' ? 'fr-FR' : 'en-GB'
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  try {
    const start = new Date(startDate).toLocaleDateString(localeStr, opts)
    if (!endDate) return start
    const end = new Date(endDate).toLocaleDateString(localeStr, opts)
    return `${start} – ${end}`
  } catch {
    return startDate
  }
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const payload = await getPayload({ config })
  const t = await getTranslations({ locale, namespace: 'events' })

  const now = new Date().toISOString()

  const { docs: allEvents } = await payload.find({
    collection: 'announcements',
    locale: loc,
    limit: 50,
    sort: 'startDate',
    where: { active: { equals: true } },
  })

  // Filter out events whose endDate is in the past
  const events = allEvents.filter((event: Announcement) => {
    if (event.endDate) {
      return event.endDate >= now
    }
    // No endDate — keep if startDate is not past by more than a day
    return event.startDate >= now.slice(0, 10)
  })

  return (
    <main className="min-h-screen py-24 md:py-32">
      <Container>
        {/* Page header */}
        <ScrollReveal>
          <div className="text-center mb-20 space-y-4">
            <p className="text-primary text-sm uppercase tracking-widest">{t('title')}</p>
            <hr className="hr-rose w-24 mx-auto" />
            <h1 className="font-heading text-4xl md:text-6xl text-foreground">{t('title')}</h1>
            <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
          </div>
        </ScrollReveal>

        {/* Events */}
        {events.length === 0 ? (
          <ScrollReveal>
            <p className="text-muted text-center py-16">{t('noEvents')}</p>
          </ScrollReveal>
        ) : (
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {events.map((event: Announcement) => {
              const imgUrl = getMediaUrl(event.image)
              const imgAlt = getMediaAlt(event.image, event.title)
              const dateRange = formatDateRange(event.startDate, event.endDate, locale)
              const typeLabel = t(`types.${event.type}` as Parameters<typeof t>[0])

              return (
                <ScrollReveal key={event.id}>
                  <article className="glass rounded-sm overflow-hidden h-full flex flex-col group transition-all duration-300 hover:burgundy-glow">
                    {/* Image */}
                    {imgUrl && (
                      <div className="relative aspect-[16/7] overflow-hidden">
                        <img
                          src={imgUrl}
                          alt={imgAlt}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                      </div>
                    )}

                    <div className="p-6 md:p-8 flex flex-col gap-4 flex-1">
                      {/* Type badge */}
                      <div>
                        <Badge variant="default" className="text-xs">
                          {String(typeLabel)}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h2 className="font-heading text-2xl text-foreground leading-snug group-hover:text-primary transition-colors duration-300">
                        {event.title}
                      </h2>

                      {/* Date */}
                      <p className="text-gold text-xs uppercase tracking-widest">{dateRange}</p>

                      {/* Description */}
                      {event.description && (
                        <p className="text-muted text-sm leading-relaxed flex-1">
                          {event.description}
                        </p>
                      )}

                      {/* CTA */}
                      {event.ctaLink && event.ctaText && (
                        <div className="mt-auto pt-2">
                          <Link
                            href={event.ctaLink}
                            className="inline-block border border-primary/40 text-primary px-6 py-2 rounded-sm text-xs uppercase tracking-widest hover:bg-primary hover:text-background transition-all duration-300"
                          >
                            {event.ctaText}
                          </Link>
                        </div>
                      )}
                    </div>
                  </article>
                </ScrollReveal>
              )
            })}
          </StaggerChildren>
        )}
      </Container>
    </main>
  )
}
