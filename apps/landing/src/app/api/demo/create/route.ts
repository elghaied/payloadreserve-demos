import { NextRequest, NextResponse } from 'next/server'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8)
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { CoolifyClient } from '@payload-reserve-demos/coolify-sdk'
import type { Demo, DemoType } from '@payload-reserve-demos/types'
import { verifyTurnstile } from '@/lib/turnstile'
import { createDemo, countActiveDemos, findRecentDemosByIpOrEmail, updateDemoStatus } from '@/lib/demos'
import { mailer } from '@/lib/mailer'

const DEMO_TYPES: DemoType[] = ['salon', 'hotel', 'restaurant', 'events']

const DEMO_IMAGES: Record<DemoType, { name: string; tag: string }> = {
  salon:      { name: process.env.DOCKER_IMAGE_SALON_NAME      ?? '', tag: process.env.DOCKER_IMAGE_SALON_TAG      ?? 'latest' },
  hotel:      { name: process.env.DOCKER_IMAGE_HOTEL_NAME      ?? '', tag: process.env.DOCKER_IMAGE_HOTEL_TAG      ?? 'latest' },
  restaurant: { name: process.env.DOCKER_IMAGE_RESTAURANT_NAME ?? '', tag: process.env.DOCKER_IMAGE_RESTAURANT_TAG ?? 'latest' },
  events:     { name: process.env.DOCKER_IMAGE_EVENTS_NAME     ?? '', tag: process.env.DOCKER_IMAGE_EVENTS_TAG     ?? 'latest' },
}

const DEMO_SMTP_FROM_NAMES: Record<DemoType, string> = {
  salon:      'Lumière Salon',
  hotel:      'Grand Hotel',
  restaurant: 'Le Bistrot',
  events:     'EventSpace',
}

// TODO: Change DEMO_PROTOCOL to 'https' in production (set via env var on the Coolify service)
const demoProtocol = process.env.DEMO_PROTOCOL ?? 'https'

function getCoolify() {
  const url = process.env.COOLIFY_API_URL
  const key = process.env.COOLIFY_API_KEY
  if (!url || !key) return null
  return new CoolifyClient(url, key)
}

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; demoType?: string; turnstileToken?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, demoType, turnstileToken } = body

  // Validate input
  if (!name || !email || !demoType) {
    return NextResponse.json({ error: 'name, email, and demoType are required' }, { status: 400 })
  }
  if (!DEMO_TYPES.includes(demoType as DemoType)) {
    return NextResponse.json({ error: 'Invalid demoType' }, { status: 400 })
  }

  // Verify Turnstile
  const token = turnstileToken ?? ''
  const turnstileOk = await verifyTurnstile(token)
  if (!turnstileOk) {
    return NextResponse.json({ error: 'Turnstile verification failed' }, { status: 400 })
  }

  // Rate limit: max 1 demo per IP or email per 24h
  const requestIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const recent = await findRecentDemosByIpOrEmail(requestIp, email)
  if (recent > 0) {
    return NextResponse.json(
      { error: 'You already have a demo running. Please wait 24 hours before requesting another.' },
      { status: 429 },
    )
  }

  // Capacity check
  const maxActive = Number(process.env.MAX_ACTIVE_DEMOS ?? 20)
  const activeCount = await countActiveDemos()
  if (activeCount >= maxActive) {
    return NextResponse.json(
      { error: 'All demo slots are currently in use. Please try again later.' },
      { status: 503 },
    )
  }

  // Generate IDs and credentials — all per-demo, none stored in plaintext
  const demoId = nanoid(8)
  const adminPassword = crypto.randomBytes(12).toString('base64url')
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10)
  const payloadSecret = crypto.randomBytes(32).toString('hex')
  const demoSeedSecret = crypto.randomBytes(24).toString('hex') // injected into container + used by pollAndSeed
  const baseDomain = process.env.DEMO_BASE_DOMAIN ?? 'payloadreserve.com'
  const subdomain = `demo-${demoId}.${baseDomain}`
  const dbName = `payloadreserve-demo-${demoId}`
  const s3Prefix = `${demoType}/demo-${demoId}`
  const ttlHours = Number(process.env.DEMO_TTL_HOURS ?? 24)
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000)

  // Create Coolify service
  let coolifyServiceId = 'stub'
  const coolify = getCoolify()
  if (coolify) {
    const image = DEMO_IMAGES[demoType as DemoType]
    try {
      const service = await coolify.createService({
        name: `demo-${demoId}`,
        projectUuid: process.env.COOLIFY_PROJECT_UUID ?? '',
        serverUuid: process.env.COOLIFY_SERVER_UUID ?? '',
        destinationUuid: process.env.COOLIFY_DESTINATION_UUID ?? '',
        environmentName: 'production',
        dockerImageName: image.name,
        dockerImageTag: image.tag,
        ports: '3000',
        fqdn: `${demoProtocol}://${subdomain}`,
        envVars: [
          // Per-demo vars
          { key: 'DATABASE_URL', value: `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@${process.env.MONGO_HOST ?? 'mongodb'}/${dbName}?authSource=admin`, is_secret: true },
          { key: 'PAYLOAD_SECRET', value: payloadSecret, is_secret: true },
          { key: 'ADMIN_EMAIL', value: email },
          { key: 'ADMIN_PASSWORD', value: adminPassword, is_secret: true },
          { key: 'SEED_SECRET', value: demoSeedSecret, is_secret: true },
          { key: 'NEXT_PUBLIC_SERVER_URL', value: `${demoProtocol}://${subdomain}` },
          { key: 'S3_PREFIX', value: s3Prefix },
          { key: 'S3_BUCKET', value: `${demoType}-demo` },
          // Per-demo-type vars
          { key: 'SMTP_FROM_NAME', value: DEMO_SMTP_FROM_NAMES[demoType as DemoType] },
          // Shared vars — forwarded from landing app env (set via {{ project.* }} in Coolify)
          { key: 'S3_ACCESS_KEY', value: process.env.S3_ACCESS_KEY ?? '', is_secret: true },
          { key: 'S3_SECRET_KEY', value: process.env.S3_SECRET_KEY ?? '', is_secret: true },
          { key: 'S3_ENDPOINT', value: process.env.S3_ENDPOINT ?? '' },
          { key: 'S3_REGION', value: process.env.S3_REGION ?? 'us-east-1' },
          { key: 'S3_FORCE_PATH_STYLE', value: process.env.S3_FORCE_PATH_STYLE ?? 'true' },
          { key: 'SMTP_HOST', value: process.env.SMTP_HOST ?? '' },
          { key: 'SMTP_PORT', value: process.env.SMTP_PORT ?? '587' },
          { key: 'SMTP_USER', value: process.env.SMTP_USER ?? '' },
          { key: 'SMTP_PASS', value: process.env.SMTP_PASS ?? '', is_secret: true },
          { key: 'SMTP_FROM', value: process.env.SMTP_FROM ?? '' },
          { key: 'STRIPE_SECRET_KEY', value: process.env.STRIPE_SECRET_KEY ?? '', is_secret: true },
          { key: 'STRIPE_WEBHOOK_SECRET', value: process.env.STRIPE_WEBHOOK_SECRET ?? '', is_secret: true },
          { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '' },
        ],
      })
      coolifyServiceId = service.id
    } catch (err) {
      console.error('[demo/create] Coolify createService failed:', err)
      return NextResponse.json({ error: 'Failed to provision demo container' }, { status: 500 })
    }
  }

  // Persist demo record
  const demo: Demo = {
    demoId,
    type: demoType as DemoType,
    subdomain,
    dbName,
    s3Prefix,
    adminEmail: email,
    adminPasswordHash,
    coolifyServiceId,
    status: 'provisioning',
    createdAt: new Date(),
    expiresAt,
    requestIp,
  }
  await createDemo(demo)

  // Fire-and-forget: poll for health, seed, then notify
  void pollAndSeed({
    demoId,
    subdomain,
    email,
    adminPassword,
    demoType: demoType as DemoType,
    expiresAt,
    coolifyServiceId,
    coolify,
    demoSeedSecret,
  })

  return NextResponse.json({ demoId }, { status: 202 })
}

async function pollAndSeed(opts: {
  demoId: string
  subdomain: string
  email: string
  adminPassword: string
  demoType: DemoType
  expiresAt: Date
  coolifyServiceId: string
  coolify: CoolifyClient | null
  demoSeedSecret: string
}) {
  const { demoId, subdomain, email, adminPassword, demoType, expiresAt, coolify, coolifyServiceId, demoSeedSecret } =
    opts
  const demoUrl = `${demoProtocol}://${subdomain}`
  const seedSecret = demoSeedSecret
  const maxAttempts = 60
  const intervalMs = 10_000

  // Start the Coolify service if client is available
  if (coolify) {
    try {
      await coolify.startService(coolifyServiceId)
    } catch (err) {
      console.error(`[demo/${demoId}] startService failed:`, err)
    }
  }

  // Poll /api/health
  let healthy = false
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, intervalMs))
    try {
      const res = await fetch(`${demoUrl}/api/health`, { signal: AbortSignal.timeout(8_000) })
      if (res.ok) {
        healthy = true
        break
      }
    } catch {
      // container not up yet — continue polling
    }
  }

  if (!healthy) {
    console.error(`[demo/${demoId}] health check timed out`)
    await updateDemoStatus(demoId, 'failed')
    return
  }

  // Trigger seed
  try {
    const seedRes = await fetch(`${demoUrl}/api/seed`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${seedSecret}` },
      signal: AbortSignal.timeout(120_000),
    })
    if (!seedRes.ok) {
      const text = await seedRes.text()
      throw new Error(`seed returned ${seedRes.status}: ${text}`)
    }
  } catch (err) {
    console.error(`[demo/${demoId}] seed failed:`, err)
    await updateDemoStatus(demoId, 'failed')
    return
  }

  // Mark ready and send credentials
  await updateDemoStatus(demoId, 'ready')

  try {
    await mailer.sendDemoCredentials(email, {
      demoUrl,
      adminEmail: email,
      adminPassword,
      expiresAt,
      demoType,
    })
  } catch (err) {
    console.error(`[demo/${demoId}] email failed:`, err)
    // Non-fatal — demo is still ready
  }
}
