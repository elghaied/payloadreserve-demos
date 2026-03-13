import Image from 'next/image'
import type { Artist, Media } from '@/payload-types'
import { getSpecialtyColor } from '@/lib/event-colors'

export function ArtistCard({
  artist,
  featured,
  specialtyLabel,
  websiteLabel,
}: {
  artist: Artist
  featured?: boolean
  specialtyLabel?: string
  websiteLabel?: string
}) {
  const photo = artist.photo as Media | null
  const specialtyColor = artist.specialty
    ? getSpecialtyColor(artist.specialty)
    : '#666666'

  const bio = artist.bio || ''
  const bioExcerpt = bio.length > 100 ? bio.slice(0, 100) + '...' : bio

  return (
    <div
      className={`border-[3px] border-black transition-shadow hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] ${
        featured ? 'md:col-span-2 md:flex md:flex-row' : ''
      }`}
    >
      <div className={`relative aspect-square overflow-hidden ${featured ? 'md:w-2/5 md:aspect-auto md:h-auto' : ''}`}>
        {photo?.url ? (
          <Image
            src={photo.url}
            alt={photo.alt || artist.name}
            fill
            className="object-cover"
            sizes={featured ? '(max-width: 768px) 100vw, 40vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100">
            <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
              No Photo
            </span>
          </div>
        )}
      </div>
      <div className={`p-5 ${featured ? 'md:flex-1 md:flex md:flex-col md:justify-center' : ''}`}>
        <h3 className={`mb-2 font-bold ${featured ? 'text-xl' : 'text-base'}`}>
          {artist.name}
        </h3>
        {artist.specialty && (
          <span
            className="mb-3 inline-block px-2 py-0.5 font-mono text-[9px] uppercase tracking-[2px] text-white"
            style={{ backgroundColor: specialtyColor }}
          >
            {specialtyLabel || artist.specialty.replace('-', ' ')}
          </span>
        )}
        {bioExcerpt && (
          <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-neutral-600">
            {bioExcerpt}
          </p>
        )}
        {artist.website && (
          <a
            href={artist.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[2px] text-black underline hover:no-underline"
          >
            {websiteLabel || 'Website'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
