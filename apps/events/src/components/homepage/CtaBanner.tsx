import Link from 'next/link'
import type { Homepage } from '@/payload-types'

export function CtaBanner({ homepage, locale }: { homepage: Homepage; locale: string }) {
  return (
    <section className="bg-black px-6 py-16 text-center lg:px-12 lg:py-24">
      {homepage.ctaHeading && (
        <h2 className="mb-4 text-3xl font-black uppercase tracking-[-1px] text-white md:text-4xl">
          {homepage.ctaHeading}
        </h2>
      )}
      {homepage.ctaBody && (
        <p className="mx-auto mb-8 max-w-xl text-neutral-400">{homepage.ctaBody}</p>
      )}
      {homepage.ctaButtonText && homepage.ctaButtonLink && (
        <Link
          href={homepage.ctaButtonLink}
          className="inline-block bg-white px-8 py-4 font-mono text-[10px] uppercase tracking-[2px] text-black transition-colors hover:bg-neutral-200"
        >
          {homepage.ctaButtonText}
        </Link>
      )}
    </section>
  )
}
