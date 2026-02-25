import { useTranslations } from 'next-intl'
import Image from 'next/image'

export function AdminUISection() {
  const t = useTranslations('adminUI')

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-[#F7F7F5] dark:bg-stone-950">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-[0.2em] mb-4">
            {t('label')}
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] text-[#1C1917] dark:text-stone-50 leading-[1.1] mb-5">
            {t('headline')}
          </h2>
          <p className="text-[#78716C] dark:text-stone-400 text-lg leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Browser chrome mockup */}
        <div className="rounded-2xl border border-gray-200 dark:border-stone-700 overflow-hidden shadow-2xl shadow-violet-100/40 dark:shadow-black/40">
          {/* Window chrome bar */}
          <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-100 dark:bg-stone-800 border-b border-gray-200 dark:border-stone-700">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <div className="ml-4 flex-1 max-w-xs mx-auto bg-white dark:bg-stone-700 rounded-md px-3 py-1 text-[11px] text-gray-400 dark:text-stone-400 font-mono border border-gray-200 dark:border-stone-600 text-center">
              admin.yoursite.com/admin
            </div>
          </div>

          {/* Screenshot area */}
          <div className="relative aspect-[16/9] w-full bg-gray-100 dark:bg-stone-800">
            <Image
              src={`https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1200`}
              alt={t('screenshotAlt')}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 960px"
            />
            {/* Overlay with placeholder text until real screenshot is available */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Screenshot placeholder — swap in real admin panel image
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
