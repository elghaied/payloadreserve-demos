import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

import { Container } from '@/components/Container'
import ResetPasswordForm from '@/components/ResetPasswordForm'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { token } = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'auth' })

  return (
    <section className="py-16 lg:py-24">
      <Container className="max-w-md">
        <h1 className="font-heading text-3xl font-semibold text-center mb-8">
          {t('resetPassword')}
        </h1>

        <div className="glass p-8">
          <ResetPasswordForm token={token ?? null} locale={locale} />
        </div>
      </Container>
    </section>
  )
}
