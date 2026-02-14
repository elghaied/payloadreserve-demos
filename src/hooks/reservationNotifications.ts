import type { CollectionAfterChangeHook } from 'payload'
import type { Reservation, Service, Specialist, User } from '@/payload-types'

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

/**
 * afterChange hook for the reservations collection.
 *
 * - On create: sends a "booking received" confirmation email
 * - On status change to 'confirmed': sends a confirmation email
 * - On status change to 'cancelled': sends a cancellation email
 *
 * Respects `context.skipReservationHooks` to allow seed scripts to skip sending.
 */
export const reservationNotificationHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
  context,
}) => {
  // Allow seed scripts and other programmatic callers to skip email sending
  if (context?.skipReservationHooks) {
    return doc
  }

  const reservation = doc as Reservation

  // Determine if we need to send an email and which type
  let emailType: 'booking_received' | 'confirmed' | 'cancelled' | null = null

  if (operation === 'create') {
    emailType = 'booking_received'
  } else if (operation === 'update' && previousDoc) {
    const prevStatus = (previousDoc as Reservation).status
    const newStatus = reservation.status

    if (prevStatus !== 'confirmed' && newStatus === 'confirmed') {
      emailType = 'confirmed'
    } else if (prevStatus !== 'cancelled' && newStatus === 'cancelled') {
      emailType = 'cancelled'
    }
  }

  if (!emailType) {
    return doc
  }

  try {
    // Populate relationships to get full objects with names
    const populatedReservation = await req.payload.findByID({
      collection: 'reservations',
      id: reservation.id,
      depth: 1,
      req,
    })

    const service = populatedReservation.service as Service
    const specialist = populatedReservation.resource as Specialist
    const customer = populatedReservation.customer as User

    if (!customer?.email) {
      req.payload.logger.warn(
        `Reservation ${reservation.id}: cannot send ${emailType} email - customer has no email`,
      )
      return doc
    }

    const locale = getLocale(req)
    const { date, time } = formatDateTime(reservation.startTime, locale)

    const emailData = {
      customerName: customer.name || customer.email,
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
      // Both 'booking_received' and 'confirmed' use the confirmation template
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
    // Log the error but do not throw -- email failure should not block the reservation
    req.payload.logger.error(
      `Reservation ${reservation.id}: failed to send ${emailType} email: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  return doc
}
