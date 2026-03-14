import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { getReservations } from './actions'

type Props = {
  params: Promise<{ locale: string }>
}

function statusVariant(status: string): 'default' | 'gold' | 'surface' | 'destructive' | 'outline' {
  switch (status) {
    case 'confirmed':
      return 'default'
    case 'pending':
      return 'gold'
    case 'completed':
      return 'surface'
    case 'cancelled':
    case 'no-show':
      return 'destructive'
    default:
      return 'outline'
  }
}

export default async function AccountDashboard({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'account' })

  const [upcoming, past] = await Promise.all([
    getReservations('upcoming'),
    getReservations('past'),
  ])

  const totalVisits = past.filter((r) => r.status === 'completed').length

  const nextReservation = upcoming.length > 0 ? upcoming[0] : null
  const nextReservationFormatted = nextReservation
    ? new Date(nextReservation.startTime).toLocaleDateString(locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="glass p-6">
          <p className="text-sm text-muted mb-1">{t('totalVisits')}</p>
          <p className="text-3xl font-heading font-semibold">{totalVisits}</p>
        </div>
        <div className="glass p-6">
          <p className="text-sm text-muted mb-1">{t('nextReservation')}</p>
          <p className="text-lg font-heading font-semibold">{nextReservationFormatted}</p>
        </div>
      </div>

      {/* Upcoming reservations */}
      <h2 className="font-heading text-xl font-semibold mb-4">{t('upcoming')}</h2>
      {upcoming.length === 0 ? (
        <p className="text-muted text-sm mb-10">{t('noUpcoming')}</p>
      ) : (
        <div className="space-y-3 mb-10">
          {upcoming.map((res) => (
            <Link
              key={res.id}
              href={`/${locale}/account/reservations/${res.id}`}
              className="flex items-center justify-between glass p-4 hover:bg-surface/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {typeof res.service === 'object' ? res.service.name : 'Dining Experience'}
                </p>
                <p className="text-sm text-muted mt-0.5">
                  {typeof res.resource === 'object' ? res.resource.name : ''}{' '}
                  {typeof res.resource === 'object' && <span>&middot;</span>}{' '}
                  {new Date(res.startTime).toLocaleDateString(locale, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  {new Date(res.startTime).toLocaleTimeString(locale, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {res.partySize && (
                    <span>
                      {' '}&middot; {res.partySize} {res.partySize === 1 ? 'guest' : 'guests'}
                    </span>
                  )}
                </p>
              </div>
              <Badge variant={statusVariant(res.status || 'pending')} className="ml-3 shrink-0">
                {t(`status.${res.status || 'pending'}`)}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Past reservations */}
      <h2 className="font-heading text-xl font-semibold mb-4">{t('past')}</h2>
      {past.length === 0 ? (
        <p className="text-muted text-sm">{t('noPast')}</p>
      ) : (
        <div className="space-y-3">
          {past.map((res) => (
            <Link
              key={res.id}
              href={`/${locale}/account/reservations/${res.id}`}
              className="flex items-center justify-between glass p-4 hover:bg-surface/50 transition-colors opacity-75 hover:opacity-100"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {typeof res.service === 'object' ? res.service.name : 'Dining Experience'}
                </p>
                <p className="text-sm text-muted mt-0.5">
                  {new Date(res.startTime).toLocaleDateString(locale, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {res.partySize && (
                    <span>
                      {' '}&middot; {res.partySize} {res.partySize === 1 ? 'guest' : 'guests'}
                    </span>
                  )}
                </p>
              </div>
              <Badge variant={statusVariant(res.status || 'completed')} className="ml-3 shrink-0">
                {t(`status.${res.status || 'completed'}`)}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
