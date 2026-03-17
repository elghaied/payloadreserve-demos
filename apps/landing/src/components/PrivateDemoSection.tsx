import { Link } from '@/i18n/navigation'
import type { HomePage } from '@/payload-types'
import AdminPanelMockup from './AdminPanelMockup'

type Props = {
  privateDemoSection: HomePage['privateDemoSection']
}

export function PrivateDemoSection({ privateDemoSection }: Props) {
  if (!privateDemoSection) {
    return null
  }

  const perks = privateDemoSection.privateDemoPerks ?? []

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-[#F7F7F5] dark:bg-stone-950">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-[0.2em] mb-4">
                {privateDemoSection.privateDemoLabel}
              </p>
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] text-[#1C1917] dark:text-stone-50 leading-[1.1] mb-5">
                {privateDemoSection.privateDemoHeadline}
              </h2>
              <p className="text-[#78716C] dark:text-stone-400 text-lg leading-relaxed">
                {privateDemoSection.privateDemoSubtitle}
              </p>
            </div>

            {/* Perks list */}
            <ul className="space-y-3">
              {perks.map((perk) => (
                <li
                  key={perk.id ?? perk.text}
                  className="flex items-center gap-3 text-sm text-[#1C1917] dark:text-stone-200"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      className="text-violet-700 dark:text-violet-400"
                    >
                      <path
                        d="M2 5.5l2.2 2.2L9 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {perk.text}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="space-y-3">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 bg-violet-700 hover:bg-violet-600 active:scale-95 text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-150 shadow-lg shadow-violet-400/20"
              >
                {privateDemoSection.privateDemoCta}
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <p className="text-xs text-[#78716C] dark:text-stone-500">
                {privateDemoSection.privateDemoAudience}
              </p>
            </div>
          </div>

          {/* Right: animated admin mockup */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-violet-100/40 dark:bg-violet-900/10 blur-3xl" />
            <AdminPanelMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
