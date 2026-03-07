import { NextRequest, NextResponse } from 'next/server'
import type { DemoType } from '@payload-reserve-demos/types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyTurnstile } from '@/lib/turnstile'
import { getInfraSettings } from '@/lib/infra-settings'
import { provisionAndDeploy } from '@/lib/provision-demo'
import { estimateAvailability } from '@/lib/estimate-availability'

const DEMO_TYPES: DemoType[] = ['salon', 'hotel', 'restaurant', 'events']

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; demoType?: string; turnstileToken?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { turnstileToken } = body
  const name = (body.name ?? '').trim()
  const email = (body.email ?? '').trim().toLowerCase()
  const demoType = body.demoType

  if (!name || !email || !demoType) {
    return NextResponse.json({ error: 'name, email, and demoType are required' }, { status: 400 })
  }
  if (name.length > 100) {
    return NextResponse.json({ error: 'Name must be 100 characters or fewer' }, { status: 400 })
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }
  if (!DEMO_TYPES.includes(demoType as DemoType)) {
    return NextResponse.json({ error: 'Invalid demoType' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const settings = await getInfraSettings(payload)

  const token = turnstileToken ?? ''
  const turnstileOk = await verifyTurnstile(token, settings)
  if (!turnstileOk) {
    return NextResponse.json({ error: 'Turnstile verification failed' }, { status: 400 })
  }

  const requestIp =
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'

  // Rate limit: block if IP or email has a pending, provisioning, or active demo
  const existingInstance = await payload.find({
    collection: 'demo-instances',
    where: {
      status: { in: ['provisioning', 'ready'] },
      or: [
        { requestIp: { equals: requestIp } },
        { adminEmail: { equals: email } },
      ],
    },
    limit: 1,
  })
  const existingPending = await payload.find({
    collection: 'demo-requests',
    where: {
      status: { equals: 'pending' },
      or: [
        { requestIp: { equals: requestIp } },
        { email: { equals: email } },
      ],
    },
    limit: 1,
  })
  if (existingInstance.totalDocs > 0 || existingPending.totalDocs > 0) {
    return NextResponse.json(
      { error: "You already have a demo request in progress. You'll receive an email when it's ready." },
      { status: 429 },
    )
  }

  // Capacity check
  const maxActive = settings.maxActiveDemos || 20
  const activeCount = await payload.count({
    collection: 'demo-instances',
    where: {
      status: { in: ['provisioning', 'ready'] },
    },
  })

  if (activeCount.totalDocs < maxActive) {
    // --- IMMEDIATE PROVISIONING ---
    const demoRequest = await payload.create({
      collection: 'demo-requests',
      data: { name, email, demoType: demoType as DemoType, requestIp, status: 'submitted' },
    })

    try {
      const result = await provisionAndDeploy({
        email, demoType: demoType as DemoType, requestIp,
        demoRequestId: demoRequest.id, payload, settings,
      })
      return NextResponse.json({ demoId: result.demoId, statusToken: result.statusToken }, { status: 202 })
    } catch {
      return NextResponse.json({ error: 'Failed to provision demo container' }, { status: 500 })
    }
  }

  // --- QUEUE ---
  await payload.create({
    collection: 'demo-requests',
    data: { name, email, demoType: demoType as DemoType, requestIp, status: 'pending' },
  })

  const estimated = await estimateAvailability(payload, settings)

  return NextResponse.json(
    {
      queued: true,
      estimatedAvailability: estimated.toISOString(),
      message: "Your demo request has been registered. You'll receive an email with credentials when it's ready.",
    },
    { status: 202 },
  )
}
