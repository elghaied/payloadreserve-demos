import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPayload, TypedLocale } from 'payload'
import config from '@payload-config'
import type { Config, Demo, Media } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getCachedDocument } from '@/utilities/getDocument'

type Props = {
  params: Promise<{ locale: string; type: string }>
}

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type } = await params

  const loc = locale as Config['locale']
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'demos',
    where: { slug: { equals: type } },
    locale: loc,
    limit: 1,
    depth: 1,
  })

  const demo = result.docs[0]
  if (!demo) return {}

  return {
    title: `${demo.name} Demo - payload-reserve`,
    description: demo.detailDescription ?? demo.description,
  }
}

export default async function DemoDetailPage({ params }: Props) {
  const { locale, type } = await params
  const loc = locale as TypedLocale

  const [siteSettings, demo] = await Promise.all([
    getCachedGlobal('site-settings', 0, loc)(),
    getCachedDocument('demos', type, loc, 1)(),
  ])

  if (!demo) notFound()

  const ui = siteSettings.demoDetailUi ?? {}
  const d = demo as Demo & {
    featuresHeading?: string | null
    pluginConfigHeading?: string | null
    detailCtaTitle?: string | null
    detailCtaSubtitle?: string | null
  }
  const urls = siteSettings.externalUrls
  const isLive = !!demo.liveUrl

  return (
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
            {ui.backToDemos ?? 'All Demos'}
          </Link>

          <div className="flex items-center gap-5 mb-6">
            <span className="text-6xl">{demo.emoji}</span>
            <div>
              <h1 className="font-display text-[clamp(2.2rem,5vw,4rem)] text-[#1C1917] dark:text-stone-50 leading-[1.05]">
                {demo.name}
              </h1>
              <p className="text-base font-medium mt-1 text-violet-700 dark:text-violet-400">
                {demo.tagline}
              </p>
            </div>
          </div>

          <p className="text-[#78716C] dark:text-stone-400 text-lg leading-relaxed max-w-2xl">
            {demo.detailDescription ?? demo.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-8">
            {isLive ? (
              <a
                href={demo.liveUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-violet-700 hover:bg-violet-600 text-white shadow-sm shadow-violet-400/20"
              >
                {ui.visitLiveDemo ?? 'Visit Live Demo ↗'}
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full bg-gray-100 dark:bg-stone-800 text-gray-400 dark:text-stone-500 cursor-default">
                {ui.demoComingSoon ?? 'Demo Coming Soon'}
              </span>
            )}
            <Link
              href={`/demo?type=${type}`}
              className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-amber-500 hover:bg-amber-400 text-black shadow-sm shadow-amber-400/20"
            >
              {ui.requestPrivateDemo ?? 'Request Private Demo'}
            </Link>
          </div>
        </div>
      </section>

      {/* Detail features */}
      <section className="py-20 px-6 lg:px-8 bg-white dark:bg-stone-800">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-violet-700 dark:text-violet-400">
            {ui.featuresLabel ?? 'Features'}
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#1C1917] dark:text-stone-50 leading-[1.1] mb-12">
            {d.featuresHeading ?? `Built for ${demo.workflowIndustry ?? type} workflows`}
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {(demo.detailFeatures ?? []).map((feature, i) => (
              <div
                key={feature.id ?? i}
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

      {/* Screenshots */}
      <section className="py-20 px-6 lg:px-8 bg-[#FAFAF8] dark:bg-stone-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.5rem)] text-[#1C1917] dark:text-stone-50 leading-[1.1] mb-8">
            {ui.screenshotsHeading ?? 'Screenshots'}
          </h2>
          <div className="relative rounded-2xl border border-gray-200 dark:border-stone-700 bg-gradient-to-br from-gray-100 dark:from-stone-800 to-gray-50 dark:to-stone-700 aspect-video flex flex-col items-center justify-center gap-3 shadow-sm overflow-hidden">
            {(demo.screenshots ?? []).length > 0 ? (
              (demo.screenshots ?? []).map((shot, i) => {
                const img = shot.image
                const src =
                  img && typeof img === 'object'
                    ? ((img as Media).url ?? '/imgs/image-not-found.png')
                    : ''
                if (!src) return null
                return (
                  <Image
                    key={shot.id ?? i}
                    src={src}
                    alt={shot.alt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 960px"
                  />
                )
              })
            ) : (
              <>
                <span className="text-4xl opacity-30">{demo.emoji}</span>
                <p className="text-sm font-medium text-gray-400 dark:text-stone-500">
                  {ui.screenshotsComingSoon ?? 'Screenshots coming soon'}
                </p>
                {isLive && (
                  <p className="text-xs text-gray-400 dark:text-stone-500">
                    {ui.screenshotsLivePromptBefore ?? 'Visit the'}{' '}
                    <a
                      href={demo.liveUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-violet-700 dark:text-violet-400"
                    >
                      {ui.screenshotsLiveDemoLabel ?? 'live demo'}
                    </a>{' '}
                    {ui.screenshotsLivePromptAfter ?? 'to see it in action'}
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
            {ui.configurationLabel ?? 'Configuration'}
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.5rem)] text-white leading-[1.1] mb-8">
            {d.pluginConfigHeading ?? `Plugin config for ${demo.name}`}
          </h2>
          <div className="bg-[#0d0d0f] rounded-2xl border border-white/10 overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-[#111113]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-auto font-mono text-[11px] text-zinc-600">
                {ui.payloadConfigFile ?? 'payload.config.ts'}
              </span>
            </div>
            <pre className="p-6 font-mono text-[13px] leading-relaxed text-zinc-300 overflow-x-auto">
              <code>{demo.pluginSnippet}</code>
            </pre>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            {ui.docsNoteBefore ?? 'See the'}{' '}
            <a
              href={urls?.docs ?? '#'}
              className="text-amber-400 hover:text-amber-300 transition-colors underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {ui.docsLinkLabel ?? 'full documentation'}
            </a>{' '}
            {ui.docsNoteAfter ?? 'for all available options.'}
          </p>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-16 px-6 lg:px-8 bg-[#FAFAF8] dark:bg-stone-900 border-t border-gray-200 dark:border-stone-800">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-[#1C1917] dark:text-stone-100 text-lg">
              {d.detailCtaTitle ?? `Ready to explore ${demo.name}?`}
            </h3>
            <p className="text-[#78716C] dark:text-stone-400 text-sm mt-1">
              {d.detailCtaSubtitle ?? 'Try the live demo or request your own private environment.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isLive ? (
              <a
                href={demo.liveUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-violet-700 hover:bg-violet-600 text-white shadow-sm shadow-violet-400/20"
              >
                {ui.visitLiveDemo ?? 'Visit Live Demo ↗'}
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full bg-gray-100 dark:bg-stone-800 text-gray-400 dark:text-stone-500 cursor-default">
                {ui.demoComingSoon ?? 'Demo Coming Soon'}
              </span>
            )}
            <Link
              href={`/demo?type=${type}`}
              className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-amber-500 hover:bg-amber-400 text-black shadow-sm shadow-amber-400/20"
            >
              {ui.requestPrivateDemo ?? 'Request Private Demo'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
