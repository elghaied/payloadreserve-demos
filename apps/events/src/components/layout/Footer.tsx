import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { GShellBrand } from '@/components/GShellBrand'
import { ColorStripe } from './Header'

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'footer' })
  const tDays = await getTranslations({ locale, namespace: 'days' })

  return (
    <footer className="mt-auto">
      <ColorStripe />
      <div className="border-t-[3px] border-black">
        <div className="grid gap-8 px-6 py-12 md:grid-cols-3 lg:px-12">
          {/* Column 1: Contact */}
          <div>
            <h3 className="mb-4 text-lg font-black uppercase tracking-[-1px]">
              Éclat
            </h3>
            <p className="mb-1 text-sm text-muted-text">
              {locale === 'fr' ? '250 Rue Sainte-Catherine O' : '250 Sainte-Catherine St W'}
            </p>
            <p className="mb-1 text-sm text-muted-text">Montréal, QC H2X 1K9</p>
            <p className="mb-1 text-sm text-muted-text">(514) 555-0199</p>
            <a href="mailto:info@eclat-events.com" className="text-sm text-muted-text underline hover:text-black">
              info@eclat-events.com
            </a>
          </div>

          {/* Column 2: Box Office Hours */}
          <div>
            <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[3px]">
              {t('boxOffice')}
            </h3>
            {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((day) => (
              <div key={day} className="flex justify-between border-b border-muted-light py-1.5 text-sm">
                <span className="font-mono text-[10px] uppercase tracking-[2px]">
                  {tDays(day)}
                </span>
                <span className="text-muted-text">
                  {day === 'sun' ? t('closed') : day === 'sat' ? '10:00 — 18:00' : '11:00 — 19:00'}
                </span>
              </div>
            ))}
          </div>

          {/* Column 3: Social + Policies */}
          <div>
            <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[3px]">
              {t('followUs')}
            </h3>
            <div className="mb-6 flex gap-4">
              {['Instagram', 'Facebook', 'X'].map((platform) => (
                <span
                  key={platform}
                  className="font-mono text-[10px] uppercase tracking-[2px] text-muted-text transition-colors hover:text-black"
                >
                  {platform}
                </span>
              ))}
            </div>
            <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[3px]">
              {t('policies')}
            </h3>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-text">{t('bookingPolicy')}</span>
              <span className="text-sm text-muted-text">{t('cancellationPolicy')}</span>
              <span className="text-sm text-muted-text">{t('accessibility')}</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex items-center justify-between border-t border-muted-light px-6 py-4 lg:px-12">
          <p className="font-mono text-[9px] uppercase tracking-[2px] text-muted-text">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <GShellBrand prefix={t('madeBy')} />
        </div>
      </div>
    </footer>
  )
}
