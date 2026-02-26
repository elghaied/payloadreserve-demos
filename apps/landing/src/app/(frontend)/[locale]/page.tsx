import { Hero } from '@/components/Hero'
import { UseCaseStrip } from '@/components/UseCaseStrip'
import { FeatureSection } from '@/components/FeatureSection'
import { DemoCards } from '@/components/DemoCards'
import { AdminUISection } from '@/components/AdminUISection'
import { PrivateDemoSection } from '@/components/PrivateDemoSection'
import { DeveloperSection } from '@/components/DeveloperSection'
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
      <AdminUISection />
      <PrivateDemoSection />
      <DeveloperSection />
      <HowItWorks />
      <CTABanner />
      <Footer />
    </main>
  )
}
