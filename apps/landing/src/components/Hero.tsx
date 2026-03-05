import type { HomePage, SiteSetting } from '@/payload-types'

type EventDate = {
  date: string
  status: string
  tone: 'available' | 'booked' | 'selected'
}

type HeroProps = {
  heroSection: HomePage['heroSection']

  urls: SiteSetting['externalUrls']
}

export function Hero({ heroSection, urls }: HeroProps) {
  if (!heroSection) {
    return null
  }
  return (
    <section className="relative overflow-hidden bg-[#FAFAF8] dark:bg-stone-900 pt-16">
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-16 items-center py-20 lg:py-28 min-h-[calc(100vh-4rem)]">
          {/* Left: copy */}
          <div className="space-y-8">
            {/* Version badge */}
            <div className="hero-up hero-up-1">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-violet-700 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 rounded-full px-3.5 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {heroSection.heroBadge}
              </span>
            </div>

            {/* Headline */}
            <div className="hero-up hero-up-2">
              <h1 className="font-display text-[clamp(3rem,5.5vw,5rem)] leading-[1.04] tracking-[-0.025em] text-[#1C1917] dark:text-stone-50">
                {heroSection.heroHeadline1}
                <br />
                <span className="text-violet-700 dark:text-violet-400">
                  {heroSection.heroHeadline2}
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <div className="hero-up hero-up-3">
              <p className="text-[1.1rem] text-[#78716C] dark:text-stone-400 leading-relaxed max-w-[390px]">
                {heroSection.heroSubheading}
              </p>
            </div>

            {/* CTAs */}
            <div className="hero-up hero-up-4 flex flex-wrap gap-3 items-center">
              <a
                href="#demos"
                className="inline-flex items-center gap-2 bg-violet-700 hover:bg-violet-600 active:scale-95 text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-150 shadow-lg shadow-violet-400/20"
              >
                {heroSection.heroCtaDemos}
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
              </a>
              <a
                href={urls?.docs ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white dark:bg-stone-800 text-[#1C1917] dark:text-stone-100 border border-gray-200 dark:border-stone-700 hover:border-violet-400 dark:hover:border-violet-600 hover:text-violet-700 dark:hover:text-violet-400 font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-150 shadow-sm"
              >
                {heroSection.heroCtaDocs}
              </a>
            </div>

            {/* Industry tags */}
            <div className="hero-up hero-up-5 flex flex-wrap gap-2 pt-1">
              {(heroSection.heroIndustryTags ?? []).map((tag) => (
                <span
                  key={tag.label}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-[#78716C] dark:text-stone-400"
                >
                  {tag.emoji} {tag.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: industry booking mockups */}
          <div className="hero-up hero-up-3 hidden lg:block">
            <MockupGrid />
          </div>
        </div>
      </div>
    </section>
  )
}

// Decorative UI mockups — static demo content, not editorial
function MockupGrid() {
  const salonSlots = ['10:00 AM', '11:30 AM ✓', '2:00 PM']
  const restaurantSlots = ['7:00', '7:30', '8:00 ✓', '8:30', '9:00', '9:30']
  const eventDates: EventDate[] = [
    { date: 'Feb 3', status: 'Available', tone: 'available' },
    { date: 'Feb 10', status: 'Booked', tone: 'booked' },
    { date: 'Feb 17', status: 'Selected', tone: 'selected' },
  ]

  return (
    <div className="relative" aria-hidden="true">
      {/* Glow behind the grid */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-3/4 h-3/4 rounded-full bg-violet-100/60 dark:bg-violet-900/20 blur-3xl" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Salon */}
        <div
          className="bg-white dark:bg-stone-800 rounded-2xl border border-gray-100 dark:border-stone-700 shadow-xl shadow-violet-100/60 dark:shadow-black/30 p-5 float-anim"
          style={{ animationDuration: '4.5s' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">✂️</span>
            <div>
              <p className="text-xs font-bold text-[#1C1917] dark:text-stone-100">Lumière Salon</p>
              <p className="text-[10px] text-[#78716C] dark:text-stone-400">Today, Jan 24</p>
            </div>
          </div>
          <p className="text-[10px] font-semibold text-[#78716C] dark:text-stone-400 uppercase tracking-wide mb-2">
            Available slots
          </p>
          <div className="space-y-1.5">
            {salonSlots.map((slot, index) => (
              <div
                key={slot}
                className={
                  index === 1
                    ? 'px-3 py-2 rounded-lg text-[11px] font-semibold text-center bg-violet-600 text-white shadow-sm shadow-violet-400/30'
                    : 'px-3 py-2 rounded-lg text-[11px] font-semibold text-center bg-gray-50 dark:bg-stone-700 text-gray-500 dark:text-stone-400 border border-gray-100 dark:border-stone-600'
                }
              >
                {slot}
              </div>
            ))}
          </div>
          <div role="presentation" className="mt-3 w-full bg-violet-600 text-white text-[11px] font-bold py-2 rounded-xl shadow-sm shadow-violet-400/20 text-center">
            Book 11:30 AM →
          </div>
        </div>

        {/* Hotel */}
        <div
          className="bg-white dark:bg-stone-800 rounded-2xl border border-gray-100 dark:border-stone-700 shadow-xl shadow-blue-100/60 dark:shadow-black/30 p-5 float-anim"
          style={{ animationDuration: '5.2s', animationDelay: '-2.1s' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🏨</span>
            <div>
              <p className="text-xs font-bold text-[#1C1917] dark:text-stone-100">Grand Hotel</p>
              <p className="text-[10px] text-[#78716C] dark:text-stone-400">2 nights · 1 room</p>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-3">
            <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
              <div>
                <p className="text-[#78716C] dark:text-stone-400">Check-in</p>
                <p className="font-bold text-[#1C1917] dark:text-stone-100 text-xs mt-0.5">
                  Jan 14
                </p>
              </div>
              <div>
                <p className="text-[#78716C] dark:text-stone-400">Check-out</p>
                <p className="font-bold text-[#1C1917] dark:text-stone-100 text-xs mt-0.5">
                  Jan 16
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] mb-3">
            <span className="text-[#78716C] dark:text-stone-400">Deluxe King</span>
            <span className="font-bold text-blue-700 dark:text-blue-400">$299/night</span>
          </div>
          <div role="presentation" className="w-full bg-blue-600 text-white text-[11px] font-bold py-2 rounded-xl text-center">
            Reserve Room →
          </div>
        </div>

        {/* Restaurant */}
        <div
          className="bg-white dark:bg-stone-800 rounded-2xl border border-gray-100 dark:border-stone-700 shadow-xl shadow-amber-100/60 dark:shadow-black/30 p-5 float-anim"
          style={{ animationDuration: '5.8s', animationDelay: '-1.4s' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🍽️</span>
            <div>
              <p className="text-xs font-bold text-[#1C1917] dark:text-stone-100">
                Maison Restaurant
              </p>
              <p className="text-[10px] text-[#78716C] dark:text-stone-400">Party of 4</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {restaurantSlots.map((slot, index) => (
              <div
                key={slot}
                className={
                  index === 2
                    ? 'py-1.5 rounded-lg text-[10px] font-semibold text-center bg-amber-500 text-black shadow-sm'
                    : 'py-1.5 rounded-lg text-[10px] font-semibold text-center bg-gray-50 dark:bg-stone-700 text-gray-500 dark:text-stone-400 border border-gray-100 dark:border-stone-600'
                }
              >
                {slot}
              </div>
            ))}
          </div>
          <div role="presentation" className="w-full bg-amber-500 text-black text-[11px] font-bold py-2 rounded-xl text-center">
            Reserve 8:00 PM →
          </div>
        </div>

        {/* Events */}
        <div
          className="bg-white dark:bg-stone-800 rounded-2xl border border-gray-100 dark:border-stone-700 shadow-xl shadow-emerald-100/60 dark:shadow-black/30 p-5 float-anim"
          style={{ animationDuration: '4.2s', animationDelay: '-3.5s' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🎪</span>
            <div>
              <p className="text-xs font-bold text-[#1C1917] dark:text-stone-100">The Grand Hall</p>
              <p className="text-[10px] text-[#78716C] dark:text-stone-400">Event Venue</p>
            </div>
          </div>
          <div className="space-y-1.5 mb-3">
            {eventDates.map((item) => (
              <div
                key={item.date}
                className={
                  item.tone === 'selected'
                    ? 'flex items-center justify-between px-2.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800'
                    : 'flex items-center justify-between px-2.5 py-2 rounded-lg bg-gray-50 dark:bg-stone-700 border border-gray-100 dark:border-stone-600'
                }
              >
                <span
                  className={
                    item.tone === 'selected'
                      ? 'text-[10px] font-semibold text-emerald-900 dark:text-emerald-300'
                      : 'text-[10px] font-semibold text-[#1C1917] dark:text-stone-100'
                  }
                >
                  {item.date}
                </span>
                <span
                  className={
                    item.tone === 'selected'
                      ? 'text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white'
                      : item.tone === 'booked'
                        ? 'text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                        : 'text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                  }
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <div role="presentation" className="w-full bg-emerald-600 text-white text-[11px] font-bold py-2 rounded-xl text-center">
            Book Feb 17 →
          </div>
        </div>
      </div>
    </div>
  )
}
