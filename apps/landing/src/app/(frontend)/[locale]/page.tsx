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
    getCachedGlobal('home-page', 2, loc)(),
    getCachedGlobal('site-settings', 0, loc)(),
  ])

  const urls = siteSettings.externalUrls

  return (
    <main id="main-content">
      <Hero heroSection={homepage.heroSection} urls={urls} />
      <UseCaseStrip useCasesSection={homepage.useCasesSection} />
      <FeatureSection featuresSection={homepage.featuresSection} />
      <DemoCards demosSection={homepage.demosSection} />
      <AdminUISection adminUiSection={homepage.adminUiSection} />
      <PrivateDemoSection privateDemoSection={homepage.privateDemoSection} />
      <DeveloperSection developerSection={homepage.developerSection} githubUrl={urls?.github ?? '#'} />
      <HowItWorks howItWorksSection={homepage.howItWorksSection} />
      <CTABanner ctaBannerSection={homepage.ctaBannerSection} urls={urls} />
    </main>
  )
}
