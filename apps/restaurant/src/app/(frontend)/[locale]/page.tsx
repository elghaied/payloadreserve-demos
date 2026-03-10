import { getPayload } from 'payload'
import config from '@payload-config'
import { setRequestLocale } from 'next-intl/server'

import { HeroSection } from '@/components/homepage/HeroSection'
import { StorySection } from '@/components/homepage/StorySection'
import { MenuPreview } from '@/components/homepage/MenuPreview'
import { TeamPreview } from '@/components/homepage/TeamPreview'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const payload = await getPayload({ config })

  const [homepage, menuItems, team] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', locale: loc }),
    payload.find({
      collection: 'menu',
      locale: loc,
      limit: 20,
      sort: 'order',
      where: { active: { equals: true } },
    }),
    payload.find({ collection: 'team', locale: loc, limit: 4, sort: 'order' }),
  ])

  return (
    <>
      <HeroSection data={homepage} locale={locale} />
      <StorySection data={homepage} locale={locale} />
      <MenuPreview data={homepage} menuItems={menuItems.docs} locale={locale} />
      <TeamPreview data={homepage} team={team.docs} locale={locale} />
    </>
  )
}
