import { setRequestLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import config from '@payload-config'
import { AccountSidebar } from '@/components/account/AccountSidebar'

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

  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex-shrink-0 lg:w-48">
          <AccountSidebar locale={locale} />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </section>
  )
}
