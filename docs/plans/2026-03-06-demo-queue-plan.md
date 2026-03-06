# Demo Request Queue — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Queue demo requests when all slots are full, provision them automatically when slots free up, and send credentials via email.

**Architecture:** Replace the 503 rejection with a `pending` status on DemoRequests. The existing cleanup cron processes the queue after freeing slots. A new `provisionPendingDemo` helper extracts the provisioning logic from the create route so both create (immediate) and cleanup (queued) can share it.

**Tech Stack:** Next.js 15 API routes, Payload CMS 3.x local API, nodemailer, React (client components), next-intl

---

### Task 1: Add `pending` status to DemoRequests collection

**Files:**
- Modify: `apps/landing/src/collections/DemoRequests.ts:44-55`

**Step 1: Add `pending` option to status field**

In `DemoRequests.ts`, add `pending` as the first option and change the defaultValue:

```typescript
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Provisioning', value: 'provisioning' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'Rejected', value: 'rejected' },
      ],
```

**Step 2: Regenerate types**

Run from monorepo root:
```bash
pnpm generate:types
```

Expected: `apps/landing/src/payload-types.ts` updates with `'pending'` in the DemoRequest status union.

**Step 3: Commit**

```bash
git add apps/landing/src/collections/DemoRequests.ts apps/landing/src/payload-types.ts
git commit -m "feat(landing): add pending status to DemoRequests collection"
```

---

### Task 2: Extract provisioning logic into shared helper

The create route currently has inline provisioning (lines 132-264) and `pollAndSeed` (lines 267-423). Extract the provisioning portion into a reusable function so both the create route and cleanup route can call it.

**Files:**
- Create: `apps/landing/src/lib/provision-demo.ts`
- Modify: `apps/landing/src/app/api/demo/create/route.ts`

**Step 1: Create `provision-demo.ts`**

This file exports `provisionAndDeploy` which takes a DemoRequest (with name, email, demoType, requestIp) and settings, then does everything the create route currently does from line 132 onwards: generate IDs, create DemoInstance, create Coolify service, fire-and-forget `pollAndSeed`. Returns `{ demoId, statusToken }` on success for the immediate flow, or throws on failure.

```typescript
// apps/landing/src/lib/provision-demo.ts
import { customAlphabet } from 'nanoid'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import type { CoolifyClient } from '@payload-reserve-demos/coolify-sdk'
import type { DemoType } from '@payload-reserve-demos/types'
import type { InfrastructureSetting } from '@/payload-types'
import type { Payload } from 'payload'
import { getCoolify } from '@/lib/cleanup-utils'
import { createMailer } from '@/lib/mailer'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16)

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

export interface ProvisionResult {
  demoId: string
  statusToken: string
}

export async function provisionAndDeploy(opts: {
  name: string
  email: string
  demoType: DemoType
  requestIp: string
  demoRequestId: string | number
  payload: Payload
  settings: InfrastructureSetting
}): Promise<ProvisionResult> {
  const { name, email, demoType, requestIp, demoRequestId, payload, settings } = opts

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
      type: demoType,
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

  // Link demo request to instance and mark as provisioning
  await payload.update({
    collection: 'demo-requests',
    id: demoRequestId,
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
    const image = getDemoImage(settings, demoType)
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
          { key: 'SMTP_FROM_NAME', value: DEMO_SMTP_FROM_NAMES[demoType] },
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
      console.error(`[demo/${demoId}] Coolify createService failed: ${(err as Error)?.message ?? 'Unknown error'}`)
      await payload.update({
        collection: 'demo-instances',
        id: instance.id,
        data: { status: 'failed' },
      })
      await payload.update({
        collection: 'demo-requests',
        id: demoRequestId,
        data: { status: 'failed' },
      })
      throw new Error('Failed to provision demo container')
    }
  }

  // Fire-and-forget: poll for health, seed, then notify
  void pollAndSeed({
    demoId,
    subdomain,
    demoProtocol,
    email,
    adminPassword,
    demoType,
    expiresAt,
    coolifyServiceId,
    coolify,
    demoSeedSecret,
    payload,
    demoRequestId,
    settings,
  })

  return { demoId, statusToken }
}

// --- pollAndSeed stays the same, just moved here ---

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
  payload: Payload
  demoRequestId: string | number
  settings: InfrastructureSetting
}) {
  const {
    demoId, subdomain, demoProtocol, email, adminPassword, demoType, expiresAt,
    coolify, coolifyServiceId, demoSeedSecret, payload, demoRequestId, settings,
  } = opts

  try {
    const demoUrl = `${demoProtocol}://${subdomain}`
    const seedSecret = demoSeedSecret
    const maxAttempts = 60
    const intervalMs = 10_000

    // Start the Coolify service if client is available
    if (coolify) {
      try {
        console.log(`[demo/${demoId}] Starting Coolify service ${coolifyServiceId}...`)
        await coolify.startService(coolifyServiceId)
        console.log(`[demo/${demoId}] startService call succeeded`)
      } catch (err) {
        console.error(`[demo/${demoId}] startService failed: ${(err as Error)?.message ?? 'Unknown error'}`)
      }
    } else {
      console.warn(`[demo/${demoId}] No Coolify client — skipping startService`)
    }

    // Poll /api/health
    let healthy = false
    console.log(`[demo/${demoId}] Polling ${demoUrl}/api/health (max ${maxAttempts} attempts, ${intervalMs}ms interval)...`)
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
      console.error(`[demo/${demoId}] seed failed: ${(err as Error)?.message ?? 'Unknown error'}`)
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
      console.error(`[demo/${demoId}] email failed: ${(err as Error)?.message ?? 'Unknown error'}`)
    }
  } catch (err) {
    console.error(`[demo/${demoId}] pollAndSeed unhandled error: ${(err as Error)?.message ?? err}`)
    await payload.update({
      collection: 'demo-instances',
      where: { demoId: { equals: demoId } },
      data: { status: 'failed' },
    }).catch(() => {})
    await payload.update({
      collection: 'demo-requests',
      id: demoRequestId,
      data: { status: 'failed' },
    }).catch(() => {})
  }
}
```

**Step 2: Rewrite `create/route.ts` to use the shared helper**

Replace lines 1-423 with a slimmer route that validates input, checks rate limits, checks capacity, and either provisions immediately or queues as pending.

```typescript
// apps/landing/src/app/api/demo/create/route.ts
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
      { error: 'You already have a demo request in progress. You\'ll receive an email when it\'s ready.' },
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

  if (activeCount.totalDocs < maxActive) {
    // --- IMMEDIATE PROVISIONING (slots available) ---
    const demoRequest = await payload.create({
      collection: 'demo-requests',
      data: { name, email, demoType: demoType as DemoType, requestIp, status: 'submitted' },
    })

    try {
      const result = await provisionAndDeploy({
        name, email, demoType: demoType as DemoType, requestIp,
        demoRequestId: demoRequest.id, payload, settings,
      })
      return NextResponse.json({ demoId: result.demoId, statusToken: result.statusToken }, { status: 202 })
    } catch {
      return NextResponse.json({ error: 'Failed to provision demo container' }, { status: 500 })
    }
  }

  // --- QUEUE (no slots available) ---
  const demoRequest = await payload.create({
    collection: 'demo-requests',
    data: { name, email, demoType: demoType as DemoType, requestIp, status: 'pending' },
  })

  const estimated = await estimateAvailability(payload, settings)

  return NextResponse.json(
    {
      queued: true,
      estimatedAvailability: estimated.toISOString(),
      message: 'Your demo request has been registered. You\'ll receive an email with credentials when it\'s ready.',
    },
    { status: 202 },
  )
}
```

**Step 3: Verify build compiles**

```bash
cd apps/landing && npx tsc --noEmit
```

Expected: May have errors for missing `estimate-availability` — that's task 3.

**Step 4: Commit**

```bash
git add apps/landing/src/lib/provision-demo.ts apps/landing/src/app/api/demo/create/route.ts
git commit -m "refactor(landing): extract provisioning into shared helper, add queue path to create route"
```

---

### Task 3: Create `estimateAvailability` helper

**Files:**
- Create: `apps/landing/src/lib/estimate-availability.ts`

**Step 1: Implement the helper**

```typescript
// apps/landing/src/lib/estimate-availability.ts
import type { Payload } from 'payload'
import type { InfrastructureSetting } from '@/payload-types'

/**
 * Estimate when the next queued demo will become available.
 *
 * Algorithm:
 * 1. Get all active demos sorted by expiresAt ASC
 * 2. Count pending requests ahead in queue
 * 3. Queue position = pending count + 1
 * 4. Return expiresAt of the Nth active demo (N = queue position)
 * 5. If queue position > active demos count, extrapolate using TTL
 */
export async function estimateAvailability(
  payload: Payload,
  settings: InfrastructureSetting,
): Promise<Date> {
  const pendingCount = await payload.count({
    collection: 'demo-requests',
    where: { status: { equals: 'pending' } },
  })

  // The new request hasn't been created yet when this is called from the create route,
  // but has been created by the time we call this. So pendingCount includes the new request.
  // Queue position = pendingCount (the new request is last in line).
  const queuePosition = pendingCount.totalDocs

  const activeDemos = await payload.find({
    collection: 'demo-instances',
    where: { status: { in: ['provisioning', 'ready'] } },
    sort: 'expiresAt',
    limit: queuePosition,
  })

  if (queuePosition <= activeDemos.docs.length && activeDemos.docs.length > 0) {
    // The Nth demo to expire is when this user's slot opens
    const targetDemo = activeDemos.docs[queuePosition - 1]
    return new Date(targetDemo.expiresAt)
  }

  // Fallback: extrapolate based on TTL
  // If queue is longer than active demos, estimate based on cycles
  const ttlMs = (settings.demoTtlHours || 24) * 60 * 60 * 1000
  const maxActive = settings.maxActiveDemos || 20
  const cyclesNeeded = Math.ceil(queuePosition / maxActive)
  const earliestExpiry = activeDemos.docs[0]
    ? new Date(activeDemos.docs[0].expiresAt).getTime()
    : Date.now() + ttlMs
  return new Date(earliestExpiry + (cyclesNeeded - 1) * ttlMs)
}
```

**Step 2: Verify build**

```bash
cd apps/landing && npx tsc --noEmit
```

Expected: PASS (no type errors)

**Step 3: Commit**

```bash
git add apps/landing/src/lib/estimate-availability.ts
git commit -m "feat(landing): add estimateAvailability helper for queue position calculation"
```

---

### Task 4: Extend cleanup route to process pending queue

**Files:**
- Modify: `apps/landing/src/app/api/demo/cleanup/route.ts`

**Step 1: Add queue processing after cleanup**

After the existing cleanup loop (line 78), add logic to:
1. Count available slots (`maxActive - currentActive`)
2. Fetch pending DemoRequests ordered by `createdAt` ASC
3. For each available slot, call `provisionAndDeploy`

Replace the entire file:

```typescript
// apps/landing/src/app/api/demo/cleanup/route.ts
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getInfraSettings } from '@/lib/infra-settings'
import { getS3, getCoolify, deleteS3Prefix, dropDemoDatabase, buildMongoUrl } from '@/lib/cleanup-utils'
import { provisionAndDeploy } from '@/lib/provision-demo'
import type { DemoType } from '@payload-reserve-demos/types'

let lastCleanupAt = 0
const CLEANUP_COOLDOWN_MS = 60_000

export async function POST(req: NextRequest) {
  const now = Date.now()
  if (now - lastCleanupAt < CLEANUP_COOLDOWN_MS) {
    return NextResponse.json(
      { error: 'Cleanup already ran recently. Try again later.' },
      { status: 429 },
    )
  }
  lastCleanupAt = now

  const payload = await getPayload({ config })
  const settings = await getInfraSettings(payload)

  // Auth check — constant-time comparison
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  const secret = settings.cleanupSecret || process.env.CLEANUP_SECRET || ''
  if (!token || !secret || token.length !== secret.length ||
      !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(secret))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // --- Phase 1: Expire old demos ---
  const expired = await payload.find({
    collection: 'demo-instances',
    where: {
      expiresAt: { less_than: new Date().toISOString() },
      status: { not_equals: 'expired' },
    },
    limit: 100,
  })

  const s3 = getS3(settings)
  const coolify = getCoolify(settings)
  const mongoUrl = buildMongoUrl(settings)
  const s3Bucket = settings.s3Bucket || process.env.S3_BUCKET || ''

  let expiredCount = 0
  let failedCount = 0

  await Promise.allSettled(
    expired.docs.map(async (demo) => {
      const results = await Promise.allSettled([
        coolify
          ? coolify.deleteService(demo.coolifyServiceId)
          : Promise.resolve(),
        dropDemoDatabase(mongoUrl, demo.dbName),
        deleteS3Prefix(s3, s3Bucket, demo.s3Prefix),
      ])

      const anyFailed = results.some((r) => r.status === 'rejected')
      if (anyFailed) {
        results.forEach((r, i) => {
          if (r.status === 'rejected') {
            console.error(`[cleanup/${demo.demoId}] step ${i} failed:`, (r.reason as Error)?.message ?? r.reason)
          }
        })
        failedCount++
      } else {
        expiredCount++
        await payload.update({
          collection: 'demo-instances',
          id: demo.id,
          data: { status: 'expired' },
        })
      }
    }),
  )

  // --- Phase 2: Process pending queue ---
  const maxActive = settings.maxActiveDemos || Number(process.env.MAX_ACTIVE_DEMOS ?? 20)
  const currentActive = await payload.count({
    collection: 'demo-instances',
    where: { status: { in: ['provisioning', 'ready'] } },
  })

  const availableSlots = maxActive - currentActive.totalDocs
  let queuedCount = 0

  if (availableSlots > 0) {
    const pendingRequests = await payload.find({
      collection: 'demo-requests',
      where: { status: { equals: 'pending' } },
      sort: 'createdAt',
      limit: availableSlots,
    })

    for (const request of pendingRequests.docs) {
      try {
        console.log(`[queue] Provisioning pending request ${request.id} (${request.email}, ${request.demoType})`)
        await provisionAndDeploy({
          name: request.name,
          email: request.email,
          demoType: request.demoType as DemoType,
          requestIp: request.requestIp || 'unknown',
          demoRequestId: request.id,
          payload,
          settings,
        })
        queuedCount++
      } catch (err) {
        console.error(`[queue] Failed to provision request ${request.id}:`, (err as Error)?.message ?? err)
      }
    }
  }

  return NextResponse.json({ expired: expiredCount, failed: failedCount, queued: queuedCount })
}
```

**Step 2: Verify build**

```bash
cd apps/landing && npx tsc --noEmit
```

Expected: PASS

**Step 3: Commit**

```bash
git add apps/landing/src/app/api/demo/cleanup/route.ts
git commit -m "feat(landing): process pending demo queue after cleanup frees slots"
```

---

### Task 5: Add i18n strings for queue UI

**Files:**
- Modify: `apps/landing/src/i18n/messages/en.json`
- Modify: `apps/landing/src/i18n/messages/fr.json`

**Step 1: Add queue-related strings to en.json**

Add to the `demoStatus` section:

```json
"queue": {
  "title": "You're in the queue!",
  "subtitle": "Your demo request has been registered. We'll send you an email with your credentials when it's ready.",
  "estimatedTime": "Estimated availability: {date}",
  "note": "This may vary depending on current demand.",
  "backHome": "Back to home"
},
```

Update the `demoStatus.error` section — add a new key for the "already requested" case:

```json
"alreadyRequestedTitle": "Request already in progress"
```

Update `demoRequestForm.errors` — add:

```json
"alreadyRequested": "You already have a demo request in progress. You'll receive an email when it's ready."
```

**Step 2: Add matching strings to fr.json**

Add equivalent French translations to the same sections.

**Step 3: Commit**

```bash
git add apps/landing/src/i18n/messages/en.json apps/landing/src/i18n/messages/fr.json
git commit -m "feat(landing): add i18n strings for demo queue confirmation"
```

---

### Task 6: Create `QueueConfirmation` component

**Files:**
- Create: `apps/landing/src/components/QueueConfirmation.tsx`

**Step 1: Create the component**

```tsx
// apps/landing/src/components/QueueConfirmation.tsx
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'

export function QueueConfirmation({ estimatedAvailability }: { estimatedAvailability: string }) {
  const t = useTranslations('demoStatus')
  const locale = useLocale()

  const estimatedDate = new Date(estimatedAvailability)
  const formatted = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(estimatedDate)

  return (
    <div className="space-y-6 text-center py-4">
      {/* Success icon */}
      <div className="w-12 h-12 rounded-full bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center mx-auto">
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          className="text-violet-500 dark:text-violet-400"
        >
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Message */}
      <div>
        <p className="text-[#1C1917] dark:text-white font-semibold text-sm mb-1.5">
          {t('queue.title')}
        </p>
        <p className="text-[#78716C] dark:text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
          {t('queue.subtitle')}
        </p>
      </div>

      {/* Estimated time */}
      <div className="bg-gray-50 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">
        <p className="text-sm font-medium text-[#1C1917] dark:text-white">
          {t('queue.estimatedTime', { date: formatted })}
        </p>
        <p className="text-xs text-[#78716C] dark:text-zinc-500 mt-1">
          {t('queue.note')}
        </p>
      </div>

      {/* Back home */}
      <Link
        href="/"
        className="inline-block text-xs text-[#78716C] dark:text-zinc-500 hover:text-[#1C1917] dark:hover:text-zinc-300 transition-colors"
      >
        &larr; {t('queue.backHome')}
      </Link>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add apps/landing/src/components/QueueConfirmation.tsx
git commit -m "feat(landing): add QueueConfirmation component"
```

---

### Task 7: Update `DemoRequestForm` to handle queue response

**Files:**
- Modify: `apps/landing/src/components/DemoRequestForm.tsx`

**Step 1: Add `queued` stage and handle new response shape**

Update the `Stage` type to include `'queued'`. Add state for `estimatedAvailability`. In `handleSubmit`, detect the `queued: true` response and transition to the queued stage instead of polling.

Key changes to `DemoRequestForm.tsx`:

1. Line 10: Change `type Stage = 'form' | 'polling' | 'error'` to `type Stage = 'form' | 'polling' | 'queued' | 'error'`
2. Add import for `QueueConfirmation`
3. Add state: `const [estimatedAvailability, setEstimatedAvailability] = useState<string | null>(null)`
4. In `handleSubmit` (line 57), change the response type and handling:

```typescript
const data = (await res.json()) as {
  demoId?: string
  statusToken?: string
  queued?: boolean
  estimatedAvailability?: string
  error?: string
}

if (!res.ok) {
  setError(data.error ?? t('errors.createFailed'))
  setStage('error')
  return
}

if (data.queued) {
  setEstimatedAvailability(data.estimatedAvailability ?? null)
  setStage('queued')
  return
}

if (!data.demoId || !data.statusToken) {
  setError(t('errors.createFailed'))
  setStage('error')
  return
}

setDemoId(data.demoId)
setStatusToken(data.statusToken)
setStage('polling')
```

5. Add queued stage rendering (before the form return):

```typescript
if (stage === 'queued' && estimatedAvailability) {
  return <QueueConfirmation estimatedAvailability={estimatedAvailability} />
}
```

**Step 2: Verify build**

```bash
cd apps/landing && npx tsc --noEmit
```

Expected: PASS

**Step 3: Commit**

```bash
git add apps/landing/src/components/DemoRequestForm.tsx
git commit -m "feat(landing): handle queued response in DemoRequestForm"
```

---

### Task 8: Update `ErrorScreen` for "already requested" message

**Files:**
- Modify: `apps/landing/src/components/ErrorScreen.tsx`

**Step 1: Detect "already requested" errors**

The new rate-limit message contains "already have a demo request". Update the `isRateLimit` detection in `ErrorScreen.tsx` line 13-14:

```typescript
const isRateLimit =
  message.toLowerCase().includes('24 hours') ||
  message.toLowerCase().includes('already have a demo') ||
  message.toLowerCase().includes('already have')
```

This already partially matches. The key change is that the old "wait 24 hours" message is gone; the new message says "already have a demo request in progress". The existing `includes('already have')` check covers both old and new messages, so **no code change is needed** in `ErrorScreen.tsx`.

Verify this is correct by reviewing the error message in the create route: `"You already have a demo request in progress. You'll receive an email when it's ready."` — the `includes('already have')` check matches.

**Step 2: Commit (skip if no changes needed)**

No changes needed — existing detection covers the new message.

---

### Task 9: Type-check and test the full build

**Step 1: Type-check**

```bash
cd apps/landing && npx tsc --noEmit
```

Expected: PASS with zero errors.

**Step 2: Build**

```bash
cd /home/sam/projects/reservation-demo && pnpm build:landing
```

Expected: Build succeeds.

**Step 3: Manual smoke test (if dev server available)**

```bash
pnpm dev:landing
```

1. Open http://localhost:3001/en/demo
2. Fill in the form and submit — should provision immediately (if dev has no active demos)
3. Verify the response handling works

---

### Task 10: Final commit and cleanup

**Step 1: Run a final `git status` to check for uncommitted files**

```bash
git status
```

**Step 2: If all looks good, create a single summary commit or verify all prior commits are clean**

```bash
git log --oneline -10
```

Verify the commit chain is clean and follows the plan.
