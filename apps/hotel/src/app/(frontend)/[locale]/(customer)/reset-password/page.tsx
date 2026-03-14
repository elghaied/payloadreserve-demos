import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

import { Container } from '@/components/Container'
import { Ornament } from '@/components/Ornament'
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
    <section className="min-h-[80vh] flex items-center py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 via-background to-background" />
      <div className="absolute inset-0 noise pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[150px]" />
      </div>

      <Container className="relative z-10 max-w-md w-full">
        <div className="text-center mb-10">
          <Ornament className="mb-6" />
          <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-3">
            {t('resetPassword')}
          </h1>
        </div>

        <div className="glass-strong rounded-xl p-8">
          <ResetPasswordForm token={token ?? null} locale={locale} />
        </div>
      </Container>
    </section>
  )
}
