import type { Metadata } from 'next'
import { getPayload, TypedLocale } from 'payload'
import { unstable_cache } from 'next/cache'
import configPromise from '@payload-config'

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
import { buildAlternates } from '@/utilities/seo'

type Props = {
  params: Promise<{ locale: string }>
}

const getCachedDemos = (locale: TypedLocale) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const { docs } = await payload.find({
        collection: 'demos',
        sort: 'displayOrder',
        depth: 1,
        locale,
        limit: 0,
      })
      return docs
    },
    ['demos_list', locale],
    { tags: [`demos_list_${locale}`] },
  )

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    alternates: buildAlternates(locale, '/'),
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const loc = locale as TypedLocale

  const [homepage, siteSettings, demos] = await Promise.all([
    getCachedGlobal('home-page', 1, loc)(),
    getCachedGlobal('site-settings', 0, loc)(),
    getCachedDemos(loc)(),
  ])

  const urls = siteSettings.externalUrls

  return (
    <main id="main-content">
      <Hero heroSection={homepage.heroSection} urls={urls} />
      <UseCaseStrip useCasesSection={homepage.useCasesSection} />
      <FeatureSection featuresSection={homepage.featuresSection} />
      <DemoCards demosSection={homepage.demosSection} demos={demos} />
      <AdminUISection adminUiSection={homepage.adminUiSection} />
      <PrivateDemoSection privateDemoSection={homepage.privateDemoSection} />
      <DeveloperSection developerSection={homepage.developerSection} githubUrl={urls?.github ?? '#'} />
      <HowItWorks howItWorksSection={homepage.howItWorksSection} />
      <CTABanner ctaBannerSection={homepage.ctaBannerSection} urls={urls} />
    </main>
  )
}
