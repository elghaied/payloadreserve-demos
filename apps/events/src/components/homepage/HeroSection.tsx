import Link from 'next/link'
import Image from 'next/image'
import type { Homepage, Media } from '@/payload-types'
import { ColorStripe } from '@/components/layout/Header'

export function HeroSection({ homepage, locale }: { homepage: Homepage; locale: string }) {
  const image = homepage.heroBackgroundImage as Media | null

  return (
    <section>
      <div className="grid lg:grid-cols-[3fr_2fr]">
        {/* Left: Text */}
        <div className="flex flex-col justify-center border-r-0 px-6 py-16 lg:border-r-[3px] lg:border-black lg:px-12 lg:py-24">
          {homepage.heroTitle && (
            <h1 className="mb-6 text-5xl font-black uppercase tracking-[-3px] md:text-7xl">
              {homepage.heroTitle}
            </h1>
          )}
          {homepage.heroSubtitle && (
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted-text">
              {homepage.heroSubtitle}
            </p>
          )}
          {homepage.heroCtaText && homepage.heroCtaLink && (
            <Link
              href={homepage.heroCtaLink}
              className="inline-block self-start bg-black px-8 py-4 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800"
            >
              {homepage.heroCtaText}
            </Link>
          )}
        </div>
        {/* Right: Image */}
        <div className="relative min-h-[400px] lg:min-h-[500px]">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || ''}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>
      </div>
      <ColorStripe />
    </section>
  )
}
