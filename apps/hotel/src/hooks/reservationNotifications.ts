import type { PayloadRequest } from 'payload'

import { confirmationEmail } from '@/email/templates/confirmation'
import { cancellationEmail } from '@/email/templates/cancellation'

function formatDateTime(
  isoString: string,
  locale: 'en' | 'fr',
): { date: string; time: string } {
  const dateObj = new Date(isoString)
  const dateFormatted = dateObj.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const timeFormatted = dateObj.toLocaleTimeString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale === 'en',
  })
  return { date: dateFormatted, time: timeFormatted }
}

function getLocale(req: { locale?: string }): 'en' | 'fr' {
  if (req.locale === 'fr') return 'fr'
  return 'en'
}

type PluginHookArgs = {
  doc: Record<string, unknown>
  req: PayloadRequest
}

async function sendReservationEmail(
  emailType: 'booking_received' | 'confirmed' | 'cancelled',
  { doc, req }: PluginHookArgs,
): Promise<void> {
  const reservation = doc as Record<string, unknown> & { id: string; startTime: string; endTime?: string }
  try {
    const populatedReservation = await req.payload.findByID({
      collection: 'reservations',
      id: reservation.id,
      depth: 1,
    })

    const roomType = populatedReservation.service as { name?: string; duration?: number } | null
    const room = populatedReservation.resource as { name?: string } | null
    const customer = populatedReservation.customer as { email?: string; firstName?: string; lastName?: string } | null

    if (!customer?.email) {
      req.payload.logger.warn(
        `Reservation ${reservation.id}: cannot send ${emailType} email - customer has no email`,
      )
      return
    }

    const locale = getLocale(req)
    const checkIn = formatDateTime(reservation.startTime, locale)
    const checkOut = reservation.endTime ? formatDateTime(reservation.endTime, locale) : null

    const customerName = customer.firstName
      ? `${customer.firstName}${customer.lastName ? ' ' + customer.lastName : ''}`
      : (customer.email ?? 'Guest')

    const emailData = {
      customerName,
      serviceName: roomType?.name || 'Room',
      specialistName: room?.name || 'Room',
      date: checkIn.date,
      time: checkOut ? `${checkIn.date} — ${checkOut.date}` : checkIn.time,
      duration: roomType?.duration || 0,
      locale,
    }

    let email: { subject: string; html: string }

    if (emailType === 'cancelled') {
      email = cancellationEmail(emailData)
    } else {
      email = confirmationEmail(emailData)
    }

    await req.payload.sendEmail({
      to: customer.email,
      subject: email.subject,
      html: email.html,
    })

    req.payload.logger.info(
      `Reservation ${reservation.id}: sent ${emailType} email to ${customer.email}`,
    )
  } catch (error) {
    req.payload.logger.error(
      `Reservation ${reservation.id}: failed to send ${emailType} email: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function notifyAfterConfirm(args: PluginHookArgs): Promise<void> {
  await sendReservationEmail('confirmed', args)
}

export async function notifyAfterCancel(args: PluginHookArgs): Promise<void> {
  await sendReservationEmail('cancelled', args)
}
