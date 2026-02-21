import type { PayloadRequest } from 'payload'
import type { Customer, Reservation, Service, Specialist } from '@/payload-types'

import { confirmationEmail } from '@/email/templates/confirmation'
import { cancellationEmail } from '@/email/templates/cancellation'

/**
 * Format a date string for display in emails.
 * Returns an object with separate date and time strings.
 */
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

/**
 * Determine the locale to use for the email.
 * Falls back to 'en' if the request locale is not 'en' or 'fr'.
 */
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
  const reservation = doc as unknown as Reservation
  try {
    const populatedReservation = await req.payload.findByID({
      collection: 'reservations',
      id: reservation.id,
      depth: 1,
    })

    const service = populatedReservation.service as Service
    const specialist = populatedReservation.resource as Specialist
    const customer = populatedReservation.customer as Customer & { email?: string }

    if (!customer?.email) {
      req.payload.logger.warn(
        `Reservation ${reservation.id}: cannot send ${emailType} email - customer has no email`,
      )
      return
    }

    const locale = getLocale(req)
    const { date, time } = formatDateTime(reservation.startTime, locale)

    const customerName = customer.firstName
      ? `${customer.firstName}${customer.lastName ? ' ' + customer.lastName : ''}`
      : (customer.email ?? 'Customer')

    const emailData = {
      customerName,
      serviceName: service?.name || 'Service',
      specialistName: specialist?.name || 'Specialist',
      date,
      time,
      duration: service?.duration || 0,
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

/**
 * Plugin hook callback: fires after a new booking is created.
 * Sends a "booking received" confirmation email.
 */
export async function notifyAfterCreate(args: PluginHookArgs): Promise<void> {
  await sendReservationEmail('booking_received', args)
}

/**
 * Plugin hook callback: fires after a booking is confirmed.
 * Sends a confirmation email.
 */
export async function notifyAfterConfirm(args: PluginHookArgs): Promise<void> {
  await sendReservationEmail('confirmed', args)
}

/**
 * Plugin hook callback: fires after a booking is cancelled.
 * Sends a cancellation email.
 */
export async function notifyAfterCancel(args: PluginHookArgs): Promise<void> {
  await sendReservationEmail('cancelled', args)
}
