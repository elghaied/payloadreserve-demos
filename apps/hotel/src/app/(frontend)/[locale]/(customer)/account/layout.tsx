import { setRequestLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import { LayoutDashboard, User, LogOut } from 'lucide-react'

import config from '@/payload.config'
import { Container } from '@/components/Container'
import { Ornament } from '@/components/Ornament'
import type { Customer } from '@/payload-types'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function AccountLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user || (user as { collection?: string }).collection !== 'customers') {
    redirect(`/${locale}/login`)
  }

  const customer = user as unknown as Customer

  const nav = [
    {
      href: `/${locale}/account`,
      label: locale === 'fr' ? 'Tableau de bord' : 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/account/profile`,
      label: locale === 'fr' ? 'Profil' : 'Profile',
      icon: User,
    },
  ]

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 via-background to-background" />
      <div className="absolute inset-0 noise pointer-events-none" />

      <Container className="relative z-10">
        {/* Header */}
        <div className="mb-12">
          <Ornament variant="line" className="mb-6 justify-start" />
          <h1 className="font-heading text-2xl lg:text-3xl font-bold mb-2">
            {locale === 'fr' ? 'Mon Compte' : 'My Account'}
          </h1>
          <p className="text-sm text-muted">
            {locale === 'fr'
              ? `Bienvenue, ${customer.firstName || ''}`
              : `Welcome back, ${customer.firstName || ''}`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <nav className="glass-strong rounded-xl p-3 flex lg:flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 text-sm text-muted hover:text-foreground hover:bg-foreground/5 rounded-lg px-4 py-3 transition-all"
                >
                  <item.icon className="w-4 h-4 text-primary/60" />
                  {item.label}
                </Link>
              ))}
              <hr className="border-border my-1 hidden lg:block" />
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/api/customers/logout"
                className="flex items-center gap-3 text-sm text-muted hover:text-error hover:bg-error/5 rounded-lg px-4 py-3 transition-all"
              >
                <LogOut className="w-4 h-4" />
                {locale === 'fr' ? 'Deconnexion' : 'Sign Out'}
              </a>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </Container>
    </section>
  )
}
