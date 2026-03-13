import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ColorStripe } from './Header'
import type { SiteSetting } from '@/payload-types'

export async function Footer({ locale, settings }: { locale: string; settings: SiteSetting }) {
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
              {settings.venueName}
            </h3>
            {settings.address && (
              <p className="mb-1 text-sm text-muted-text">{settings.address}</p>
            )}
            {settings.phone && (
              <p className="mb-1 text-sm text-muted-text">{settings.phone}</p>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="text-sm text-muted-text underline hover:text-black">
                {settings.email}
              </a>
            )}
          </div>

          {/* Column 2: Box Office Hours */}
          <div>
            <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[3px]">
              {t('boxOffice')}
            </h3>
            {settings.boxOfficeHours?.map((entry) => (
              <div key={entry.day} className="flex justify-between border-b border-muted-light py-1.5 text-sm">
                <span className="font-mono text-[10px] uppercase tracking-[2px]">
                  {tDays(entry.day as 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')}
                </span>
                <span className="text-muted-text">
                  {entry.closed ? t('closed') : `${entry.open} — ${entry.close}`}
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
              {settings.socialLinks?.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] uppercase tracking-[2px] text-muted-text transition-colors hover:text-black"
                >
                  {link.platform}
                </a>
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
        <div className="border-t border-muted-light px-6 py-4 lg:px-12">
          <p className="font-mono text-[9px] uppercase tracking-[2px] text-muted-text">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
