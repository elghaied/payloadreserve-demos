'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

export type CarouselSlide = {
  src: string
  alt: string
  caption: string
}

type Props = {
  slides: CarouselSlide[]
  /** Auto-advance interval in ms (default: 5000) */
  interval?: number
}

export function ImageCarousel({ slides, interval = 5000 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const isPaused = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback(
    (next: number) => {
      if (isTransitioning || next === currentIndex) return
      setPrevIndex(currentIndex)
      setCurrentIndex(next)
      setIsTransitioning(true)
    },
    [currentIndex, isTransitioning],
  )

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % slides.length)
  }, [currentIndex, slides.length, goTo])

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return

    timerRef.current = setInterval(() => {
      if (!isPaused.current) goNext()
    }, interval)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [slides.length, interval, goNext])

  // Clear prevIndex after transition ends
  const handleTransitionEnd = useCallback(() => {
    setPrevIndex(null)
    setIsTransitioning(false)
  }, [])

  if (slides.length === 0) return null

  // Preload next image index
  const nextIndex = (currentIndex + 1) % slides.length

  return (
    <div
      className="relative aspect-[16/9] w-full bg-gray-100 dark:bg-stone-800 overflow-hidden"
      onMouseEnter={() => {
        isPaused.current = true
      }}
      onMouseLeave={() => {
        isPaused.current = false
      }}
    >
      {/* Previous image — fades out */}
      {prevIndex !== null && (
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-0"
          onTransitionEnd={handleTransitionEnd}
        >
          <Image
            src={slides[prevIndex].src}
            alt={slides[prevIndex].alt}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 960px"
          />
        </div>
      )}

      {/* Current image — fades in */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          prevIndex !== null ? 'opacity-100' : 'opacity-100'
        }`}
      >
        <Image
          src={slides[currentIndex].src}
          alt={slides[currentIndex].alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 960px"
          priority={currentIndex === 0}
        />
      </div>

      {/* Hidden preload of next image */}
      {nextIndex !== currentIndex && (
        <div className="absolute inset-0 opacity-0 pointer-events-none" aria-hidden="true">
          <Image
            src={slides[nextIndex].src}
            alt=""
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 960px"
          />
        </div>
      )}

      {/* Overlay badge with caption */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-6 pointer-events-none">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/90 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {slides[currentIndex].caption}
        </span>
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 flex items-center gap-1.5 pointer-events-auto">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-6 h-2 bg-white/90'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
