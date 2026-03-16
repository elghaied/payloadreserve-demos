'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { ThemeToggle } from './ThemeToggle'
import { LocaleSwitcher } from './LocaleSwitcher'
import { PayloadReserveBrand } from './PayloadReserveBrand'
import type { Navigation, SiteSetting } from '@/payload-types'

type NavProps = {
  navigation: Navigation
  urls: SiteSetting['externalUrls']
}

export function Nav({ navigation, urls }: NavProps) {
  const [open, setOpen] = useState(false)

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  const linkClass =
    'text-sm text-[#78716C] hover:text-[#1C1917] dark:text-stone-400 dark:hover:text-stone-100 transition-colors font-medium'

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-gray-200/80 dark:border-stone-700/80 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <PayloadReserveBrand size="md" className="text-[#1C1917] dark:text-stone-100" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <a href={urls?.docs ?? '#'} className={linkClass}>
            {navigation.docsLabel ?? 'Docs'}
          </a>
          <Link href="/#demos" className={linkClass}>
            {navigation.demosLabel ?? 'Demos'}
          </Link>
          <a
            href={urls?.github ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 ${linkClass}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            {navigation.githubLabel ?? 'GitHub'}
          </a>
          <ThemeToggle />
          <LocaleSwitcher />
          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 text-sm text-[#78716C] hover:text-[#1C1917] dark:text-stone-400 dark:hover:text-stone-100 border border-gray-200 dark:border-stone-700 hover:border-violet-400 dark:hover:border-violet-600 font-semibold px-4 py-1.5 rounded-full transition-all duration-150"
          >
            {navigation.requestDemoLabel ?? 'Request Demo'}
          </Link>
        </nav>

        {/* Mobile: theme + locale + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <LocaleSwitcher />
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="p-2 -mr-2 text-[#78716C] dark:text-stone-400 hover:text-[#1C1917] dark:hover:text-stone-100 transition-colors"
          >
            {open ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="md:hidden border-t border-gray-200/80 dark:border-stone-700/80 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md"
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3">
            <a href={urls?.docs ?? '#'} onClick={() => setOpen(false)} className={`py-2 ${linkClass}`}>
              {navigation.docsLabel ?? 'Docs'}
            </a>
            <Link href="/#demos" onClick={() => setOpen(false)} className={`py-2 ${linkClass}`}>
              {navigation.demosLabel ?? 'Demos'}
            </Link>
            <a
              href={urls?.github ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={`inline-flex items-center gap-1.5 py-2 ${linkClass}`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              {navigation.githubLabel ?? 'GitHub'}
            </a>
            <Link
              href="/demo"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 text-sm text-[#78716C] hover:text-[#1C1917] dark:text-stone-400 dark:hover:text-stone-100 border border-gray-200 dark:border-stone-700 hover:border-violet-400 dark:hover:border-violet-600 font-semibold px-4 py-2.5 rounded-full transition-all duration-150 mt-1"
            >
              {navigation.requestDemoLabel ?? 'Request Demo'}
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
