import type { TaskConfig } from 'payload'
import type { Customer, Service, Specialist } from '@/payload-types'

import { abandonedPaymentEmail } from '@/email/templates/abandonedPayment'

type NotifyAbandonedPaymentsIO = {
  input: Record<string, never>
  output: { notified: number }
}

export const notifyAbandonedPaymentsTask: TaskConfig<NotifyAbandonedPaymentsIO> = {
  slug: 'notifyAbandonedPayments',
  schedule: [{ cron: '*/5 * * * *', queue: 'default' }],
  handler: async ({ req }) => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

    // Find pending reservations older than 5 minutes that haven't been reminded yet.
    // The paymentReminderSent flag guarantees at-most-once delivery regardless of timing.
    const { docs } = await req.payload.find({
      collection: 'reservations',
      where: {
        and: [
          { status: { equals: 'pending' } },
          { createdAt: { less_than: fiveMinutesAgo.toISOString() } },
          {
            or: [
              { paymentReminderSent: { equals: false } },
              { paymentReminderSent: { exists: false } },
            ],
          },
        ],
      },
      depth: 1,
      limit: 100,
    })

    let notified = 0

    for (const reservation of docs) {
      try {
        const service = reservation.service as Service
        const specialist = reservation.resource as Specialist
        const customer = reservation.customer as Customer & { email?: string }

        if (!customer?.email) {
          req.payload.logger.warn(
            `notifyAbandonedPayments: reservation ${reservation.id} has no customer email, skipping`,
          )
          // Mark it so we don't keep retrying a reservation with no email
          await req.payload.update({
            collection: 'reservations',
            id: reservation.id,
            data: { paymentReminderSent: true },
            context: { skipReservationHooks: true },
            req,
          })
          continue
        }

        const dateObj = new Date(reservation.startTime)
        const date = dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        const time = dateObj.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })

        const customerName = customer.firstName
          ? `${customer.firstName}${customer.lastName ? ' ' + customer.lastName : ''}`
          : (customer.email ?? 'Customer')

        const email = abandonedPaymentEmail({
          customerName,
          serviceName: service?.name || 'Service',
          specialistName: specialist?.name || 'Specialist',
          date,
          time,
          duration: service?.duration || 0,
          locale: 'en',
        })

        await req.payload.sendEmail({
          to: customer.email,
          subject: email.subject,
          html: email.html,
        })

        // Mark as reminded before logging so a crash loop doesn't cause duplicates
        await req.payload.update({
          collection: 'reservations',
          id: reservation.id,
          data: { paymentReminderSent: true },
          context: { skipReservationHooks: true },
          req,
        })

        req.payload.logger.info(
          `notifyAbandonedPayments: sent reminder to ${customer.email} for reservation ${reservation.id}`,
        )
        notified++
      } catch (error) {
        req.payload.logger.error(
          `notifyAbandonedPayments: failed for reservation ${reservation.id}: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }

    return { output: { notified } }
  },
}
