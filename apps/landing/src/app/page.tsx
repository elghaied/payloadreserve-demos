import { Hero } from '@/components/Hero'
import { UseCaseStrip } from '@/components/UseCaseStrip'
import { FeatureSection } from '@/components/FeatureSection'
import { DemoCards } from '@/components/DemoCards'
import { HowItWorks } from '@/components/HowItWorks'
import { CTABanner } from '@/components/CTABanner'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <UseCaseStrip />
      <FeatureSection />
      <DemoCards />
      <HowItWorks />
      <CTABanner />
      <Footer />
    </main>
  )
}
