import { Hero } from '@/components/Hero'
import { FeatureSection } from '@/components/FeatureSection'
import { DemoCards } from '@/components/DemoCards'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeatureSection />
      <DemoCards />
      <footer className="border-t border-zinc-800/60 py-10 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-sm text-zinc-600">
            payload<span className="text-zinc-500">-reserve</span>
          </span>
          <p className="text-xs text-zinc-600">
            Open source. MIT License.{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              GitHub ↗
            </a>
          </p>
        </div>
      </footer>
    </main>
  )
}
