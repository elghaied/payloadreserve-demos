import Image from 'next/image'
import type { Homepage, Artist, Media } from '@/payload-types'
import { getSpecialtyColor } from '@/lib/event-colors'

export function ArtistsSection({
  homepage,
  artists,
  locale: _locale,
}: {
  homepage: Homepage
  artists: Artist[]
  locale: string
}) {
  return (
    <section className="border-t-[3px] border-black px-6 py-16 lg:px-12 lg:py-24">
      {homepage.artistsHeading && (
        <h2 className="mb-2 text-3xl font-black uppercase tracking-[-1px] md:text-4xl">
          {homepage.artistsHeading}
        </h2>
      )}
      {homepage.artistsSubtitle && (
        <p className="mb-10 text-muted-text">{homepage.artistsSubtitle}</p>
      )}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {artists.map((artist) => {
          const photo = artist.photo as Media | null
          const specialtyColor = artist.specialty
            ? getSpecialtyColor(artist.specialty)
            : '#666666'

          return (
            <div key={artist.id} className="min-w-[200px] flex-shrink-0">
              <div className="relative mb-3 aspect-square border-[3px] border-black">
                {photo?.url ? (
                  <Image
                    src={photo.url}
                    alt={photo.alt || artist.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </div>
              <h3 className="mb-1 font-bold">{artist.name}</h3>
              {artist.specialty && (
                <span
                  className="inline-block px-2 py-0.5 font-mono text-[9px] uppercase tracking-[2px] text-white"
                  style={{ backgroundColor: specialtyColor }}
                >
                  {artist.specialty.replace('-', ' ')}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
