import { setRequestLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'

import config from '@/payload.config'
import { Container } from '@/components/Container'

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

  if (!user) {
    redirect(`/${locale}/login`)
  }

  const nav = [
    { href: `/${locale}/account`, label: locale === 'fr' ? 'Tableau de bord' : 'Dashboard' },
    { href: `/${locale}/account/profile`, label: locale === 'fr' ? 'Profil' : 'Profile' },
  ]

  return (
    <section className="py-12 lg:py-20">
      <Container>
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-56 flex-shrink-0">
            <h2 className="font-heading text-xl font-semibold mb-6">
              {locale === 'fr' ? 'Mon compte' : 'My Account'}
            </h2>
            <nav className="flex lg:flex-col gap-2">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted hover:text-foreground transition-colors py-1"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </Container>
    </section>
  )
}
