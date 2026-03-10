import type { PayloadRequest } from 'payload'
import { confirmationEmail } from '@/email/templates/confirmation'
import { cancellationEmail } from '@/email/templates/cancellation'

type ReservationHookArgs = {
  doc: Record<string, unknown>
  req: PayloadRequest
}

async function sendReservationEmail(
  emailType: 'confirmation' | 'cancellation',
  args: ReservationHookArgs,
) {
  const { doc, req } = args
  const payload = req.payload
  const locale = (req.locale as string) || 'en'

  try {
    const reservation = await payload.findByID({
      collection: 'reservations',
      id: doc.id as string,
      depth: 1,
      req,
    })

    const service = reservation.service as unknown as Record<string, unknown> | undefined
    const resource = reservation.resource as unknown as Record<string, unknown> | undefined
    const customer = reservation.customer as unknown as Record<string, unknown> | undefined

    if (!customer?.email) {
      payload.logger.warn(`No customer email for reservation ${doc.id}`)
      return
    }

    const startTime = new Date(reservation.startTime as string)
    const dateStr = startTime.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const timeStr = startTime.toLocaleTimeString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const customerName = customer.firstName
      ? `${customer.firstName}${customer.lastName ? ' ' + customer.lastName : ''}`
      : (customer.email as string) ?? 'Guest'

    const emailData = {
      customerName,
      experienceName: (service?.name as string) || 'Dining Experience',
      tableName: (resource?.name as string) || 'Table',
      date: dateStr,
      time: timeStr,
      partySize: (reservation as unknown as Record<string, unknown>).partySize as number | undefined,
      locale,
    }

    const email =
      emailType === 'confirmation'
        ? confirmationEmail(emailData)
        : cancellationEmail(emailData)

    await payload.sendEmail({
      to: customer.email as string,
      subject: email.subject,
      html: email.html,
    })

    payload.logger.info(
      `Sent ${emailType} email for reservation ${doc.id} to ${customer.email}`,
    )
  } catch (error) {
    payload.logger.error(
      `Failed to send ${emailType} email for reservation ${doc.id}: ${error}`,
    )
  }
}

export async function notifyAfterConfirm(args: ReservationHookArgs) {
  await sendReservationEmail('confirmation', args)
}

export async function notifyAfterCancel(args: ReservationHookArgs) {
  await sendReservationEmail('cancellation', args)
}
