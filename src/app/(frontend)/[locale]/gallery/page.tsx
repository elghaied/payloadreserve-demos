import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Container } from '@/components/Container'

type Props = { params: Promise<{ locale: string }> }

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'gallery' })
  const payload = await getPayload({ config })

  const gallery = await payload.find({
    collection: 'gallery',
    limit: 50,
    locale: locale as 'en' | 'fr',
    sort: '-createdAt',
    depth: 1,
  })

  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl lg:text-5xl font-semibold mb-4">{t('title')}</h1>
          <p className="text-muted max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {gallery.docs.map((item) => (
            <div key={item.id} className="break-inside-avoid overflow-hidden group">
              {typeof item.image === 'object' && item.image?.url && (
                <div className="relative">
                  <Image
                    src={item.image.url}
                    alt={item.caption || ''}
                    width={item.image.width || 600}
                    height={item.image.height || 400}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.caption && (
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-end">
                      <p className="text-white text-sm p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {gallery.docs.length === 0 && (
          <p className="text-center text-muted">{locale === 'fr' ? 'Galerie bientôt disponible.' : 'Gallery coming soon.'}</p>
        )}
      </Container>
    </section>
  )
}
