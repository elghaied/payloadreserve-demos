import { useTranslations } from 'next-intl'

export function CTABanner() {
  const t = useTranslations('cta')
  const urls = useTranslations('urls')

  return (
    <section className="py-24 px-6 lg:px-8 bg-violet-700 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-violet-600/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-700/60 blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-violet-500/30 blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <p className="text-xs font-bold text-white/70 uppercase tracking-[0.2em] mb-5">
          {t('label')}
        </p>
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] text-white leading-[1.08] mb-6">
          {t('headline')}
        </h2>
        <p className="text-violet-200 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://docs.payloadreserve.com"
            className="inline-flex items-center gap-2 bg-white hover:bg-violet-50 active:scale-95 text-violet-700 dark:text-violet-800 font-bold text-base px-8 py-4 rounded-full transition-all shadow-xl shadow-black/20"
          >
            {t('ctaDocs')}
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href={urls('github')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-base px-8 py-4 rounded-full transition-all border border-white/25"
          >
            {t('ctaGithub')}
          </a>
        </div>
      </div>
    </section>
  )
}
