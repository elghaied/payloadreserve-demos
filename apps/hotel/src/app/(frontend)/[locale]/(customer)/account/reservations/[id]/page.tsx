import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import config from '@/payload.config'
import { Card } from '@/components/ui/card'
import { Ornament } from '@/components/Ornament'

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
  if (!user || (user as { collection?: string }).collection !== 'customers') return null

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

  const roomType = typeof reservation.service === 'object' ? reservation.service : null
  const status = reservation.status || 'pending'
  const canCancel =
    ['pending', 'confirmed'].includes(status) &&
    new Date(reservation.startTime).getTime() - Date.now() > 48 * 60 * 60 * 1000

  const nights = reservation.endTime
    ? Math.ceil(
        (new Date(reservation.endTime).getTime() - new Date(reservation.startTime).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0

  const statusColors: Record<string, string> = {
    confirmed: 'bg-success/10 text-success border-success/20',
    cancelled: 'bg-error/10 text-error border-error/20',
    completed: 'bg-primary/10 text-primary border-primary/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
    'no-show': 'bg-error/10 text-error border-error/20',
  }

  return (
    <div className="max-w-lg">
      {/* Back link */}
      <Link
        href={`/${locale}/account`}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('dashboard')}
      </Link>

      <Ornament variant="line" className="mb-6 justify-start" />
      <h1 className="font-heading text-2xl font-bold mb-8">
        {locale === 'fr' ? 'Details de la reservation' : 'Reservation Details'}
      </h1>

      <Card className="p-6">
        <div className="space-y-5">
          {/* Status */}
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <span className="text-xs tracking-wider uppercase text-muted font-medium">
              {locale === 'fr' ? 'Statut' : 'Status'}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${statusColors[status] || statusColors.pending}`}>
              {t(`status.${status}`)}
            </span>
          </div>

          {/* Room type */}
          {roomType && (
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-xs tracking-wider uppercase text-muted font-medium">
                {locale === 'fr' ? 'Chambre' : 'Room'}
              </span>
              <span className="text-sm font-heading font-bold">{roomType.name}</span>
            </div>
          )}

          {/* Check-in */}
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <span className="text-xs tracking-wider uppercase text-muted font-medium">
              {locale === 'fr' ? 'Arrivee' : 'Check-in'}
            </span>
            <span className="text-sm font-medium">
              {new Date(reservation.startTime).toLocaleDateString(locale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Check-out */}
          {reservation.endTime && (
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-xs tracking-wider uppercase text-muted font-medium">
                {locale === 'fr' ? 'Depart' : 'Check-out'}
              </span>
              <span className="text-sm font-medium">
                {new Date(reservation.endTime).toLocaleDateString(locale, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          {/* Duration */}
          {nights > 0 && (
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-xs tracking-wider uppercase text-muted font-medium">
                {locale === 'fr' ? 'Duree' : 'Duration'}
              </span>
              <span className="text-sm font-medium">
                {nights} {locale === 'fr' ? 'nuits' : 'nights'}
              </span>
            </div>
          )}

          {/* Total */}
          {roomType && nights > 0 && (
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-xs tracking-wider uppercase text-muted font-medium">Total</span>
              <span className="text-lg font-heading font-bold text-gradient-copper">
                ${(roomType.price ?? 0) * nights}
              </span>
            </div>
          )}

          {/* Guest count */}
          {reservation.guestCount && (
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-xs tracking-wider uppercase text-muted font-medium">
                {locale === 'fr' ? 'Voyageurs' : 'Guests'}
              </span>
              <span className="text-sm font-medium">{reservation.guestCount}</span>
            </div>
          )}

          {/* Notes */}
          {reservation.notes && (
            <div className="pb-4 border-b border-border">
              <span className="text-xs tracking-wider uppercase text-muted font-medium block mb-2">
                {locale === 'fr' ? 'Demandes speciales' : 'Special Requests'}
              </span>
              <p className="text-sm text-foreground/80 leading-relaxed">{reservation.notes}</p>
            </div>
          )}

          {/* Cancellation reason */}
          {reservation.cancellationReason && (
            <div className="pb-4">
              <span className="text-xs tracking-wider uppercase text-muted font-medium block mb-2">
                {t('cancellationReason')}
              </span>
              <p className="text-sm text-foreground/80 leading-relaxed">{reservation.cancellationReason}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Too late to cancel notice */}
      {!canCancel && ['pending', 'confirmed'].includes(status) && (
        <Card className="mt-6 p-5 border-warning/20">
          <p className="font-heading font-bold text-sm text-warning mb-1">{t('tooLateToCancelTitle')}</p>
          <p className="text-xs text-muted leading-relaxed">{t('tooLateToCancel')}</p>
        </Card>
      )}
    </div>
  )
}
