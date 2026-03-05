# Infrastructure Settings Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move infrastructure env vars into a Payload CMS global (`infrastructure-settings`) so admins can update Coolify, Docker, SMTP, S3, Stripe, MongoDB, and demo config from the admin panel without redeploying.

**Architecture:** Single Payload global with 7 tabs and a secret-masking pattern using `afterRead`/`beforeChange` hooks. Secret values are replaced with `'••••••••'` before reaching the admin UI; the mask sentinel is preserved on save via `beforeChange`. API routes read unmasked values via `context: { includeSecrets: true }`.

**Tech Stack:** Payload CMS 3.x, Next.js 15, TypeScript, React (admin component)

**Design doc:** `docs/plans/2026-03-05-infrastructure-settings-design.md`

---

### Task 1: Create the InfrastructureSettings global

**Files:**
- Create: `apps/landing/src/globals/InfrastructureSettings.ts`

**Step 1: Create the global config file**

All file paths below are relative to `apps/landing/`.

```typescript
// src/globals/InfrastructureSettings.ts
import type { GlobalConfig, Field } from 'payload'

const SECRET_MASK = '••••••••'

// List of field names that contain secrets — used by afterRead/beforeChange hooks
export const SECRET_FIELDS = [
  'coolifyApiKey',
  'mongoRootUsername',
  'mongoRootPassword',
  'smtpPass',
  's3AccessKey',
  's3SecretKey',
  'stripeSecretKey',
  'stripeWebhookSecret',
  'cleanupSecret',
  'turnstileSecretKey',
]

/** Helper to define a text field that uses the SecretField admin component */
function secretText(overrides: {
  name: string
  label: string
  required?: boolean
}): Field {
  return {
    name: overrides.name,
    type: 'text',
    label: overrides.label,
    required: overrides.required,
    admin: {
      components: {
        Field: '@/components/admin/SecretField',
      },
    },
  }
}

export const InfrastructureSettings: GlobalConfig = {
  slug: 'infrastructure-settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
  },
  hooks: {
    afterRead: [
      ({ doc, context }) => {
        if (context?.includeSecrets) return doc
        const masked = { ...doc }
        for (const key of SECRET_FIELDS) {
          if (masked[key]) masked[key] = SECRET_MASK
        }
        return masked
      },
    ],
    beforeChange: [
      async ({ data, originalDoc }) => {
        // If a secret field still has the mask sentinel, preserve the original value
        for (const key of SECRET_FIELDS) {
          if (data[key] === SECRET_MASK && originalDoc?.[key]) {
            data[key] = originalDoc[key]
          }
        }
        return data
      },
    ],
  },
  fields: [
    // ── Tab: Coolify ──
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Coolify',
          fields: [
            { name: 'coolifyApiUrl', type: 'text', label: 'API URL', admin: { placeholder: 'https://coolify.example.com/api' } },
            secretText({ name: 'coolifyApiKey', label: 'API Key' }),
            { name: 'coolifyProjectUuid', type: 'text', label: 'Project UUID' },
            { name: 'coolifyServerUuid', type: 'text', label: 'Server UUID' },
            { name: 'coolifyDestinationUuid', type: 'text', label: 'Destination UUID' },
          ],
        },
        // ── Tab: Docker Images ──
        {
          label: 'Docker Images',
          fields: [
            {
              name: 'salonImage',
              type: 'group',
              label: 'Salon',
              fields: [
                { name: 'name', type: 'text', label: 'Image Name', admin: { placeholder: 'registry.example.com/org/salon' } },
                { name: 'tag', type: 'text', label: 'Tag', defaultValue: 'latest' },
              ],
            },
            {
              name: 'hotelImage',
              type: 'group',
              label: 'Hotel',
              fields: [
                { name: 'name', type: 'text', label: 'Image Name' },
                { name: 'tag', type: 'text', label: 'Tag', defaultValue: 'latest' },
              ],
            },
            {
              name: 'restaurantImage',
              type: 'group',
              label: 'Restaurant',
              fields: [
                { name: 'name', type: 'text', label: 'Image Name' },
                { name: 'tag', type: 'text', label: 'Tag', defaultValue: 'latest' },
              ],
            },
            {
              name: 'eventsImage',
              type: 'group',
              label: 'Events',
              fields: [
                { name: 'name', type: 'text', label: 'Image Name' },
                { name: 'tag', type: 'text', label: 'Tag', defaultValue: 'latest' },
              ],
            },
          ],
        },
        // ── Tab: MongoDB ──
        {
          label: 'MongoDB',
          fields: [
            { name: 'mongoHost', type: 'text', label: 'Host', admin: { description: 'Docker network hostname of the shared MongoDB instance' } },
            secretText({ name: 'mongoRootUsername', label: 'Root Username' }),
            secretText({ name: 'mongoRootPassword', label: 'Root Password' }),
          ],
        },
        // ── Tab: SMTP ──
        {
          label: 'SMTP',
          fields: [
            { name: 'smtpHost', type: 'text', label: 'Host', admin: { placeholder: 'smtp.gmail.com' } },
            { name: 'smtpPort', type: 'number', label: 'Port', defaultValue: 587 },
            { name: 'smtpUser', type: 'text', label: 'Username' },
            secretText({ name: 'smtpPass', label: 'Password' }),
            { name: 'smtpFrom', type: 'email', label: 'From Address' },
            { name: 'smtpFromName', type: 'text', label: 'From Name', defaultValue: 'payload-reserve' },
          ],
        },
        // ── Tab: S3 Storage ──
        {
          label: 'S3 Storage',
          fields: [
            { name: 's3Endpoint', type: 'text', label: 'Endpoint' },
            secretText({ name: 's3AccessKey', label: 'Access Key' }),
            secretText({ name: 's3SecretKey', label: 'Secret Key' }),
            { name: 's3Region', type: 'text', label: 'Region', defaultValue: 'us-east-1' },
            { name: 's3Bucket', type: 'text', label: 'Bucket' },
            { name: 's3Prefix', type: 'text', label: 'Key Prefix', defaultValue: 'media' },
            { name: 's3ForcePathStyle', type: 'checkbox', label: 'Force Path Style', defaultValue: true, admin: { description: 'Enable for MinIO or S3-compatible storage' } },
          ],
        },
        // ── Tab: Stripe ──
        {
          label: 'Stripe',
          fields: [
            secretText({ name: 'stripeSecretKey', label: 'Secret Key' }),
            secretText({ name: 'stripeWebhookSecret', label: 'Webhook Secret' }),
            { name: 'stripePublishableKey', type: 'text', label: 'Publishable Key' },
          ],
        },
        // ── Tab: Demo Config ──
        {
          label: 'Demo Config',
          fields: [
            { name: 'demoBaseDomain', type: 'text', label: 'Base Domain', defaultValue: 'payloadreserve.com' },
            {
              name: 'demoProtocol',
              type: 'select',
              label: 'Protocol',
              defaultValue: 'https',
              options: [
                { label: 'HTTPS', value: 'https' },
                { label: 'HTTP', value: 'http' },
              ],
            },
            { name: 'demoTtlHours', type: 'number', label: 'Demo TTL (hours)', defaultValue: 24 },
            { name: 'maxActiveDemos', type: 'number', label: 'Max Active Demos', defaultValue: 20 },
            secretText({ name: 'cleanupSecret', label: 'Cleanup Secret' }),
            secretText({ name: 'turnstileSecretKey', label: 'Turnstile Secret Key' }),
            { name: 'turnstileSiteKey', type: 'text', label: 'Turnstile Site Key' },
          ],
        },
      ],
    },
  ],
}
```

**Step 2: Commit**

```bash
git add apps/landing/src/globals/InfrastructureSettings.ts
git commit -m "feat(landing): add InfrastructureSettings global definition"
```

---

### Task 2: Create the SecretField admin component

**Files:**
- Create: `apps/landing/src/components/admin/SecretField.tsx`

**Step 1: Create the component**

This is a Payload 3.x custom field component. It receives the masked value (`'••••••••'` or `''`) from the `afterRead` hook, and lets admins set new values. The actual secret never reaches the browser after save.

```tsx
// src/components/admin/SecretField.tsx
'use client'
import React, { useState, useCallback } from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

const SECRET_MASK = '••••••••'

export const SecretField: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const hasValue = value === SECRET_MASK || (!!value && value !== '')

  const handleApply = useCallback(() => {
    if (inputValue) {
      setValue(inputValue)
    }
    setEditing(false)
    setInputValue('')
  }, [inputValue, setValue])

  const handleCancel = useCallback(() => {
    setEditing(false)
    setInputValue('')
  }, [])

  return (
    <div className="field-type text" style={{ marginBottom: '1.25rem' }}>
      <FieldLabel label={field?.label || field?.name || path} required={field?.required} path={path} />
      {!editing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
          <code style={{ color: hasValue ? 'var(--theme-elevation-800)' : 'var(--theme-elevation-400)' }}>
            {hasValue ? SECRET_MASK : '(not set)'}
          </code>
          <button
            type="button"
            className="btn btn--size-small btn--style-secondary"
            onClick={() => setEditing(true)}
          >
            {hasValue ? 'Update' : 'Set'}
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '0.25rem' }}>
          <input
            type="password"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter new value"
            autoComplete="off"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '4px',
              background: 'var(--theme-input-bg)',
              color: 'var(--theme-elevation-800)',
              marginBottom: '0.5rem',
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="btn btn--size-small btn--style-primary" onClick={handleApply}>
              Apply
            </button>
            <button type="button" className="btn btn--size-small btn--style-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SecretField
```

**Step 2: Commit**

```bash
git add apps/landing/src/components/admin/SecretField.tsx
git commit -m "feat(landing): add SecretField admin component for masked secret inputs"
```

---

### Task 3: Register global and regenerate types/importmap

**Files:**
- Modify: `apps/landing/src/payload.config.ts`

**Step 1: Add import and register the global**

Add to imports (after the Footer import on line 17):
```typescript
import { InfrastructureSettings } from './globals/InfrastructureSettings'
```

Update the `globals` array (line 46):
```typescript
globals: [SiteSettings, Navigation, HomePage, Footer, InfrastructureSettings],
```

**Step 2: Generate types and importmap**

Run from monorepo root:
```bash
cd apps/landing && pnpm generate:types
```

Then:
```bash
cd apps/landing && pnpm generate:importmap
```

**Step 3: Commit**

```bash
git add apps/landing/src/payload.config.ts apps/landing/src/payload-types.ts apps/landing/src/app/\(payload\)/importMap.js
git commit -m "feat(landing): register InfrastructureSettings global, regenerate types"
```

---

### Task 4: Create the getInfraSettings helper

**Files:**
- Create: `apps/landing/src/lib/infra-settings.ts`

**Step 1: Create the helper**

```typescript
// src/lib/infra-settings.ts
import type { Payload } from 'payload'
import type { InfrastructureSetting } from '@/payload-types'

/**
 * Fetch infrastructure settings with unmasked secret values.
 * Uses `context.includeSecrets` to bypass the afterRead masking hook.
 */
export async function getInfraSettings(payload: Payload): Promise<InfrastructureSetting> {
  return payload.findGlobal({
    slug: 'infrastructure-settings',
    context: { includeSecrets: true },
  })
}
```

**Step 2: Commit**

```bash
git add apps/landing/src/lib/infra-settings.ts
git commit -m "feat(landing): add getInfraSettings helper"
```

---

### Task 5: Update cleanup-utils.ts to accept settings

**Files:**
- Modify: `apps/landing/src/lib/cleanup-utils.ts`

**Step 1: Refactor to accept settings parameter**

Replace the entire file with:

```typescript
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import { MongoClient } from 'mongodb'
import { CoolifyClient } from '@payload-reserve-demos/coolify-sdk'
import type { InfrastructureSetting } from '@/payload-types'

export function getS3(settings: InfrastructureSetting): S3Client {
  return new S3Client({
    endpoint: settings.s3Endpoint || process.env.S3_ENDPOINT,
    region: settings.s3Region || process.env.S3_REGION || 'us-east-1',
    credentials: {
      accessKeyId: settings.s3AccessKey || process.env.S3_ACCESS_KEY || '',
      secretAccessKey: settings.s3SecretKey || process.env.S3_SECRET_KEY || '',
    },
    forcePathStyle: settings.s3ForcePathStyle ?? (process.env.S3_FORCE_PATH_STYLE === 'true'),
  })
}

export function getCoolify(settings: InfrastructureSetting): CoolifyClient | null {
  const url = settings.coolifyApiUrl || process.env.COOLIFY_API_URL
  const key = settings.coolifyApiKey || process.env.COOLIFY_API_KEY
  if (!url || !key) return null
  return new CoolifyClient(url, key)
}

export async function deleteS3Prefix(s3: S3Client, bucket: string, prefix: string): Promise<void> {
  let continuationToken: string | undefined

  do {
    const list = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    )
    const objects = (list.Contents ?? []).map((o) => ({ Key: o.Key! }))
    if (objects.length > 0) {
      await s3.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: objects } }))
    }
    continuationToken = list.IsTruncated ? list.NextContinuationToken : undefined
  } while (continuationToken)
}

const SAFE_DB_NAME_RE = /^payloadreserve-demo-[a-z0-9]+$/

/**
 * Build a MongoDB connection URL from infra settings (for demo database operations).
 * Falls back to env vars during migration.
 */
export function buildMongoUrl(settings: InfrastructureSetting): string {
  const user = encodeURIComponent(settings.mongoRootUsername || process.env.MONGO_ROOT_USERNAME || '')
  const pass = encodeURIComponent(settings.mongoRootPassword || process.env.MONGO_ROOT_PASSWORD || '')
  const host = settings.mongoHost || process.env.MONGO_HOST || 'localhost:27017'
  return `mongodb://${user}:${pass}@${host}:27017/?authSource=admin&directConnection=true`
}

export async function dropDemoDatabase(mongoUrl: string, dbName: string): Promise<void> {
  if (!SAFE_DB_NAME_RE.test(dbName)) {
    throw new Error(`Refusing to drop database with unexpected name: ${dbName}`)
  }
  const client = new MongoClient(mongoUrl)
  try {
    await client.connect()
    await client.db(dbName).dropDatabase()
  } finally {
    await client.close()
  }
}
```

Key changes:
- `getS3(settings)` — accepts `InfrastructureSetting`, falls back to env vars
- `getCoolify(settings)` — accepts `InfrastructureSetting`, falls back to env vars
- `deleteS3Prefix(s3, bucket, prefix)` — now takes `bucket` as a param (was reading from env)
- New `buildMongoUrl(settings)` — constructs MongoDB URL from settings (was using `DATABASE_URL`)
- `dropDemoDatabase` unchanged (still takes a URL string)

**Step 2: Commit**

```bash
git add apps/landing/src/lib/cleanup-utils.ts
git commit -m "refactor(landing): cleanup-utils accepts InfrastructureSetting param"
```

---

### Task 6: Update mailer.ts to accept settings

**Files:**
- Modify: `apps/landing/src/lib/mailer.ts`

**Step 1: Refactor to accept settings**

Replace the entire file with:

```typescript
import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { DemoCredentials } from '@payload-reserve-demos/email-templates'
import type { DemoCredentialsData } from '@payload-reserve-demos/email-templates'
import type { InfrastructureSetting } from '@/payload-types'

export interface Mailer {
  sendDemoCredentials(to: string, data: DemoCredentialsData): Promise<void>
}

function createTransport(settings: InfrastructureSetting) {
  return nodemailer.createTransport({
    host: settings.smtpHost || process.env.SMTP_HOST!,
    port: settings.smtpPort || Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: settings.smtpUser || process.env.SMTP_USER!,
      pass: settings.smtpPass || process.env.SMTP_PASS!,
    },
  })
}

export function createMailer(settings: InfrastructureSetting): Mailer {
  return {
    async sendDemoCredentials(to: string, data: DemoCredentialsData): Promise<void> {
      const host = settings.smtpHost || process.env.SMTP_HOST
      if (!host) return

      const transport = createTransport(settings)
      const element = DemoCredentials(data)
      const html = await render(element)
      const fromName = settings.smtpFromName || process.env.SMTP_FROM_NAME || 'payload-reserve'
      const fromAddr = settings.smtpFrom || process.env.SMTP_FROM!

      await transport.sendMail({
        from: `"${fromName}" <${fromAddr}>`,
        to,
        subject: `Your ${data.demoType} demo is ready`,
        html,
      })
    },
  }
}

// Legacy export for backward compatibility during migration
export const mailer: Mailer = {
  async sendDemoCredentials(to, data) {
    if (!process.env.SMTP_HOST) return
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    })
    const element = DemoCredentials(data)
    const html = await render(element)
    await transport.sendMail({
      from: `"${process.env.SMTP_FROM_NAME ?? 'payload-reserve'}" <${process.env.SMTP_FROM!}>`,
      to,
      subject: `Your ${data.demoType} demo is ready`,
      html,
    })
  },
}
```

Key changes:
- New `createMailer(settings)` factory — creates a Mailer using infra settings
- Legacy `mailer` export kept for any code not yet migrated (will be removed later)

**Step 2: Commit**

```bash
git add apps/landing/src/lib/mailer.ts
git commit -m "refactor(landing): mailer accepts InfrastructureSetting param"
```

---

### Task 7: Update turnstile.ts to accept settings

**Files:**
- Modify: `apps/landing/src/lib/turnstile.ts`

**Step 1: Refactor to accept settings**

Replace the entire file with:

```typescript
import type { InfrastructureSetting } from '@/payload-types'

export async function verifyTurnstile(
  token: string,
  settings?: InfrastructureSetting | null,
): Promise<boolean> {
  const secret = settings?.turnstileSecretKey || process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (process.env.NODE_ENV === 'development') return true
    return false
  }

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token }),
  })

  const data = (await res.json()) as { success: boolean }
  return data.success === true
}
```

Key change: Optional `settings` parameter, falls back to env var.

**Step 2: Commit**

```bash
git add apps/landing/src/lib/turnstile.ts
git commit -m "refactor(landing): turnstile accepts optional InfrastructureSetting"
```

---

### Task 8: Update cleanup/route.ts to use getInfraSettings

**Files:**
- Modify: `apps/landing/src/app/api/demo/cleanup/route.ts`

**Step 1: Rewrite the route**

Replace the entire file with:

```typescript
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getInfraSettings } from '@/lib/infra-settings'
import { getS3, getCoolify, deleteS3Prefix, dropDemoDatabase, buildMongoUrl } from '@/lib/cleanup-utils'

export async function POST(req: NextRequest) {
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
            console.error(`[cleanup/${demo.demoId}] step ${i} failed:`, r.reason)
          }
        })
        failedCount++
      } else {
        expiredCount++
      }

      await payload.update({
        collection: 'demo-instances',
        id: demo.id,
        data: { status: 'expired' },
      })
    }),
  )

  return NextResponse.json({ expired: expiredCount, failed: failedCount })
}
```

Key changes:
- Reads `settings` via `getInfraSettings(payload)` at the top
- `cleanupSecret` from settings (with env fallback)
- `getS3(settings)`, `getCoolify(settings)` instead of no-arg versions
- `buildMongoUrl(settings)` instead of `process.env.DATABASE_URL`
- `deleteS3Prefix(s3, s3Bucket, prefix)` passes bucket from settings

**Step 2: Commit**

```bash
git add apps/landing/src/app/api/demo/cleanup/route.ts
git commit -m "refactor(landing): cleanup route reads from InfrastructureSettings"
```

---

### Task 9: Update create/route.ts to use getInfraSettings

**Files:**
- Modify: `apps/landing/src/app/api/demo/create/route.ts`

This is the largest change. The route currently reads ~25 env vars directly.

**Step 1: Rewrite the route**

Replace the entire file with:

```typescript
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
  const imageGroup = settings[`${type}Image` as keyof InfrastructureSetting] as { name?: string; tag?: string } | undefined
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
    const mongoHost = settings.mongoHost || process.env.MONGO_HOST || 'mongodb:27017'
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
```

Key changes:
- `getInfraSettings(payload)` called after getting payload instance
- `getDemoImage(settings, type)` reads image name/tag from settings with env fallback
- All `process.env.X` references replaced with `settings.X || process.env.X` pattern
- `demoProtocol` is now a local variable read from settings (was module-level)
- `pollAndSeed` receives `settings` and `demoProtocol` as params
- Uses `createMailer(settings)` instead of `mailer` singleton
- `getCoolify(settings)` instead of `getCoolify()`

**Step 2: Commit**

```bash
git add apps/landing/src/app/api/demo/create/route.ts
git commit -m "refactor(landing): create route reads from InfrastructureSettings"
```

---

### Task 10: Verify build

**Step 1: Type-check**

```bash
cd apps/landing && npx tsc --noEmit
```

Expected: no errors.

**Step 2: Build**

```bash
cd /home/sam/projects/reservation-demo && pnpm build:landing
```

Expected: successful build.

**Step 3: Fix any type errors if needed**

After generating types in Task 3, the `InfrastructureSetting` type will be available. If type errors appear due to field name mismatches or optional types, fix them.

**Step 4: Commit any fixes**

```bash
git add -A && git commit -m "fix(landing): resolve type errors from InfrastructureSettings migration"
```

---

### Task 11: Clean up legacy env-var fallbacks (future, not now)

> **Skip this task for now.** Once the admin UI is populated with real values and verified working in production, return to remove all `|| process.env.X` fallbacks from Tasks 5-9. This keeps the migration safe.

---

## Summary of env vars that STAY as env vars

These are needed at Payload/Next.js startup time (before any Payload API is available):

| Env var | Why |
|---------|-----|
| `DATABASE_URL` | Payload DB adapter init |
| `PAYLOAD_SECRET` | Payload auth/encryption init |
| `NEXT_PUBLIC_SERVER_URL` | Next.js build-time |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Client-side bundle |
| `NODE_ENV` | Runtime environment |
| `SMTP_HOST`, `SMTP_*` | `payload.config.ts` email adapter init (landing app's own email) |
| `S3_*` | `payload.config.ts` S3 storage plugin init (landing app's own media) |

The infra settings global stores the same S3/SMTP values for **demo container provisioning** — separate from the landing app's own config.
