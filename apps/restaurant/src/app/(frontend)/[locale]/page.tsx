import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'hero' })

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-heading text-foreground mb-4">{t('defaultTitle')}</h1>
        <p className="text-xl text-muted">{t('defaultSubtitle')}</p>
      </div>
    </div>
  )
}
