import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'

import config from '@/payload.config'

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-border p-6">
          <p className="text-sm text-muted mb-1">{t('totalVisits')}</p>
          <p className="text-3xl font-heading font-semibold">{completed.totalDocs}</p>
        </div>
        <div className="border border-border p-6">
          <p className="text-sm text-muted mb-1">{t('nextAppointment')}</p>
          <p className="text-lg font-heading font-semibold">
            {upcoming.docs.length > 0
              ? new Date(upcoming.docs[0].startTime).toLocaleDateString(locale, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '—'}
          </p>
        </div>
      </div>

      {/* Upcoming */}
      <h2 className="font-heading text-xl font-semibold mb-4">{t('upcoming')}</h2>
      {upcoming.docs.length === 0 ? (
        <p className="text-muted text-sm mb-10">{t('noUpcoming')}</p>
      ) : (
        <div className="space-y-3 mb-10">
          {upcoming.docs.map((res) => (
            <Link
              key={res.id}
              href={`/${locale}/account/reservations/${res.id}`}
              className="flex items-center justify-between border border-border p-4 hover:shadow-sm transition-shadow"
            >
              <div>
                <p className="font-medium">
                  {typeof res.service === 'object' ? res.service.name : 'Service'}
                </p>
                <p className="text-sm text-muted">
                  {typeof res.resource === 'object' ? res.resource.name : ''} &middot;{' '}
                  {new Date(res.startTime).toLocaleDateString(locale, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  {new Date(res.startTime).toLocaleTimeString(locale, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 ${
                  res.status === 'confirmed'
                    ? 'bg-success/10 text-success'
                    : 'bg-warning/10 text-warning'
                }`}
              >
                {t(`status.${res.status}`)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
