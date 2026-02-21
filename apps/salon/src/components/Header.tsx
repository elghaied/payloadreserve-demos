'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

import { Container } from './Container'
import { LanguageSwitcher } from './LanguageSwitcher'

type Props = {
  locale: string
}

export function Header({ locale }: Props) {
  const t = useTranslations('nav')
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetch('/api/customers/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch('/api/customers/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    window.location.href = `/${locale}`
  }

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <Container className="flex items-center justify-between h-16 lg:h-20">
        <Link href={`/${locale}`} className="font-heading text-xl lg:text-2xl font-semibold tracking-tight">
          Lumière
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href={`/${locale}/services`} className="text-sm tracking-wide text-muted hover:text-foreground transition-colors">
            {t('services')}
          </Link>
          <Link href={`/${locale}/gallery`} className="text-sm tracking-wide text-muted hover:text-foreground transition-colors">
            {t('gallery')}
          </Link>
          <Link href={`/${locale}/gifts`} className="text-sm tracking-wide text-muted hover:text-foreground transition-colors">
            {t('gifts')}
          </Link>
          <Link href={`/${locale}/contact`} className="text-sm tracking-wide text-muted hover:text-foreground transition-colors">
            {t('contact')}
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher locale={locale} />
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}/account`}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {t('account')}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {t('login')}
            </Link>
          )}
          <Link
            href={`/${locale}/book`}
            className="bg-primary text-white px-5 py-2.5 text-sm tracking-wide hover:bg-primary-dark transition-colors"
          >
            {t('book')}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2"
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <span className={`block h-px bg-foreground transition-transform ${menuOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
            <span className={`block h-px bg-foreground transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-foreground transition-transform ${menuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
          </div>
        </button>
      </Container>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-border bg-surface">
          <Container className="py-4 flex flex-col gap-3">
            <Link href={`/${locale}/services`} className="text-sm py-2">{t('services')}</Link>
            <Link href={`/${locale}/gallery`} className="text-sm py-2">{t('gallery')}</Link>
            <Link href={`/${locale}/gifts`} className="text-sm py-2">{t('gifts')}</Link>
            <Link href={`/${locale}/contact`} className="text-sm py-2">{t('contact')}</Link>
            <hr className="border-border" />
            {user ? (
              <>
                <Link href={`/${locale}/account`} className="text-sm py-2">{t('account')}</Link>
                <button onClick={handleLogout} className="text-sm py-2 text-left">{t('logout')}</button>
              </>
            ) : (
              <Link href={`/${locale}/login`} className="text-sm py-2">{t('login')}</Link>
            )}
            <Link
              href={`/${locale}/book`}
              className="bg-primary text-white px-5 py-2.5 text-sm tracking-wide text-center mt-2"
            >
              {t('book')}
            </Link>
            <LanguageSwitcher locale={locale} />
          </Container>
        </div>
      )}
    </header>
  )
}
