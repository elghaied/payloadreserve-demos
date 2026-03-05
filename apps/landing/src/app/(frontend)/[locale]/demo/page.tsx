import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DemoRequestForm } from '@/components/DemoRequestForm'
import { Link } from '@/i18n/navigation'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'demoRequestPage.meta' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function DemoPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'demoRequestPage' })
  const reassurance = t.raw('reassurance') as string[]
  const ttlHours = process.env.DEMO_TTL_HOURS ?? 24

  return (
    <>
      <main id="main-content" className="min-h-screen bg-[#FAFAF8] dark:bg-stone-900 pt-16 px-6 py-20">
        <div className="max-w-lg mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#78716C] hover:text-[#1C1917] dark:text-stone-400 dark:hover:text-stone-100 transition-colors mb-10"
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
            {t('backToHome')}
          </Link>

          {/* Card */}
          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-gray-200 dark:border-stone-700 shadow-sm shadow-gray-100/50 dark:shadow-black/20 p-8">
            {/* Header */}
            <div className="mb-7">
              <h1 className="font-display text-[2.2rem] text-[#1C1917] dark:text-stone-50 leading-tight mb-3">
                {t('headline')}
              </h1>
              <p className="text-[#78716C] dark:text-stone-400 text-sm leading-relaxed">
                {t('description', { hours: ttlHours })}
              </p>
            </div>

            <DemoRequestForm />
          </div>

          {/* Reassurance */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#78716C] dark:text-stone-400">
            {reassurance.map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="text-emerald-600"
                >
                  <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
                  <path
                    d="M3.5 6l1.8 1.8L8.5 4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
