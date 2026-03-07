import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import { ArrowRight, CalendarDays, Award } from 'lucide-react'

import config from '@/payload.config'
import { Card } from '@/components/ui/card'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AccountDashboard({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'account' })
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  if (!user || (user as { collection?: string }).collection !== 'customers') return null

  const now = new Date().toISOString()

  const upcoming = await payload.find({
    collection: 'reservations',
    where: {
      customer: { equals: user.id },
      startTime: { greater_than_equal: now },
      status: { in: ['pending', 'confirmed'] },
    },
    sort: 'startTime',
    depth: 2,
    limit: 10,
    overrideAccess: false,
    user,
  })

  const completed = await payload.find({
    collection: 'reservations',
    where: {
      customer: { equals: user.id },
      status: { equals: 'completed' },
    },
    limit: 0,
    overrideAccess: false,
    user,
  })

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <Card className="p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs tracking-wider uppercase text-muted mb-1">{t('totalStays')}</p>
            <p className="text-3xl font-heading font-bold">{completed.totalDocs}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <CalendarDays className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs tracking-wider uppercase text-muted mb-1">{t('nextStay')}</p>
            <p className="text-lg font-heading font-bold">
              {upcoming.docs.length > 0
                ? new Date(upcoming.docs[0].startTime).toLocaleDateString(locale, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                : '-'}
            </p>
          </div>
        </Card>
      </div>

      {/* Upcoming stays */}
      <h2 className="font-heading text-xl font-bold mb-5 flex items-center gap-3">
        <span className="inline-block w-4 h-px bg-primary" />
        {t('upcoming')}
      </h2>

      {upcoming.docs.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted text-sm mb-4">{t('noUpcoming')}</p>
          <Link
            href={`/${locale}/book`}
            className="text-primary text-sm hover:text-primary-light transition-colors inline-flex items-center gap-1"
          >
            {locale === 'fr' ? 'Reserver maintenant' : 'Book now'}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {upcoming.docs.map((res) => {
            const nights = res.endTime
              ? Math.ceil(
                  (new Date(res.endTime).getTime() - new Date(res.startTime).getTime()) /
                    (1000 * 60 * 60 * 24),
                )
              : 0
            return (
              <Link
                key={res.id}
                href={`/${locale}/account/reservations/${res.id}`}
                className="block"
              >
                <Card className="p-5 flex items-center justify-between hover:border-primary/30 transition-all">
                  <div>
                    <p className="font-heading font-bold text-base mb-1">
                      {typeof res.service === 'object' ? res.service.name : 'Room'}
                    </p>
                    <p className="text-sm text-muted">
                      {new Date(res.startTime).toLocaleDateString(locale, {
                        month: 'short',
                        day: 'numeric',
                      })}
                      {' — '}
                      {res.endTime &&
                        new Date(res.endTime).toLocaleDateString(locale, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      {nights > 0 &&
                        ` (${nights} ${locale === 'fr' ? 'nuits' : 'nights'})`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                        res.status === 'confirmed'
                          ? 'bg-success/10 text-success border border-success/20'
                          : 'bg-warning/10 text-warning border border-warning/20'
                      }`}
                    >
                      {t(`status.${res.status}`)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
