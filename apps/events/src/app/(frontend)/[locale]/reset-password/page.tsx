import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import ResetPasswordForm from '@/components/account/ResetPasswordForm'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { token } = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'account' })

  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-4xl font-black uppercase tracking-[-1px]">
          {t('resetPassword')}
        </h1>
        <div className="mb-10 h-[3px] w-16 bg-black" />
        <ResetPasswordForm token={token ?? null} locale={locale} />
      </div>
    </section>
  )
}
