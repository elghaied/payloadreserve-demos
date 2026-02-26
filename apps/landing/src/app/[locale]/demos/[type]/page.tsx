import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import Image from 'next/image'

type DemoType = 'salon' | 'hotel' | 'restaurant' | 'events'

interface DemoPageFeature {
  title: string
  description: string
}

interface DemoScreenshot {
  src: string
  alt: string
}

interface DemoPageConfig {
  name: string
  tagline: string
  emoji: string
  workflowIndustry: string
  description: string
  liveUrl: string | null
  features: DemoPageFeature[]
  pluginSnippet: string
  screenshots: DemoScreenshot[]
}

type Props = {
  params: Promise<{ locale: string; type: string }>
}

const validTypes: DemoType[] = ['salon', 'hotel', 'restaurant', 'events']

export function generateStaticParams() {
  return validTypes.map((type) => ({ type }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type } = await params

  if (!validTypes.includes(type as DemoType)) {
    return {}
  }

  const t = await getTranslations({ locale, namespace: 'demoDetails' })
  const config = t.raw(`types.${type}`) as DemoPageConfig

  return {
    title: t('metaTitle', { name: config.name }),
    description: config.description,
  }
}

export default async function DemoDetailPage({ params }: Props) {
  const { locale, type } = await params

  if (!validTypes.includes(type as DemoType)) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: 'demoDetails' })
  const urls = await getTranslations({ locale, namespace: 'urls' })

  const config = t.raw(`types.${type}`) as DemoPageConfig
  const isLive = config.liveUrl !== null

  return (
    <>
      <Nav />
      <main className="pt-16 bg-[#FAFAF8] dark:bg-stone-900 min-h-screen">
        {/* Hero */}
        <section className="bg-[#FAFAF8] dark:bg-stone-900 px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Back nav */}
            <Link
              href="/#demos"
              className="inline-flex items-center gap-2 text-sm text-[#78716C] dark:text-stone-400 hover:text-[#1C1917] dark:hover:text-stone-100 transition-colors mb-10"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('backToDemos')}
            </Link>

            <div className="flex items-center gap-5 mb-6">
              <span className="text-6xl">{config.emoji}</span>
              <div>
                <h1 className="font-display text-[clamp(2.2rem,5vw,4rem)] text-[#1C1917] dark:text-stone-50 leading-[1.05]">
                  {config.name}
                </h1>
                <p className="text-base font-medium mt-1 text-violet-700 dark:text-violet-400">
                  {config.tagline}
                </p>
              </div>
            </div>

            <p className="text-[#78716C] dark:text-stone-400 text-lg leading-relaxed max-w-2xl">
              {config.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-8">
              {isLive ? (
                <a
                  href={config.liveUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-violet-700 hover:bg-violet-600 text-white shadow-sm shadow-violet-400/20"
                >
                  {t('visitLiveDemo')}
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full bg-gray-100 dark:bg-stone-800 text-gray-400 dark:text-stone-500 cursor-default">
                  {t('demoComingSoon')}
                </span>
              )}
              <Link
                href={`/demo?type=${type}`}
                className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-amber-500 hover:bg-amber-400 text-black shadow-sm shadow-amber-400/20"
              >
                {t('requestPrivateDemo')}
              </Link>
            </div>
          </div>
        </section>

        {/* Use-case features */}
        <section className="py-20 px-6 lg:px-8 bg-white dark:bg-stone-800">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-violet-700 dark:text-violet-400">
              {t('featuresLabel')}
            </p>
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#1C1917] dark:text-stone-50 leading-[1.1] mb-12">
              {t('workflowsTitle', { industry: config.workflowIndustry })}
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {config.features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border p-6 bg-[#F7F7F5] dark:bg-stone-700 border-gray-200 dark:border-stone-600"
                >
                  <h3 className="font-bold text-base mb-2 text-[#1C1917] dark:text-stone-100">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#78716C] dark:text-stone-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshot */}
        <section className="py-20 px-6 lg:px-8 bg-[#FAFAF8] dark:bg-stone-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.5rem)] text-[#1C1917] dark:text-stone-50 leading-[1.1] mb-8">
              {t('screenshotsHeading')}
            </h2>
            <div className="relative rounded-2xl border border-gray-200 dark:border-stone-700 bg-gradient-to-br from-gray-100 dark:from-stone-800 to-gray-50 dark:to-stone-700 aspect-video flex flex-col items-center justify-center gap-3 shadow-sm overflow-hidden">
              {config.screenshots.length > 0 ? (
                config.screenshots.map((shot) => (
                  <Image
                    key={shot.src}
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 960px"
                  />
                ))
              ) : (
                <>
                  <span className="text-4xl opacity-30">{config.emoji}</span>

                  <p className="text-sm font-medium text-gray-400 dark:text-stone-500">
                    {t('screenshotsComingSoon')}
                  </p>
                  {isLive && (
                    <p className="text-xs text-gray-400 dark:text-stone-500">
                      {t.rich('screenshotsLivePrompt', {
                        liveDemo: (chunks) => (
                          <a
                            href={config.liveUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-violet-700 dark:text-violet-400"
                          >
                            {chunks}
                          </a>
                        ),
                      })}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Plugin config snippet */}
        <section className="py-20 px-6 lg:px-8 bg-[#1C1917]">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] mb-3">
              {t('configurationLabel')}
            </p>
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.5rem)] text-white leading-[1.1] mb-8">
              {t('pluginConfigTitle', { name: config.name })}
            </h2>
            <div className="bg-[#0d0d0f] rounded-2xl border border-white/10 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-[#111113]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-auto font-mono text-[11px] text-zinc-600">{t('payloadConfigFile')}</span>
              </div>
              <pre className="p-6 font-mono text-[13px] leading-relaxed text-zinc-300 overflow-x-auto">
                <code>{config.pluginSnippet}</code>
              </pre>
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              {t.rich('docsNote', {
                docs: (chunks) => (
                  <a
                    href={urls('docs')}
                    className="text-amber-400 hover:text-amber-300 transition-colors underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        </section>

        {/* CTA strip */}
        <section className="py-16 px-6 lg:px-8 bg-[#FAFAF8] dark:bg-stone-900 border-t border-gray-200 dark:border-stone-800">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-[#1C1917] dark:text-stone-100 text-lg">
                {t('ctaTitle', { name: config.name })}
              </h3>
              <p className="text-[#78716C] dark:text-stone-400 text-sm mt-1">{t('ctaSubtitle')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {isLive ? (
                <a
                  href={config.liveUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-violet-700 hover:bg-violet-600 text-white shadow-sm shadow-violet-400/20"
                >
                  {t('visitLiveDemo')}
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full bg-gray-100 dark:bg-stone-800 text-gray-400 dark:text-stone-500 cursor-default">
                  {t('demoComingSoon')}
                </span>
              )}
              <Link
                href={`/demo?type=${type}`}
                className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-amber-500 hover:bg-amber-400 text-black shadow-sm shadow-amber-400/20"
              >
                {t('requestPrivateDemo')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
