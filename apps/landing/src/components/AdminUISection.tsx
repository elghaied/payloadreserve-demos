'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { HomePage, Media } from '@/payload-types'

// Static screenshot paths — used when Payload slides don't have uploaded images
const staticScreenshots = [
  '/imgs/screenshot-reservations-month.png',
  '/imgs/screenshot-reservations-week.png',
  '/imgs/screenshot-reservations-day.png',
  '/imgs/screenshot-pending.png',
  '/imgs/screenshot-add-reservation.png',
  '/imgs/screenshot-module.png',
]

type Props = {
  adminUiSection: HomePage['adminUiSection']
}

export function AdminUISection({ adminUiSection }: Props) {
  if (!adminUiSection) {
    return null
  }

  const payloadSlides = adminUiSection.adminUiSlides ?? []

  const slides = staticScreenshots.map((staticSrc, i) => {
    const payloadSlide = payloadSlides[i]
    const img = payloadSlide?.image
    const src =
      img && typeof img === 'object' && (img as Media).url ? (img as Media).url! : staticSrc
    return { src, description: payloadSlide?.caption ?? '' }
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length)
        setFade(true)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [slides.length])

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

          {/* Screenshot area */}
          <div className="relative aspect-[16/9] w-full bg-gray-100 dark:bg-stone-800 overflow-hidden">
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                fade ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                key={slides[currentIndex].src}
                src={slides[currentIndex].src}
                alt="payload-reserve admin panel screenshot"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 960px"
                priority
              />
            </div>

            {/* Overlay badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-6 pointer-events-none">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/90 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {slides[currentIndex].description}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
