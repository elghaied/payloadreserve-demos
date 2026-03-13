'use client'

import { usePathname, useRouter } from 'next/navigation'

export function LanguageToggle({ locale }: { locale: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    // Replace the locale segment in the path
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[2px]">
      <button
        onClick={() => switchLocale('en')}
        className={`px-1 py-0.5 transition-colors ${locale === 'en' ? 'font-bold text-black' : 'text-muted-text hover:text-black'}`}
      >
        EN
      </button>
      <span className="text-muted-light">|</span>
      <button
        onClick={() => switchLocale('fr')}
        className={`px-1 py-0.5 transition-colors ${locale === 'fr' ? 'font-bold text-black' : 'text-muted-text hover:text-black'}`}
      >
        FR
      </button>
    </div>
  )
}
