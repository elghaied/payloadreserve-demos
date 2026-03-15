'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Container } from './Container'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Button } from './ui/button'

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
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/customers/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    window.location.href = `/${locale}`
  }

  const navLinkClass = 'nav-link text-sm tracking-wide text-muted hover:text-foreground transition-colors duration-300'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass-strong shadow-lg shadow-background/20'
          : 'bg-transparent',
      )}
    >
      <Container className="flex items-center justify-between h-18 lg:h-22">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-8 h-8 lg:w-9 lg:h-9 shrink-0"
            aria-hidden="true"
          >
            <rect x="6" y="6" width="20" height="20" rx="1" fill="none" stroke="#C47D5A" strokeWidth="1.5" transform="rotate(45 16 16)" />
            <text x="16" y="19.5" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" letterSpacing="0.5" fill="#C47D5A">GH</text>
          </svg>
          <span className="font-heading text-xl lg:text-2xl font-bold tracking-tight">
            Grand<span className="text-gradient-copper"> Hotel</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-10">
          <Link href={`/${locale}/rooms`} className={navLinkClass}>{t('rooms')}</Link>
          <Link href={`/${locale}/gallery`} className={navLinkClass}>{t('gallery')}</Link>
          <Link href={`/${locale}/contact`} className={navLinkClass}>{t('contact')}</Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${locale}/account`}>
                  <User className="w-4 h-4" />
                  {t('account')}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${locale}/login`}>{t('login')}</Link>
            </Button>
          )}
          <Button asChild>
            <Link href={`/${locale}/book`}>{t('book')}</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </Container>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden glass-strong animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <Container className="py-6 flex flex-col gap-1">
            <Link href={`/${locale}/rooms`} className="text-sm py-3 px-3 rounded-lg hover:bg-foreground/5 transition-colors">{t('rooms')}</Link>
            <Link href={`/${locale}/gallery`} className="text-sm py-3 px-3 rounded-lg hover:bg-foreground/5 transition-colors">{t('gallery')}</Link>
            <Link href={`/${locale}/contact`} className="text-sm py-3 px-3 rounded-lg hover:bg-foreground/5 transition-colors">{t('contact')}</Link>
            <div className="border-t border-border my-3" />
            {user ? (
              <>
                <Link href={`/${locale}/account`} className="text-sm py-3 px-3 rounded-lg hover:bg-foreground/5 transition-colors flex items-center gap-2">
                  <User className="w-4 h-4 text-muted" />{t('account')}
                </Link>
                <button onClick={handleLogout} className="text-sm py-3 px-3 rounded-lg hover:bg-foreground/5 transition-colors text-left flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-muted" />{t('logout')}
                </button>
              </>
            ) : (
              <Link href={`/${locale}/login`} className="text-sm py-3 px-3 rounded-lg hover:bg-foreground/5 transition-colors">{t('login')}</Link>
            )}
            <Button className="mt-3 w-full" asChild>
              <Link href={`/${locale}/book`}>{t('book')}</Link>
            </Button>
            <div className="flex justify-center mt-4">
              <LanguageSwitcher locale={locale} />
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}
