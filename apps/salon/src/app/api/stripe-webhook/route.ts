import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { rateLimit } from '@/lib/rate-limit'

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

    const webhookIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { success } = rateLimit(`webhook:${webhookIp}`, 60, 60_000)
    if (!success) {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as { metadata?: Record<string, string> }
      const reservationId = session.metadata?.reservationId

      if (reservationId) {
        const payload = await getPayload({ config })

        // Idempotency guard — skip if already confirmed (handles Stripe retries)
        const existing = await payload.findByID({
          collection: 'reservations',
          id: reservationId,
          depth: 0,
        })
        if (existing?.status === 'confirmed') {
          return NextResponse.json({ received: true })
        }

        await payload.update({
          collection: 'reservations',
          id: reservationId,
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
