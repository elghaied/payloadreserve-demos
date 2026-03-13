import { setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { HeroSection } from '@/components/homepage/HeroSection'
import { AboutSection } from '@/components/homepage/AboutSection'
import { AnnouncementsSection } from '@/components/homepage/AnnouncementsSection'
import { ProgrammingSection } from '@/components/homepage/ProgrammingSection'
import { VenuesSection } from '@/components/homepage/VenuesSection'
import { ArtistsSection } from '@/components/homepage/ArtistsSection'
import { TestimonialsSection } from '@/components/homepage/TestimonialsSection'
import { CtaBanner } from '@/components/homepage/CtaBanner'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const payload = await getPayload({ config })

  const [homepage, announcements, eventTypes, venues, artists, testimonials] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', locale: loc }),
    payload.find({
      collection: 'announcements',
      locale: loc,
      depth: 1,
      where: { active: { equals: true }, featured: { equals: true } },
      limit: 10,
    }),
    payload.find({
      collection: 'event-types',
      locale: loc,
      where: { active: { equals: true } },
    }),
    payload.find({
      collection: 'venues',
      locale: loc,
      depth: 1,
      where: { active: { equals: true } },
    }),
    payload.find({
      collection: 'artists',
      locale: loc,
      where: { featured: { equals: true } },
    }),
    payload.find({
      collection: 'testimonials',
      locale: loc,
      depth: 1,
      where: { featured: { equals: true } },
    }),
  ])

  return (
    <>
      <HeroSection homepage={homepage} locale={locale} />
      <AboutSection homepage={homepage} />
      <AnnouncementsSection homepage={homepage} announcements={announcements.docs} locale={locale} />
      <ProgrammingSection homepage={homepage} eventTypes={eventTypes.docs} locale={locale} />
      <VenuesSection homepage={homepage} venues={venues.docs} locale={locale} />
      <ArtistsSection homepage={homepage} artists={artists.docs} locale={locale} />
      <TestimonialsSection homepage={homepage} testimonials={testimonials.docs} />
      <CtaBanner homepage={homepage} locale={locale} />
    </>
  )
}
