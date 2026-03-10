'use client'

import { usePathname, useRouter } from 'next/navigation'

export function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => switchLocale('en')}
        className={`px-2 py-1 rounded transition-colors ${
          locale === 'en' ? 'text-primary' : 'text-muted hover:text-foreground'
        }`}
      >
        EN
      </button>
      <span className="text-border">|</span>
      <button
        onClick={() => switchLocale('fr')}
        className={`px-2 py-1 rounded transition-colors ${
          locale === 'fr' ? 'text-primary' : 'text-muted hover:text-foreground'
        }`}
      >
        FR
      </button>
    </div>
  )
}
