import { setRequestLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import config from '@payload-config'

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

  return <>{children}</>
}
