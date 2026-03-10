import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/Container'
import { ScrollReveal, StaggerChildren } from '@/components/ScrollReveal'
import { Badge } from '@/components/ui/badge'
import type { Homepage, Announcement, Media } from '@/payload-types'

type Props = {
  data: Homepage
  announcements: Announcement[]
  locale: string
}

function getImageUrl(img: Announcement['image']): string | null {
  if (typeof img === 'object' && img !== null) {
    return (img as Media).url ?? null
  }
  return null
}

function getImageAlt(img: Announcement['image']): string {
  if (typeof img === 'object' && img !== null) {
    return (img as Media).alt ?? ''
  }
  return ''
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

function truncateDescription(text: string | null | undefined, max = 120): string {
  if (!text) return ''
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + '…'
}

export async function EventsSection({ data, announcements, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'events' })

  if (announcements.length === 0) return null

  return (
    <section className="py-24 md:py-32">
      <Container>
        {/* Section header */}
        <ScrollReveal>
          <div className="text-center mb-16 space-y-4">
            <p className="text-primary text-sm uppercase tracking-widest">{t('title')}</p>
            <hr className="hr-rose w-24 mx-auto" />
            <h2 className="text-3xl md:text-5xl font-heading text-foreground">
              {data.announcementsHeading || t('title')}
            </h2>
            {(data.announcementsSubtitle || t('subtitle')) && (
              <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
                {data.announcementsSubtitle || t('subtitle')}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Event cards */}
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {announcements.map((announcement) => {
            const imgUrl = getImageUrl(announcement.image)
            const imgAlt = getImageAlt(announcement.image)
            const dateRange = formatDateRange(announcement.startDate, announcement.endDate, locale)
            const description = truncateDescription(announcement.description)
            const typeLabel = t(`types.${announcement.type}` as Parameters<typeof t>[0])

            return (
              <ScrollReveal key={announcement.id}>
                <article className="glass rounded-sm overflow-hidden h-full flex flex-col group transition-all duration-300 hover:burgundy-glow-sm">
                  {/* Image */}
                  {imgUrl && (
                    <div className="relative aspect-[16/7] overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={imgAlt || announcement.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col gap-4 flex-1">
                    {/* Type badge */}
                    <div>
                      <Badge variant="default" className="text-xs">
                        {String(typeLabel)}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-xl text-foreground leading-snug group-hover:text-primary transition-colors duration-300">
                      {announcement.title}
                    </h3>

                    {/* Date */}
                    <p className="text-gold text-xs uppercase tracking-widest">{dateRange}</p>

                    {/* Description excerpt */}
                    {description && (
                      <p className="text-muted text-sm leading-relaxed flex-1">{description}</p>
                    )}

                    {/* CTA */}
                    {announcement.ctaLink && announcement.ctaText && (
                      <div className="mt-auto pt-2">
                        <Link
                          href={announcement.ctaLink}
                          className="inline-block border border-primary/30 text-primary px-6 py-2 rounded-sm text-xs uppercase tracking-widest hover:bg-primary hover:text-background transition-all duration-300"
                        >
                          {announcement.ctaText}
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              </ScrollReveal>
            )
          })}
        </StaggerChildren>
      </Container>
    </section>
  )
}
