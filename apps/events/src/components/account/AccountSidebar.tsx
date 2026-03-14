'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface AccountSidebarProps {
  locale: string
}

export function AccountSidebar({ locale }: AccountSidebarProps) {
  const t = useTranslations('account')
  const pathname = usePathname()

  const links = [
    { href: `/${locale}/account`, label: t('myBookings') },
    { href: `/${locale}/account/profile`, label: t('profile') },
  ]

  const isActive = (href: string) => {
    if (href.endsWith('/account')) {
      return pathname === href || pathname === `${href}/`
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    await fetch('/api/customers/logout', {
      method: 'POST',
      credentials: 'include',
    })
    window.location.href = `/${locale}`
  }

  return (
    <nav className="flex flex-row gap-2 border-b-[3px] border-black pb-4 lg:flex-col lg:gap-1 lg:border-b-0 lg:border-r-[3px] lg:pb-0 lg:pr-6">
      <div className="hidden font-mono text-[9px] uppercase tracking-[2px] text-neutral-400 lg:mb-4 lg:block">
        {t('title')}
      </div>

      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-3 py-2 font-mono text-[10px] uppercase tracking-[1.5px] transition-colors lg:px-3 lg:py-2.5 ${
            isActive(link.href)
              ? 'bg-black text-white'
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          {link.label}
        </Link>
      ))}

      <button
        onClick={handleLogout}
        className="ml-auto px-3 py-2 font-mono text-[10px] uppercase tracking-[1.5px] text-[#e53e3e] transition-colors hover:text-[#c53030] lg:ml-0 lg:mt-auto lg:border-t lg:border-neutral-200 lg:pt-4"
      >
        {t('logout')}
      </button>
    </nav>
  )
}
