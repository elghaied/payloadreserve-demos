import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import config from '@/payload.config'
import { Badge } from '@/components/ui/badge'
import { CancelButton } from './CancelButton'
import { CompletePaymentButton } from './CompletePaymentButton'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

function statusVariant(
  status: string,
): 'default' | 'gold' | 'surface' | 'destructive' | 'outline' {
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

export default async function ReservationDetailPage({ params }: Props) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'account' })
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  if (!user) return null

  let reservation
  try {
    reservation = await payload.findByID({
      collection: 'reservations',
      id,
      depth: 2,
      overrideAccess: false,
      user,
    })
  } catch {
    notFound()
  }

  const service = typeof reservation.service === 'object' ? reservation.service : null
  const table = typeof reservation.resource === 'object' ? reservation.resource : null
  const status = reservation.status || 'pending'

  // Can cancel if pending/confirmed AND more than 4 hours away
  const canCancel =
    ['pending', 'confirmed'].includes(status) &&
    new Date(reservation.startTime).getTime() - Date.now() > 4 * 60 * 60 * 1000

  return (
    <div className="max-w-lg">
      <Link
        href={`/${locale}/account`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {locale === 'fr' ? 'Retour' : 'Back'}
      </Link>

      <h1 className="font-heading text-2xl font-semibold mb-6">
        {locale === 'fr' ? 'Détails de la Réservation' : 'Reservation Details'}
      </h1>

      <div className="glass p-6 space-y-4 mb-6">
        {/* Status */}
        <div className="flex justify-between items-center pb-3 border-b border-border/50">
          <span className="text-muted text-sm">{locale === 'fr' ? 'Statut' : 'Status'}</span>
          <Badge variant={statusVariant(status)}>
            {t(`status.${status}`)}
          </Badge>
        </div>

        {/* Dining experience */}
        {service && (
          <div className="flex justify-between items-center pb-3 border-b border-border/50">
            <span className="text-muted text-sm">
              {locale === 'fr' ? 'Expérience' : 'Experience'}
            </span>
            <span className="text-sm font-medium text-right max-w-[60%]">{service.name}</span>
          </div>
        )}

        {/* Table */}
        {table && (
          <div className="flex justify-between items-center pb-3 border-b border-border/50">
            <span className="text-muted text-sm">
              {locale === 'fr' ? 'Table' : 'Table'}
            </span>
            <span className="text-sm font-medium">{table.name}</span>
          </div>
        )}

        {/* Date */}
        <div className="flex justify-between items-center pb-3 border-b border-border/50">
          <span className="text-muted text-sm">{locale === 'fr' ? 'Date' : 'Date'}</span>
          <span className="text-sm font-medium">
            {new Date(reservation.startTime).toLocaleDateString(locale, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        {/* Time */}
        <div className="flex justify-between items-center pb-3 border-b border-border/50">
          <span className="text-muted text-sm">{locale === 'fr' ? 'Heure' : 'Time'}</span>
          <span className="text-sm font-medium">
            {new Date(reservation.startTime).toLocaleTimeString(locale, {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {reservation.endTime && (
              <>
                {' — '}
                {new Date(reservation.endTime).toLocaleTimeString(locale, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </>
            )}
          </span>
        </div>

        {/* Party size */}
        {reservation.partySize && (
          <div className="flex justify-between items-center pb-3 border-b border-border/50">
            <span className="text-muted text-sm">
              {locale === 'fr' ? 'Couverts' : 'Party Size'}
            </span>
            <span className="text-sm font-medium">
              {reservation.partySize}{' '}
              {reservation.partySize === 1
                ? locale === 'fr'
                  ? 'couvert'
                  : 'guest'
                : locale === 'fr'
                  ? 'couverts'
                  : 'guests'}
            </span>
          </div>
        )}

        {/* Price */}
        {service && service.price && (
          <div className="flex justify-between items-center pb-3 border-b border-border/50">
            <span className="text-muted text-sm">{locale === 'fr' ? 'Prix' : 'Price'}</span>
            <span className="text-sm font-medium text-primary">€{service.price}</span>
          </div>
        )}

        {/* Notes */}
        {reservation.notes && (
          <div className="pb-3 border-b border-border/50">
            <span className="text-muted text-sm block mb-1">
              {locale === 'fr' ? 'Demandes spéciales' : 'Special Requests'}
            </span>
            <p className="text-sm">{reservation.notes}</p>
          </div>
        )}

        {/* Cancellation reason */}
        {reservation.cancellationReason && (
          <div className="pb-3 border-b border-border/50">
            <span className="text-muted text-sm block mb-1">{t('cancellationReason')}</span>
            <p className="text-sm">{reservation.cancellationReason}</p>
          </div>
        )}
      </div>

      {/* Pending payment notice */}
      {status === 'pending' && (
        <div className="bg-gold/10 border border-gold/30 p-4 rounded-lg text-sm mb-4">
          <p className="font-medium">{t('completePayment')}</p>
          <p className="text-muted mt-1">{t('completePaymentDesc')}</p>
        </div>
      )}

      {/* Complete payment button */}
      {status === 'pending' && (
        <div className="mb-4">
          <CompletePaymentButton reservationId={reservation.id} locale={locale} />
        </div>
      )}

      {/* Cancel button */}
      {canCancel && (
        <div className="mb-4">
          <CancelButton reservationId={reservation.id} locale={locale} />
        </div>
      )}

      {/* Too late to cancel notice */}
      {!canCancel && ['pending', 'confirmed'].includes(status) && (
        <div className="bg-warning/10 border border-warning/30 p-4 rounded-lg text-sm">
          <p className="font-medium">{t('tooLateToCancelTitle')}</p>
          <p className="text-muted mt-1">{t('tooLateToCancel')}</p>
        </div>
      )}
    </div>
  )
}
