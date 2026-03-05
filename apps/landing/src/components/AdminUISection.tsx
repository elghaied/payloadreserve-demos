import type { HomePage, Media } from '@/payload-types'
import { ImageCarousel, type CarouselSlide } from './ImageCarousel'

type Props = {
  adminUiSection: HomePage['adminUiSection']
}

export function AdminUISection({ adminUiSection }: Props) {
  if (!adminUiSection) return null

  const payloadSlides = adminUiSection.adminUiSlides ?? []

  const slides: CarouselSlide[] = payloadSlides
    .filter((s) => {
      const img = s.image
      return img && typeof img === 'object' && (img as Media).url
    })
    .map((s) => {
      const img = s.image as Media
      return {
        src: img.url!,
        alt: img.alt || s.caption,
        caption: s.caption,
      }
    })

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-[#F7F7F5] dark:bg-stone-950">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-[0.2em] mb-4">
            {adminUiSection.adminUiLabel}
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] text-[#1C1917] dark:text-stone-50 leading-[1.1] mb-5">
            {adminUiSection.adminUiHeadline}
          </h2>
          <p className="text-[#78716C] dark:text-stone-400 text-lg leading-relaxed">
            {adminUiSection.adminUiSubtitle}
          </p>
        </div>

        {/* Browser frame */}
        <div className="rounded-2xl border border-gray-200 dark:border-stone-700 overflow-hidden shadow-2xl shadow-violet-100/40 dark:shadow-black/40 bg-white dark:bg-stone-900">
          {/* Top bar */}
          <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-100 dark:bg-stone-800 border-b border-gray-200 dark:border-stone-700">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <div className="ml-4 flex-1 max-w-xs mx-auto bg-white dark:bg-stone-700 rounded-md px-3 py-1 text-[11px] text-gray-400 dark:text-stone-400 font-mono border border-gray-200 dark:border-stone-600 text-center">
              {adminUiSection.adminUiBrowserUrl}
            </div>
          </div>

          {/* Screenshot carousel */}
          <ImageCarousel slides={slides} />
        </div>
      </div>
    </section>
  )
}
