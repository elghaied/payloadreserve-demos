import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { AccountView } from '@/components/account/AccountView'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'account' })
  return { title: t('title') }
}

export default async function AccountPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <AccountView locale={locale} />
}
