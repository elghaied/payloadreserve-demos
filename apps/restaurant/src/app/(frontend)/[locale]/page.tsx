import { getPayload } from 'payload'
import config from '@payload-config'
import { setRequestLocale } from 'next-intl/server'

import { HeroSection } from '@/components/homepage/HeroSection'
import { StorySection } from '@/components/homepage/StorySection'
import { MenuPreview } from '@/components/homepage/MenuPreview'
import { TeamPreview } from '@/components/homepage/TeamPreview'
import { SpacesPreview } from '@/components/homepage/SpacesPreview'
import { WineSection } from '@/components/homepage/WineSection'
import { ExperiencesSection } from '@/components/homepage/ExperiencesSection'
import { TestimonialsSection } from '@/components/homepage/TestimonialsSection'
import { EventsSection } from '@/components/homepage/EventsSection'
import { CTABanner } from '@/components/homepage/CTABanner'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const payload = await getPayload({ config })

  const [homepage, menuItems, team, spaces, wines, experiences, testimonials, announcements] =
    await Promise.all([
      payload.findGlobal({ slug: 'homepage', locale: loc }),
      payload.find({
        collection: 'menu',
        locale: loc,
        limit: 20,
        sort: 'order',
        where: { active: { equals: true } },
      }),
      payload.find({ collection: 'team', locale: loc, limit: 4, sort: 'order' }),
      payload.find({ collection: 'spaces', locale: loc, limit: 3, sort: 'order' }),
      payload.find({
        collection: 'wine-list',
        locale: loc,
        where: { featured: { equals: true } },
        limit: 6,
      }),
      payload.find({
        collection: 'dining-experiences',
        locale: loc,
        limit: 10,
        where: { active: { equals: true } },
      }),
      payload.find({
        collection: 'testimonials',
        locale: loc,
        where: { featured: { equals: true } },
        limit: 6,
      }),
      payload.find({
        collection: 'announcements',
        locale: loc,
        where: { active: { equals: true } },
        limit: 4,
      }),
    ])

  return (
    <>
      <HeroSection data={homepage} locale={locale} />
      <StorySection data={homepage} locale={locale} />
      <MenuPreview data={homepage} menuItems={menuItems.docs} locale={locale} />
      <TeamPreview data={homepage} team={team.docs} locale={locale} />
      <SpacesPreview data={homepage} spaces={spaces.docs} locale={locale} />
      <WineSection data={homepage} wines={wines.docs} locale={locale} />
      <ExperiencesSection data={homepage} experiences={experiences.docs} locale={locale} />
      <TestimonialsSection data={homepage} testimonials={testimonials.docs} locale={locale} />
      <EventsSection data={homepage} announcements={announcements.docs} locale={locale} />
      <CTABanner data={homepage} locale={locale} />
    </>
  )
}
