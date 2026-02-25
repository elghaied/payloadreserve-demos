import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'

type DemoKey = 'salon' | 'hotel' | 'restaurant' | 'events'

const demoMeta: Record<DemoKey, { emoji: string; active: boolean; pexelsId: string }> = {
  salon:      { emoji: '✂️', active: true,  pexelsId: '3065180' },
  hotel:      { emoji: '🏨', active: false, pexelsId: '271624'  },
  restaurant: { emoji: '🍽️', active: false, pexelsId: '262978'  },
  events:     { emoji: '🎪', active: false, pexelsId: '1540406' },
}

const demoKeys: DemoKey[] = ['salon', 'hotel', 'restaurant', 'events']

export function DemoCards() {
  const t = useTranslations('demos')

  return (
    <section id="demos" className="py-24 lg:py-32 px-6 lg:px-8 bg-[#FAFAF8] dark:bg-stone-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-[0.2em] mb-4">{t('label')}</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] text-[#1C1917] dark:text-stone-50 leading-[1.1] mb-5">
            {t('headline')}
          </h2>
          <p className="text-[#78716C] dark:text-stone-400 text-lg leading-relaxed">
            {t('subheading')}
          </p>
        </div>

        {/* Cards — 2-col grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {demoKeys.map((key) => {
            const meta = demoMeta[key]
            const features = t.raw(`${key}.features`) as string[]

            return (
              <div
                key={key}
                className={`relative rounded-2xl border bg-white dark:bg-stone-800 border-gray-200 dark:border-stone-700 overflow-hidden transition-all duration-200 ${meta.active ? 'hover:-translate-y-0.5 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md' : 'opacity-60 dark:opacity-50'}`}
              >
                {/* Pexels header image */}
                <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-stone-700">
                  <Image
                    src={`https://images.pexels.com/photos/${meta.pexelsId}/pexels-photo-${meta.pexelsId}.jpeg?auto=compress&cs=tinysrgb&w=800`}
                    alt={t(`${key}.name`)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                <div className="p-7">
                  {/* Coming soon badge */}
                  {!meta.active && (
                    <span className="absolute top-5 right-5 text-[10px] font-bold bg-white dark:bg-stone-700 border border-gray-200 dark:border-stone-600 text-gray-500 dark:text-stone-400 px-2.5 py-1 rounded-full">
                      {t('comingSoon')}
                    </span>
                  )}

                  {/* Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <span className="text-4xl leading-none">{meta.emoji}</span>
                    <div>
                      <h3 className="font-bold text-xl text-[#1C1917] dark:text-stone-100 leading-tight">{t(`${key}.name`)}</h3>
                      <p className="text-sm font-medium mt-0.5 text-[#78716C] dark:text-stone-400">{t(`${key}.tagline`)}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#78716C] dark:text-stone-400 leading-relaxed mb-5">{t(`${key}.description`)}</p>

                  {/* Feature list */}
                  <ul className="grid grid-cols-2 gap-y-2 gap-x-3 mb-7">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[#78716C] dark:text-stone-400">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 text-violet-600 dark:text-violet-400">
                          <circle cx="6.5" cy="6.5" r="6" fill="currentColor" fillOpacity="0.15" />
                          <path d="M4 6.5l1.8 1.8L9 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {meta.active ? (
                    <Link
                      href={`/demos/${key}`}
                      className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all bg-violet-700 hover:bg-violet-600 text-white shadow-sm shadow-violet-400/20"
                    >
                      {t('exploreDemo')}
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-stone-700 text-gray-400 dark:text-stone-500 cursor-default">
                      {t('comingSoon')}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
