import { NextRequest, NextResponse } from 'next/server'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16)
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import type { CoolifyClient } from '@payload-reserve-demos/coolify-sdk'
import type { DemoType } from '@payload-reserve-demos/types'
import type { InfrastructureSetting } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyTurnstile } from '@/lib/turnstile'
import { getCoolify } from '@/lib/cleanup-utils'
import { createMailer } from '@/lib/mailer'
import { getInfraSettings } from '@/lib/infra-settings'

const DEMO_TYPES: DemoType[] = ['salon', 'hotel', 'restaurant', 'events']

const DEMO_SMTP_FROM_NAMES: Record<DemoType, string> = {
  salon:      'Lumière Salon',
  hotel:      'Grand Hotel',
  restaurant: 'Le Bistrot',
  events:     'EventSpace',
}

function getDemoImage(settings: InfrastructureSetting, type: DemoType): { name: string; tag: string } {
  const imageMap = {
    salon: settings.salonImage,
    hotel: settings.hotelImage,
    restaurant: settings.restaurantImage,
    events: settings.eventsImage,
  }
  const imageGroup = imageMap[type]
  const envName = process.env[`DOCKER_IMAGE_${type.toUpperCase()}_NAME`] ?? ''
  const envTag = process.env[`DOCKER_IMAGE_${type.toUpperCase()}_TAG`] ?? 'latest'
  return {
    name: imageGroup?.name || envName,
    tag: imageGroup?.tag || envTag,
  }
}

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

  // Validate input
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

  // Verify Turnstile
  const token = turnstileToken ?? ''
  const turnstileOk = await verifyTurnstile(token, settings)
  if (!turnstileOk) {
    return NextResponse.json({ error: 'Turnstile verification failed' }, { status: 400 })
  }

  const requestIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  // Create demo request record
  const demoRequest = await payload.create({
    collection: 'demo-requests',
    data: {
      name,
      email,
      demoType: demoType as DemoType,
      requestIp,
      status: 'submitted',
    },
  })

  // Rate limit: max 1 demo per IP or email per 24h
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const recent = await payload.find({
    collection: 'demo-instances',
    where: {
      createdAt: { greater_than: since },
      or: [
        { requestIp: { equals: requestIp } },
        { adminEmail: { equals: email } },
      ],
    },
    limit: 0,
  })
  if (recent.totalDocs > 0) {
    await payload.update({
      collection: 'demo-requests',
      id: demoRequest.id,
      data: {
        status: 'rejected',
        rejectionReason: 'Rate limit: already have a demo running within 24 hours',
      },
    })
    return NextResponse.json(
      { error: 'You already have a demo running. Please wait 24 hours before requesting another.' },
      { status: 429 },
    )
  }

  // Capacity check
  const maxActive = settings.maxActiveDemos || Number(process.env.MAX_ACTIVE_DEMOS ?? 20)
  const activeCount = await payload.count({
    collection: 'demo-instances',
    where: {
      status: { in: ['provisioning', 'ready'] },
    },
  })
  if (activeCount.totalDocs >= maxActive) {
    await payload.update({
      collection: 'demo-requests',
      id: demoRequest.id,
      data: {
        status: 'rejected',
        rejectionReason: 'All demo slots are currently in use',
      },
    })
    return NextResponse.json(
      { error: 'All demo slots are currently in use. Please try again later.' },
      { status: 503 },
    )
  }

  // Generate IDs and credentials
  const demoId = nanoid()
  const adminPassword = crypto.randomBytes(12).toString('base64url')
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10)
  const payloadSecret = crypto.randomBytes(32).toString('hex')
  const demoSeedSecret = crypto.randomBytes(24).toString('hex')
  const statusToken = crypto.randomBytes(24).toString('base64url')
  const statusTokenHash = crypto.createHash('sha256').update(statusToken).digest('hex')
  const demoProtocol = settings.demoProtocol || process.env.DEMO_PROTOCOL || 'https'
  const baseDomain = settings.demoBaseDomain || process.env.DEMO_BASE_DOMAIN || 'payloadreserve.com'
  const subdomain = `demo-${demoId}.${baseDomain}`
  const dbName = `payloadreserve-demo-${demoId}`
  const s3Prefix = `${demoType}/demo-${demoId}`
  const ttlHours = settings.demoTtlHours || Number(process.env.DEMO_TTL_HOURS ?? 24)
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000)

  // Persist demo instance record
  const instance = await payload.create({
    collection: 'demo-instances',
    data: {
      demoId,
      type: demoType as DemoType,
      subdomain,
      dbName,
      s3Prefix,
      adminEmail: email,
      adminPasswordHash,
      statusTokenHash,
      coolifyServiceId: 'pending',
      status: 'provisioning',
      expiresAt: expiresAt.toISOString(),
      requestIp,
    },
  })

  // Link demo request to instance
  await payload.update({
    collection: 'demo-requests',
    id: demoRequest.id,
    data: {
      status: 'provisioning',
      demoInstance: instance.id,
    },
  })

  // Create Coolify service
  let coolifyServiceId = 'pending'
  const coolify = getCoolify(settings)
  console.log(`[demo/${demoId}] Coolify client: ${coolify ? 'ready' : 'MISSING — check COOLIFY_API_URL / COOLIFY_API_KEY'}`)
  if (coolify) {
    const image = getDemoImage(settings, demoType as DemoType)
    const mongoUser = encodeURIComponent(settings.mongoRootUsername || process.env.MONGO_ROOT_USERNAME || '')
    const mongoPass = encodeURIComponent(settings.mongoRootPassword || process.env.MONGO_ROOT_PASSWORD || '')
    const mongoHost = settings.mongoHost || process.env.MONGO_HOST || 'mongodb'
    console.log(`[demo/${demoId}] Creating Coolify service — image: ${image.name}:${image.tag}, fqdn: ${demoProtocol}://${subdomain}`)
    try {
      const service = await coolify.createService({
        name: `demo-${demoId}`,
        projectUuid: settings.coolifyProjectUuid || process.env.COOLIFY_PROJECT_UUID || '',
        serverUuid: settings.coolifyServerUuid || process.env.COOLIFY_SERVER_UUID || '',
        destinationUuid: settings.coolifyDestinationUuid || process.env.COOLIFY_DESTINATION_UUID || '',
        environmentName: 'production',
        dockerImageName: image.name,
        dockerImageTag: image.tag,
        ports: '3000',
        fqdn: `${demoProtocol}://${subdomain}`,
        envVars: [
          { key: 'DATABASE_URL', value: `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:27017/${dbName}?authSource=admin&directConnection=true`, is_secret: true },
          { key: 'PAYLOAD_SECRET', value: payloadSecret, is_secret: true },
          { key: 'ADMIN_EMAIL', value: email },
          { key: 'ADMIN_PASSWORD', value: adminPassword, is_secret: true },
          { key: 'SEED_SECRET', value: demoSeedSecret, is_secret: true },
          { key: 'NEXT_PUBLIC_SERVER_URL', value: `${demoProtocol}://${subdomain}` },
          { key: 'S3_PREFIX', value: s3Prefix },
          { key: 'S3_BUCKET', value: `${demoType}-demo` },
          { key: 'SMTP_FROM_NAME', value: DEMO_SMTP_FROM_NAMES[demoType as DemoType] },
          { key: 'S3_ACCESS_KEY', value: settings.s3AccessKey || process.env.S3_ACCESS_KEY || '', is_secret: true },
          { key: 'S3_SECRET_KEY', value: settings.s3SecretKey || process.env.S3_SECRET_KEY || '', is_secret: true },
          { key: 'S3_ENDPOINT', value: settings.s3Endpoint || process.env.S3_ENDPOINT || '' },
          { key: 'S3_REGION', value: settings.s3Region || process.env.S3_REGION || 'us-east-1' },
          { key: 'S3_FORCE_PATH_STYLE', value: String(settings.s3ForcePathStyle ?? (process.env.S3_FORCE_PATH_STYLE ?? 'true')) },
          { key: 'SMTP_HOST', value: settings.smtpHost || process.env.SMTP_HOST || '' },
          { key: 'SMTP_PORT', value: String(settings.smtpPort || process.env.SMTP_PORT || '587') },
          { key: 'SMTP_USER', value: settings.smtpUser || process.env.SMTP_USER || '' },
          { key: 'SMTP_PASS', value: settings.smtpPass || process.env.SMTP_PASS || '', is_secret: true },
          { key: 'SMTP_FROM', value: settings.smtpFrom || process.env.SMTP_FROM || '' },
          { key: 'STRIPE_SECRET_KEY', value: settings.stripeSecretKey || process.env.STRIPE_SECRET_KEY || '', is_secret: true },
          { key: 'STRIPE_WEBHOOK_SECRET', value: settings.stripeWebhookSecret || process.env.STRIPE_WEBHOOK_SECRET || '', is_secret: true },
          { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', value: settings.stripePublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '' },
        ],
      })
      coolifyServiceId = service.id
      console.log(`[demo/${demoId}] Coolify service created — uuid: ${coolifyServiceId}`)

      await payload.update({
        collection: 'demo-instances',
        id: instance.id,
        data: { coolifyServiceId },
      })
    } catch (err) {
      console.error(`[demo/${demoId}] Coolify createService failed:`, err)
      await payload.update({
        collection: 'demo-instances',
        id: instance.id,
        data: { status: 'failed' },
      })
      await payload.update({
        collection: 'demo-requests',
        id: demoRequest.id,
        data: { status: 'failed' },
      })
      return NextResponse.json({ error: 'Failed to provision demo container' }, { status: 500 })
    }
  }

  // Fire-and-forget: poll for health, seed, then notify
  void pollAndSeed({
    demoId,
    subdomain,
    demoProtocol,
    email,
    adminPassword,
    demoType: demoType as DemoType,
    expiresAt,
    coolifyServiceId,
    coolify,
    demoSeedSecret,
    payload,
    demoRequestId: demoRequest.id,
    settings,
  })

  return NextResponse.json({ demoId, statusToken }, { status: 202 })
}

async function pollAndSeed(opts: {
  demoId: string
  subdomain: string
  demoProtocol: string
  email: string
  adminPassword: string
  demoType: DemoType
  expiresAt: Date
  coolifyServiceId: string
  coolify: CoolifyClient | null
  demoSeedSecret: string
  payload: Awaited<ReturnType<typeof getPayload>>
  demoRequestId: string | number
  settings: InfrastructureSetting
}) {
  const {
    demoId, subdomain, demoProtocol, email, adminPassword, demoType, expiresAt,
    coolify, coolifyServiceId, demoSeedSecret, payload, demoRequestId, settings,
  } = opts
  const demoUrl = `${demoProtocol}://${subdomain}`
  const seedSecret = demoSeedSecret
  const maxAttempts = 60
  const intervalMs = 10_000

  // Start the Coolify service if client is available
  if (coolify) {
    try {
      console.log(`[demo/${demoId}] Starting Coolify service ${coolifyServiceId}…`)
      await coolify.startService(coolifyServiceId)
      console.log(`[demo/${demoId}] startService call succeeded`)
    } catch (err) {
      console.error(`[demo/${demoId}] startService failed:`, err)
    }
  } else {
    console.warn(`[demo/${demoId}] No Coolify client — skipping startService`)
  }

  // Poll /api/health
  let healthy = false
  console.log(`[demo/${demoId}] Polling ${demoUrl}/api/health (max ${maxAttempts} attempts, ${intervalMs}ms interval)…`)
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, intervalMs))

    if (coolify && i % 5 === 0) {
      try {
        const svcStatus = await coolify.getServiceStatus(coolifyServiceId)
        console.log(`[demo/${demoId}] Coolify container status: ${svcStatus}`)
        if (svcStatus === 'error') {
          console.error(`[demo/${demoId}] Coolify reports container error — aborting health poll`)
          break
        }
      } catch (err) {
        console.warn(`[demo/${demoId}] getServiceStatus failed:`, (err as Error).message)
      }
    }

    try {
      const res = await fetch(`${demoUrl}/api/health`, { signal: AbortSignal.timeout(8_000) })
      console.log(`[demo/${demoId}] health attempt ${i + 1}/${maxAttempts}: HTTP ${res.status}`)
      if (res.ok) {
        healthy = true
        break
      }
    } catch (err) {
      console.log(`[demo/${demoId}] health attempt ${i + 1}/${maxAttempts}: ${(err as Error).message}`)
    }
  }

  if (!healthy) {
    console.error(`[demo/${demoId}] health check timed out after ${maxAttempts} attempts`)
    await payload.update({
      collection: 'demo-instances',
      where: { demoId: { equals: demoId } },
      data: { status: 'failed' },
    })
    await payload.update({
      collection: 'demo-requests',
      id: demoRequestId,
      data: { status: 'failed' },
    })
    return
  }

  console.log(`[demo/${demoId}] Container healthy — triggering seed`)

  // Trigger seed
  try {
    const seedRes = await fetch(`${demoUrl}/api/seed`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${seedSecret}` },
      signal: AbortSignal.timeout(120_000),
    })
    const seedBody = await seedRes.text()
    console.log(`[demo/${demoId}] seed response: HTTP ${seedRes.status} — ${seedBody.slice(0, 200)}`)
    if (!seedRes.ok) {
      throw new Error(`seed returned ${seedRes.status}: ${seedBody}`)
    }
  } catch (err) {
    console.error(`[demo/${demoId}] seed failed:`, err)
    await payload.update({
      collection: 'demo-instances',
      where: { demoId: { equals: demoId } },
      data: { status: 'failed' },
    })
    await payload.update({
      collection: 'demo-requests',
      id: demoRequestId,
      data: { status: 'failed' },
    })
    return
  }

  // Mark ready
  console.log(`[demo/${demoId}] Seed complete — marking ready`)
  await payload.update({
    collection: 'demo-instances',
    where: { demoId: { equals: demoId } },
    data: { status: 'ready' },
  })
  await payload.update({
    collection: 'demo-requests',
    id: demoRequestId,
    data: { status: 'completed' },
  })

  // Send credentials email
  try {
    console.log(`[demo/${demoId}] Sending credentials email to ${email}`)
    const mail = createMailer(settings)
    await mail.sendDemoCredentials(email, {
      demoUrl,
      adminEmail: email,
      adminPassword,
      expiresAt,
      demoType,
    })
    console.log(`[demo/${demoId}] Credentials email sent`)
  } catch (err) {
    console.error(`[demo/${demoId}] email failed:`, err)
    // Non-fatal — demo is still ready
  }
}
