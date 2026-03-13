'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { LanguageToggle } from './LanguageToggle'
import { EVENT_TYPE_COLOR_LIST } from '@/lib/event-colors'

// The ColorStripe is a horizontal bar of 6 equal-width colored segments
function ColorStripe({ height = 6 }: { height?: number }) {
  return (
    <div className="flex w-full" style={{ height: `${height}px` }}>
      {EVENT_TYPE_COLOR_LIST.map((color, i) => (
        <div key={i} className="flex-1" style={{ backgroundColor: color }} />
      ))}
    </div>
  )
}

export { ColorStripe }

export function Header({ locale }: { locale: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = useTranslations('nav')

  const navLinks = [
    { href: `/${locale}/programme`, label: t('programme') },
    { href: `/${locale}/espaces`, label: t('espaces') },
    { href: `/${locale}/artistes`, label: t('artistes') },
    { href: `/${locale}/saison`, label: t('saison') },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="flex items-center justify-between px-6 py-4 lg:px-12">
        {/* Logo */}
        <Link href={`/${locale}`} className="text-3xl font-black tracking-[-3px] lg:text-4xl">
          ÉCLAT
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[10px] uppercase tracking-[3px] text-black transition-colors hover:text-muted-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden items-center gap-4 lg:flex">
          <LanguageToggle locale={locale} />
          <Link
            href={`/${locale}/book`}
            className="bg-black px-5 py-2.5 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800"
          >
            {t('reserver')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col gap-1.5 lg:hidden"
          aria-label="Toggle menu"
        >
          <span className={`block h-[3px] w-6 bg-black transition-transform ${mobileMenuOpen ? 'translate-y-[7.5px] rotate-45' : ''}`} />
          <span className={`block h-[3px] w-6 bg-black transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-[3px] w-6 bg-black transition-transform ${mobileMenuOpen ? '-translate-y-[7.5px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="border-t-[3px] border-black lg:hidden">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-muted-light px-6 py-4 font-mono text-[11px] uppercase tracking-[3px]"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between border-b border-muted-light px-6 py-4">
              <LanguageToggle locale={locale} />
              <Link
                href={`/${locale}/book`}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-black px-5 py-2.5 font-mono text-[10px] uppercase tracking-[2px] text-white"
              >
                {t('reserver')}
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Bottom border + color stripe */}
      <div className="border-b-[3px] border-black" />
      <ColorStripe />
    </header>
  )
}
