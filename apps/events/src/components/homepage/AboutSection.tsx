import Image from 'next/image'
import type { Homepage, Media } from '@/payload-types'

export function AboutSection({ homepage }: { homepage: Homepage }) {
  const image = homepage.aboutImage as Media | null

  return (
    <section className="border-t-[3px] border-black">
      <div className="grid gap-8 px-6 py-16 md:grid-cols-2 lg:gap-16 lg:px-12 lg:py-24">
        <div className="flex flex-col justify-center">
          {homepage.aboutHeading && (
            <h2 className="mb-6 text-3xl font-black uppercase tracking-[-1px] md:text-4xl">
              {homepage.aboutHeading}
            </h2>
          )}
          {homepage.aboutBody && (
            <p className="mb-6 leading-relaxed text-muted-text">{homepage.aboutBody}</p>
          )}
          {homepage.aboutEstablished && (
            <span className="inline-block self-start border-[3px] border-black px-4 py-2 font-mono text-[11px] uppercase tracking-[2px]">
              {homepage.aboutEstablished}
            </span>
          )}
        </div>
        <div className="relative min-h-[300px] border-[3px] border-black">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>
      </div>
    </section>
  )
}
