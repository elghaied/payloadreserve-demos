import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { ProfileForm } from '@/components/account/ProfileForm'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'profile' })
  return { title: t('title') }
}

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ProfileForm locale={locale} />
}
