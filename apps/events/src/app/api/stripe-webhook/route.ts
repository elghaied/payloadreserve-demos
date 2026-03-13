import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  try {
    const stripeClient = new Stripe(stripeKey)

    const event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as { metadata?: Record<string, string> }
      const bookingId = session.metadata?.reservationId

      if (bookingId) {
        const payload = await getPayload({ config })

        // Idempotency guard — skip if already confirmed (handles Stripe retries)
        const existing = await payload.findByID({
          collection: 'bookings',
          id: bookingId,
          depth: 0,
        })
        if (existing?.status === 'confirmed') {
          return NextResponse.json({ received: true })
        }

        await payload.update({
          collection: 'bookings',
          id: bookingId,
          data: { status: 'confirmed' },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Stripe webhook error:', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
