import { TypedLocale } from 'payload'

import { Hero } from '@/components/Hero'
import { UseCaseStrip } from '@/components/UseCaseStrip'
import { FeatureSection } from '@/components/FeatureSection'
import { DemoCards } from '@/components/DemoCards'
import { AdminUISection } from '@/components/AdminUISection'
import { PrivateDemoSection } from '@/components/PrivateDemoSection'
import { DeveloperSection } from '@/components/DeveloperSection'
import { HowItWorks } from '@/components/HowItWorks'
import { CTABanner } from '@/components/CTABanner'
import { getCachedGlobal } from '@/utilities/getGlobals'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const loc = locale as TypedLocale

  const [homepage, siteSettings] = await Promise.all([
    getCachedGlobal('home-page', 0, loc)(),
    getCachedGlobal('site-settings', 0, loc)(),
  ])

  const urls = siteSettings.externalUrls

  return (
    <main>
      <Hero heroSection={homepage.heroSection} urls={urls} />
      <UseCaseStrip homepage={homepage} />
      <FeatureSection homepage={homepage} />
      <DemoCards homepage={homepage} />
      <AdminUISection homepage={homepage} />
      <PrivateDemoSection homepage={homepage} />
      <DeveloperSection homepage={homepage} githubUrl={urls?.github ?? '#'} />
      <HowItWorks homepage={homepage} />
      <CTABanner homepage={homepage} urls={urls} />
    </main>
  )
}
