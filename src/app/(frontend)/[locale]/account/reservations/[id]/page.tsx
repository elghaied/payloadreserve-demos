import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import { notFound } from 'next/navigation'

import config from '@/payload.config'
import { CancelButton } from './CancelButton'

type Props = {
  params: Promise<{ locale: string; id: string }>
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
  const specialist = typeof reservation.resource === 'object' ? reservation.resource : null
  const status = reservation.status || 'pending'
  const canCancel =
    ['pending', 'confirmed'].includes(status) &&
    new Date(reservation.startTime).getTime() - Date.now() > 24 * 60 * 60 * 1000

  return (
    <div className="max-w-lg">
      <h1 className="font-heading text-2xl font-semibold mb-6">
        {locale === 'fr' ? 'Détails de la réservation' : 'Reservation Details'}
      </h1>

      <div className="space-y-4">
        <div className="flex justify-between border-b border-border pb-3">
          <span className="text-muted text-sm">{locale === 'fr' ? 'Statut' : 'Status'}</span>
          <span
            className={`text-sm font-medium px-2 py-0.5 ${
              status === 'confirmed'
                ? 'bg-success/10 text-success'
                : status === 'cancelled'
                  ? 'bg-error/10 text-error'
                  : status === 'completed'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-warning/10 text-warning'
            }`}
          >
            {t(`status.${status}`)}
          </span>
        </div>

        {service && (
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-muted text-sm">Service</span>
            <span className="text-sm font-medium">{service.name}</span>
          </div>
        )}

        {specialist && (
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-muted text-sm">{locale === 'fr' ? 'Spécialiste' : 'Specialist'}</span>
            <span className="text-sm font-medium">{specialist.name}</span>
          </div>
        )}

        <div className="flex justify-between border-b border-border pb-3">
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

        <div className="flex justify-between border-b border-border pb-3">
          <span className="text-muted text-sm">{locale === 'fr' ? 'Heure' : 'Time'}</span>
          <span className="text-sm font-medium">
            {new Date(reservation.startTime).toLocaleTimeString(locale, {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {reservation.endTime && <>{' — '}
            {new Date(reservation.endTime).toLocaleTimeString(locale, {
              hour: '2-digit',
              minute: '2-digit',
            })}</>}
          </span>
        </div>

        {service && (
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-muted text-sm">{locale === 'fr' ? 'Prix' : 'Price'}</span>
            <span className="text-sm font-medium text-primary">${service.price}</span>
          </div>
        )}

        {reservation.notes && (
          <div className="border-b border-border pb-3">
            <span className="text-muted text-sm block mb-1">Notes</span>
            <p className="text-sm">{reservation.notes}</p>
          </div>
        )}

        {reservation.cancellationReason && (
          <div className="border-b border-border pb-3">
            <span className="text-muted text-sm block mb-1">
              {t('cancellationReason')}
            </span>
            <p className="text-sm">{reservation.cancellationReason}</p>
          </div>
        )}
      </div>

      {canCancel && (
        <div className="mt-8">
          <CancelButton reservationId={reservation.id} locale={locale} />
        </div>
      )}

      {!canCancel && ['pending', 'confirmed'].includes(status) && (
        <div className="mt-8 bg-warning/10 border border-warning/30 p-4 text-sm">
          <p className="font-medium">{t('tooLateToCancelTitle')}</p>
          <p className="text-muted mt-1">{t('tooLateToCancel')}</p>
        </div>
      )}
    </div>
  )
}
