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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    fetch('/api/customer-session', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/customers/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    window.location.href = `/${locale}`
  }

  const navLinks = [
    { href: `/${locale}/menu`, label: t('menu') },
    { href: `/${locale}/wines`, label: t('wines') },
    { href: `/${locale}/spaces`, label: t('spaces') },
    { href: `/${locale}/team`, label: t('team') },
    { href: `/${locale}/events`, label: t('events') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong border-b border-glass-border' : 'bg-transparent'
      }`}
    >
      <Container className="flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="font-heading italic text-xl lg:text-2xl font-medium tracking-wide text-foreground hover:text-primary transition-colors"
        >
          Le Jardin
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-sm tracking-wide text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher locale={locale} />
          {user ? (
            <>
              <Link
                href={`/${locale}/account`}
                className="text-sm tracking-wide text-muted hover:text-foreground transition-colors"
              >
                {t('account')}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm tracking-wide text-muted hover:text-foreground transition-colors"
              >
                {t('logout')}
              </button>
            </>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="text-sm tracking-wide text-muted hover:text-foreground transition-colors"
            >
              {t('login')}
            </Link>
          )}
          <Link
            href={`/${locale}/book`}
            className="bg-primary text-background px-5 py-2.5 text-sm tracking-wide hover:bg-primary-hover transition-colors"
          >
            {t('book')}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-5 h-px bg-foreground transition-all duration-300 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-5 h-px bg-foreground transition-all duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-px bg-foreground transition-all duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </Container>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="lg:hidden glass-strong border-t border-glass-border">
          <Container className="py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide text-muted hover:text-foreground transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-border my-2" />
            <div className="flex items-center gap-4">
              <LanguageSwitcher locale={locale} />
            </div>
            {user ? (
              <>
                <Link
                  href={`/${locale}/account`}
                  className="text-sm tracking-wide text-muted hover:text-foreground transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('account')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm tracking-wide text-muted hover:text-foreground transition-colors text-left"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="text-sm tracking-wide text-muted hover:text-foreground transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {t('login')}
              </Link>
            )}
            <Link
              href={`/${locale}/book`}
              className="bg-primary text-background px-5 py-2.5 text-sm tracking-wide hover:bg-primary-hover transition-colors text-center"
              onClick={() => setMenuOpen(false)}
            >
              {t('book')}
            </Link>
          </Container>
        </div>
      )}
    </header>
  )
}
