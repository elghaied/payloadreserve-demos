# Production Readiness Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 23 production readiness issues across the monorepo (salon, hotel, restaurant, events, landing, docs) using a salon-first reference implementation, then replicating to each app.

**Architecture:** Salon-first approach — every fix is proven in salon, then replicated app-by-app. Cross-cutting infrastructure (git scrub, Coolify SDK, CI/CD) handled in dedicated phases.

**Tech Stack:** Payload CMS 3.x, Next.js 15, MongoDB, Docker, pnpm monorepo, Turborepo, Sentry, p-retry

**Spec:** `docs/superpowers/specs/2026-03-14-production-readiness-design.md`

---

## Chunk 1: Phase 1 — Git History Scrub & Secret Rotation

### Task 1: Remove committed .env files from git history

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Install git-filter-repo**

```bash
pip3 install git-filter-repo
```

- [ ] **Step 2: Create a backup branch**

```bash
git checkout -b backup/pre-scrub
git checkout main
```

- [ ] **Step 3: Run git filter-repo to remove all .env files**

```bash
git filter-repo \
  --path .env \
  --path apps/salon/.env \
  --path apps/landing/.env.local \
  --path apps/hotel/.env \
  --path apps/restaurant/.env \
  --path apps/events/.env \
  --invert-paths \
  --force
```

- [ ] **Step 4: Re-add remotes (filter-repo removes them)**

```bash
git remote add origin <github-url>
git remote add onedev <onedev-url>
```

- [ ] **Step 5: Force-push to both remotes**

```bash
git push origin --force --all && git push origin --force --tags
git push onedev --force --all && git push onedev --force --tags
```

- [ ] **Step 6: Update .gitignore**

Add these patterns to the root `.gitignore` (around line 36 where `.env` is currently listed):

```gitignore
# Environment files
.env
.env.local
.env.production
.env.staging
.env.development
!.env.example
```

- [ ] **Step 7: Commit**

```bash
git add .gitignore
git commit -m "chore: harden .gitignore to block all .env variants"
```

---

### Task 2: Rotate all leaked credentials

This task is manual — no code changes, just external service actions.

- [ ] **Step 1: Rotate Stripe keys**

Go to Stripe Dashboard → Developers → API Keys:
- Roll the test secret key (`sk_test_...`)
- Roll the webhook signing secret (`whsec_...`)
- Note new values for Coolify env vars

- [ ] **Step 2: Rotate Gmail app password**

Go to Google Account → Security → 2-Step Verification → App passwords:
- Revoke the existing app password
- Generate a new one
- Note new value for `SMTP_PASS` in Coolify

- [ ] **Step 3: Rotate Coolify API token**

Go to Coolify UI → Settings → API Tokens:
- Revoke the existing token
- Generate a new one
- Update `COOLIFY_API_KEY` in the landing app's Coolify env vars

- [ ] **Step 4: Rotate Cloudflare Turnstile keys**

Go to Cloudflare Dashboard → Turnstile:
- Delete and recreate the site
- Note new site key and secret key
- Update `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Coolify

- [ ] **Step 5: Generate new Payload secrets**

```bash
# Run once per app — use output as PAYLOAD_SECRET in Coolify
openssl rand -hex 32  # salon
openssl rand -hex 32  # hotel
openssl rand -hex 32  # restaurant
openssl rand -hex 32  # events
openssl rand -hex 32  # landing
```

- [ ] **Step 6: Generate new seed and cleanup secrets**

```bash
openssl rand -hex 32  # SEED_SECRET (shared or per-app)
openssl rand -hex 32  # CLEANUP_SECRET (landing only)
```

- [ ] **Step 7: Update all secrets in Coolify**

For each app service in Coolify, update environment variables with the new values from steps 1-6.

---

### Task 3: Update .env.example files for all apps

**Files:**
- Modify: `apps/salon/.env.example`
- Modify: `apps/hotel/.env.example`
- Modify: `apps/restaurant/.env.example`
- Modify: `apps/events/.env.example`
- Modify: `apps/landing/.env.example`

- [ ] **Step 1: Update salon .env.example**

Replace the full contents of `apps/salon/.env.example` with:

```env
# ── Core ──────────────────────────────────────────────
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
PAYLOAD_SECRET=                    # Required. Generate with: openssl rand -hex 32
DATABASE_URL=                      # Required. MongoDB connection string

# ── Admin ─────────────────────────────────────────────
ADMIN_EMAIL=admin@yoursalon.com
ADMIN_PASSWORD=                    # Required on first run to create admin user
SEED_SECRET=                       # Required. Protects /api/seed endpoint

# ── S3 Storage ────────────────────────────────────────
S3_ENDPOINT=http://localhost:9000  # MinIO or S3-compatible endpoint
S3_BUCKET=salon-demo
S3_PREFIX=media                    # Required. Prefix for all uploads
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true           # true for MinIO, false for AWS S3

# ── SMTP (optional — email features disabled if SMTP_HOST unset) ──
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@yoursalon.com
SMTP_FROM_NAME=Lumière Salon

# ── Stripe (optional — payment features disabled if unset) ──
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# ── Sentry (optional — error tracking disabled if unset) ──
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

- [ ] **Step 2: Update hotel .env.example**

Same structure as salon but with hotel-specific defaults:
- `S3_BUCKET=hotel-demo`
- `S3_PREFIX=media`
- `SMTP_FROM=noreply@grandhotel.com`
- `SMTP_FROM_NAME=Grand Hotel`

- [ ] **Step 3: Update restaurant .env.example**

Same structure with:
- `S3_BUCKET=restaurant-demo`
- `SMTP_FROM=noreply@lejardin.com`
- `SMTP_FROM_NAME=Le Jardin`

- [ ] **Step 4: Update events .env.example**

Same structure with:
- `S3_BUCKET=events-demo`
- `SMTP_FROM=noreply@eclat.com`
- `SMTP_FROM_NAME=Éclat Festival`

- [ ] **Step 5: Update landing .env.example**

Replace full contents of `apps/landing/.env.example`:

```env
# ── Core ──────────────────────────────────────────────
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
PAYLOAD_SECRET=                    # Required. openssl rand -hex 32
DATABASE_URL=                      # Required. MongoDB connection string

# ── Admin ─────────────────────────────────────────────
ADMIN_EMAIL=admin@payloadreserve.com
ADMIN_PASSWORD=
SEED_SECRET=

# ── S3 Storage ────────────────────────────────────────
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=landing
S3_PREFIX=media
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true

# ── SMTP ──────────────────────────────────────────────
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@payloadreserve.com
SMTP_FROM_NAME=Payload Reserve

# ── Coolify (required for demo provisioning) ──────────
COOLIFY_API_URL=                   # e.g. https://coolify.yourdomain.com
COOLIFY_API_KEY=                   # Coolify API token
COOLIFY_PROJECT_UUID=              # UUID of the project in Coolify
COOLIFY_SERVER_UUID=               # UUID of the server in Coolify

# ── Demo Configuration ───────────────────────────────
DEMO_TTL_HOURS=24                  # How long demos live before cleanup
MAX_ACTIVE_DEMOS=20                # Max concurrent demo instances
DEMO_PROTOCOL=https                # http for local dev, https for production
DEMO_DOMAIN=payloadreserve.com     # Base domain for demo subdomains

# ── Cloudflare Turnstile ─────────────────────────────
NEXT_PUBLIC_TURNSTILE_SITE_KEY=    # Site key from Cloudflare dashboard
TURNSTILE_SECRET_KEY=              # Use 1x0000000000000000000000000000000AA for dev

# ── Stripe (optional) ────────────────────────────────
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# ── MongoDB Root (for demo DB cleanup) ────────────────
MONGO_ROOT_USER=
MONGO_ROOT_PASS=
MONGO_HOST=                        # e.g. mongodb:27017

# ── Cleanup ───────────────────────────────────────────
CLEANUP_SECRET=                    # Bearer token for /api/demo/cleanup

# ── Sentry (optional) ────────────────────────────────
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

- [ ] **Step 6: Commit**

```bash
git add apps/salon/.env.example apps/hotel/.env.example apps/restaurant/.env.example apps/events/.env.example apps/landing/.env.example
git commit -m "docs: comprehensive .env.example files for all apps"
```

---

### Task 4: Create env-vars reference doc

**Files:**
- Create: `docs/env-vars.md`

- [ ] **Step 1: Write the reference document**

Create `docs/env-vars.md` listing all env vars per app, grouped by category, with Required/Optional status and descriptions. Reference the `.env.example` files for format.

- [ ] **Step 2: Commit**

```bash
git add -f docs/env-vars.md
git commit -m "docs: add env-vars reference for all apps"
```

---

## Chunk 2: Phase 2 — Salon Reference Implementation

### Task 5: Environment & startup validation (Issue #3, #4)

**Files:**
- Modify: `apps/salon/src/payload.config.ts:42-58`
- Modify: `apps/salon/src/app/(frontend)/[locale]/book/actions.ts:148-149`
- Modify: `apps/salon/src/app/(frontend)/[locale]/(customer)/account/actions.ts:102`

- [ ] **Step 1: Add requireEnv helper and replace fallbacks**

In `apps/salon/src/payload.config.ts`, add a `requireEnv` helper at the top of the file (after imports, before the `buildConfig` call) and replace the empty-string fallbacks:

```typescript
function requireEnv(name: string): string {
  const val = process.env[name]
  if (!val) throw new Error(`Missing required environment variable: ${name}`)
  return val
}
```

Replace line 42:
```typescript
// Before: secret: process.env.PAYLOAD_SECRET || '',
secret: requireEnv('PAYLOAD_SECRET'),
```

Replace line 58:
```typescript
// Before: url: process.env.DATABASE_URL || '',
url: requireEnv('DATABASE_URL'),
```

- [ ] **Step 2: Validate S3 vars**

In the s3Storage plugin config section of `payload.config.ts` (around line 205), replace the `!` assertions and `|| ''` fallbacks:

```typescript
bucket: requireEnv('S3_BUCKET'),
credentials: {
  accessKeyId: requireEnv('S3_ACCESS_KEY'),
  secretAccessKey: requireEnv('S3_SECRET_KEY'),
},
```

Note: S3 is conditionally loaded (wrapped in `process.env.S3_BUCKET ? [...] : []`), so `requireEnv` is only called when S3 is intended to be used. If the app's config unconditionally includes s3Storage, wrap the entire plugin in a conditional check or use `requireEnv` directly.

- [ ] **Step 3: Add SMTP all-or-nothing validation**

In the SMTP conditional block (around line 73), add validation:

```typescript
...(process.env.SMTP_HOST ? {
  // Validate all SMTP vars are present when SMTP_HOST is set
  ...((() => {
    requireEnv('SMTP_FROM')
    requireEnv('SMTP_USER')
    requireEnv('SMTP_PASS')
    return {}
  })()),
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM!,
    defaultFromName: process.env.SMTP_FROM_NAME || 'Lumière Salon',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    },
  }),
} : {}),
```

Or more simply, add validation before the conditional:
```typescript
if (process.env.SMTP_HOST) {
  requireEnv('SMTP_FROM')
  requireEnv('SMTP_USER')
  requireEnv('SMTP_PASS')
}
```

- [ ] **Step 4: Fix NEXT_PUBLIC_SITE_URL fallbacks**

**Important:** Salon uses `NEXT_PUBLIC_SITE_URL` in `book/actions.ts` and `account/actions.ts`, but `NEXT_PUBLIC_SERVER_URL` in `payload.config.ts` and `Dockerfile`. Check which variable the app actually reads in each file and use the matching name.

In `apps/salon/src/app/(frontend)/[locale]/book/actions.ts`, replace line 148-149:
```typescript
// Before:
// success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/...`
// After:
success_url: `${requireSiteUrl()}/...`
```

Add helper at top of file:
```typescript
function requireSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL
  if (!url) throw new Error('NEXT_PUBLIC_SITE_URL is not set')
  return url
}
```

Do the same in `apps/salon/src/app/(frontend)/[locale]/(customer)/account/actions.ts` line 102:
```typescript
// Before: const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
if (!siteUrl) throw new Error('NEXT_PUBLIC_SITE_URL is not set')
```

- [ ] **Step 5: Commit**

```bash
git add apps/salon/src/payload.config.ts apps/salon/src/app/\(frontend\)/\[locale\]/book/actions.ts apps/salon/src/app/\(frontend\)/\[locale\]/\(customer\)/account/actions.ts
git commit -m "fix(salon): require critical env vars instead of empty-string fallbacks"
```

---

### Task 6: Create .dockerignore (Issue #2)

**Files:**
- Create: `apps/salon/.dockerignore`

- [ ] **Step 1: Create the file**

```
.git
node_modules
.next
.env*
!.env.example
*.md
test-results
coverage
.turbo
playwright-report
.playwright
```

- [ ] **Step 2: Commit**

```bash
git add apps/salon/.dockerignore
git commit -m "chore(salon): add .dockerignore"
```

---

### Task 7: Users collection access control (Issue #5)

**Files:**
- Modify: `apps/salon/src/collections/Users.ts:10-12`

- [ ] **Step 1: Restrict update and delete to admin users**

In `apps/salon/src/collections/Users.ts`, replace lines 10-12:

```typescript
// Before:
// update: ({ req }) => !!req.user,
// delete: ({ req }) => !!req.user,
// After:
update: ({ req }) => req.user?.collection === 'users',
delete: ({ req }) => req.user?.collection === 'users',
```

This ensures only Payload admin users (not customers) can update/delete users.

- [ ] **Step 2: Commit**

```bash
git add apps/salon/src/collections/Users.ts
git commit -m "fix(salon): restrict Users update/delete to admin users only"
```

---

### Task 8: Upgrade health check endpoint (Issue #6)

**Files:**
- Modify: `apps/salon/src/app/api/health/route.ts`

- [ ] **Step 1: Replace the health check with DB connectivity verification**

Replace the full contents of `apps/salon/src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.find({ collection: 'users', limit: 1 })
    return NextResponse.json({
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      db: 'connected',
    })
  } catch {
    return NextResponse.json(
      { status: 'error', db: 'disconnected' },
      { status: 503 },
    )
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/salon/src/app/api/health/route.ts
git commit -m "fix(salon): health check verifies DB connectivity"
```

---

### Task 9: Security headers middleware (Issue #7)

**Files:**
- Modify: `apps/salon/src/middleware.ts`

- [ ] **Step 1: Add security headers to the existing middleware**

Replace the full contents of `apps/salon/src/middleware.ts`:

```typescript
import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const securityHeaders: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.pexels.com https://*.payloadreserve.com",
    "font-src 'self' data:",
    "connect-src 'self' https://*.payloadreserve.com",
    "frame-ancestors 'none'",
  ].join('; '),
}

export default function middleware(request: NextRequest) {
  // Let intl middleware handle locale routing
  const response = intlMiddleware(request)

  // Add security headers to all responses
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|admin|media|favicon.ico).*)'],
}
```

Note: The CSP allows `unsafe-inline` and `unsafe-eval` because Payload's admin panel and Next.js require them. The `img-src` uses a wildcard — in development you may need to adjust this if your MinIO is on a different host. The matcher excludes `/api` and `/admin` routes — security headers for those routes should be set at the reverse proxy level (Caddy/Traefik in Coolify). Add HSTS, X-Content-Type-Options, and X-Frame-Options in Coolify's Caddy config to cover API routes globally.

The CSP `img-src` should be made dynamic if S3 images come from a non-payloadreserve.com domain. For production behind Coolify, all S3 images are served through the same domain, so the wildcard `https://*.payloadreserve.com` is sufficient.

- [ ] **Step 2: Commit**

```bash
git add apps/salon/src/middleware.ts
git commit -m "feat(salon): add security headers middleware"
```

---

### Task 10: Rate limiting utility (Issue #8)

**Files:**
- Create: `apps/salon/src/lib/rate-limit.ts`
- Modify: `apps/salon/src/endpoints/seed.ts`
- Modify: `apps/salon/src/app/api/stripe-webhook/route.ts`
- Modify: `apps/salon/src/app/api/customer-session/route.ts`

- [ ] **Step 1: Create the rate limit utility**

Create `apps/salon/src/lib/rate-limit.ts`:

```typescript
const store = new Map<string, { count: number; resetAt: number }>()

// Cleanup stale entries every 60s
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key)
  }
}, 60_000).unref()

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { success: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 }
  }

  entry.count++
  return { success: true, remaining: limit - entry.count }
}
```

- [ ] **Step 2: Apply rate limiting to seed endpoint**

In `apps/salon/src/endpoints/seed.ts`, add at the top of the handler (after auth check):

```typescript
import { rateLimit } from '@/lib/rate-limit'

// Inside handler, after auth validation:
const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
const { success } = rateLimit(`seed:${ip}`, 1, 60_000) // 1 req/min
if (!success) {
  return Response.json({ error: 'Rate limited' }, { status: 429 })
}
```

- [ ] **Step 3: Apply rate limiting to stripe webhook**

In `apps/salon/src/app/api/stripe-webhook/route.ts`, add after the signature check:

```typescript
import { rateLimit } from '@/lib/rate-limit'

// After signature validation:
const webhookIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
const { success } = rateLimit(`webhook:${webhookIp}`, 60, 60_000) // 60 req/min
if (!success) {
  return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
}
```

- [ ] **Step 4: Apply rate limiting to customer-session**

In `apps/salon/src/app/api/customer-session/route.ts`, add at the top of the handler:

```typescript
import { rateLimit } from '@/lib/rate-limit'

const sessionIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
const { success } = rateLimit(`session:${sessionIp}`, 10, 60_000) // 10 req/min
if (!success) {
  return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/salon/src/lib/rate-limit.ts apps/salon/src/endpoints/seed.ts apps/salon/src/app/api/stripe-webhook/route.ts apps/salon/src/app/api/customer-session/route.ts
git commit -m "feat(salon): add in-memory rate limiting to API endpoints"
```

---

### Task 11: File upload MIME type restrictions (Issue #10)

**Files:**
- Modify: `apps/salon/src/collections/Media.ts:15`

- [ ] **Step 1: Add mimeTypes to upload config**

In `apps/salon/src/collections/Media.ts`, replace `upload: true` (line 15) with:

```typescript
upload: {
  mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  disableLocalStorage: true,
},
```

- [ ] **Step 2: Create upload size limit middleware**

Create `apps/salon/src/lib/upload-size-limit.ts`:

```typescript
import { NextResponse } from 'next/server'

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024 // 5MB

export function checkUploadSize(req: Request): NextResponse | null {
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > MAX_UPLOAD_SIZE) {
    return NextResponse.json(
      { error: `File too large. Maximum size is ${MAX_UPLOAD_SIZE / 1024 / 1024}MB` },
      { status: 413 },
    )
  }
  return null
}
```

This utility can be called at the start of any upload-handling route. Since Payload's REST API catch-all route is auto-generated, the size limit is best enforced by the reverse proxy (Caddy in Coolify) with `request_body { max_size 5MB }`. The middleware serves as a defense-in-depth layer for any custom upload routes.

- [ ] **Step 3: Commit**

```bash
git add apps/salon/src/collections/Media.ts apps/salon/src/lib/upload-size-limit.ts
git commit -m "fix(salon): restrict media uploads to image MIME types + add size limit utility"
```

---

### Task 12: Password generation fix (Issue #11)

**Files:**
- Modify: `apps/salon/src/app/(frontend)/[locale]/book/actions.ts:108`

- [ ] **Step 1: Replace email fallback with random password**

In `apps/salon/src/app/(frontend)/[locale]/book/actions.ts`, add import at top:

```typescript
import crypto from 'crypto'
```

Replace line 108:
```typescript
// Before: password: data.password || data.email,
password: data.password || crypto.randomBytes(16).toString('hex'),
```

- [ ] **Step 2: Commit**

```bash
git add apps/salon/src/app/\(frontend\)/\[locale\]/book/actions.ts
git commit -m "fix(salon): generate random password instead of using email as default"
```

---

### Task 13: Transaction safety in hooks

**Files:**
- Modify: `apps/salon/src/hooks/reservationNotifications.ts:53-57`

- [ ] **Step 1: Add req to findByID call**

In `apps/salon/src/hooks/reservationNotifications.ts`, add `req` parameter to the `findByID` call at line 53:

```typescript
const populatedReservation = await req.payload.findByID({
  collection: 'reservations',
  id: reservation.id,
  depth: 1,
  req,
})
```

- [ ] **Step 2: Commit**

```bash
git add apps/salon/src/hooks/reservationNotifications.ts
git commit -m "fix(salon): pass req to findByID for transaction safety"
```

---

### Task 14: Sentry integration (Issue #15)

**Files:**
- Modify: `apps/salon/package.json` (add dependencies)
- Modify: `apps/salon/src/payload.config.ts`
- Create: `apps/salon/sentry.client.config.ts`
- Create: `apps/salon/sentry.server.config.ts`
- Modify: `apps/salon/next.config.mjs`

- [ ] **Step 1: Install Sentry packages**

```bash
cd apps/salon && pnpm add @sentry/nextjs @payloadcms/plugin-sentry
```

- [ ] **Step 2: Create sentry.client.config.ts**

Create `apps/salon/sentry.client.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs'

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  })
}
```

- [ ] **Step 3: Create sentry.server.config.ts**

Create `apps/salon/sentry.server.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs'

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
  })
}
```

- [ ] **Step 4: Add Sentry plugin to payload.config.ts**

In `apps/salon/src/payload.config.ts`, add imports:

```typescript
import * as Sentry from '@sentry/nextjs'
import { sentryPlugin } from '@payloadcms/plugin-sentry'
```

Add to the `plugins` array (alongside existing plugins):

```typescript
...(process.env.NEXT_PUBLIC_SENTRY_DSN
  ? [sentryPlugin({ Sentry })]
  : []),
```

- [ ] **Step 5: Wrap next.config.mjs with Sentry**

In `apps/salon/next.config.mjs`, add import:

```javascript
import { withSentryConfig } from '@sentry/nextjs'
```

Change the export line (last line) from:
```javascript
export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
```
To:
```javascript
const payloadConfig = withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
export default withSentryConfig(payloadConfig, { silent: true, disableLogger: true })
```

- [ ] **Step 6: Commit**

```bash
git add apps/salon/package.json apps/salon/sentry.client.config.ts apps/salon/sentry.server.config.ts apps/salon/src/payload.config.ts apps/salon/next.config.mjs
git commit -m "feat(salon): integrate Sentry error tracking"
```

---

### Task 15: Verify salon builds

- [ ] **Step 1: Type-check**

```bash
cd apps/salon && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 2: Build**

```bash
cd /home/sam/projects/reservation-demo && pnpm build:salon
```
Expected: successful build

- [ ] **Step 3: Commit any fixes needed**

If type-check or build fails, fix issues and commit.

---

## Chunk 3: Phases 3-5 — Hotel, Restaurant, Events Replication

### Task 16: Hotel — Apply all salon fixes

**Files:**
- Modify: `apps/hotel/src/payload.config.ts:42,54`
- Create: `apps/hotel/.dockerignore`
- Modify: `apps/hotel/src/collections/Users.ts:10-12`
- Modify: `apps/hotel/src/app/api/health/route.ts`
- Modify: `apps/hotel/src/middleware.ts`
- Create: `apps/hotel/src/lib/rate-limit.ts`
- Modify: `apps/hotel/src/endpoints/seed.ts`
- Modify: `apps/hotel/src/app/api/stripe-webhook/route.ts`
- Modify: `apps/hotel/src/app/api/customer-session/route.ts`
- Modify: `apps/hotel/src/collections/Media.ts:15`
- Modify: `apps/hotel/src/app/(frontend)/[locale]/book/actions.ts:154`
- Modify: `apps/hotel/src/hooks/reservationNotifications.ts:41`
- Modify: `apps/hotel/next.config.mjs`
- Modify: `apps/hotel/package.json`
- Create: `apps/hotel/sentry.client.config.ts`
- Create: `apps/hotel/sentry.server.config.ts`

- [ ] **Step 1: Add requireEnv and fix env fallbacks in payload.config.ts**

Same pattern as salon Task 5. Replace `process.env.PAYLOAD_SECRET || ''` and `process.env.DATABASE_URL || ''` with `requireEnv()`. Also add S3 and SMTP validation.

- [ ] **Step 2: Fix server URL fallbacks in book/actions.ts and account/actions.ts**

**Important:** Hotel uses `NEXT_PUBLIC_SERVER_URL` (not `NEXT_PUBLIC_SITE_URL`). Check the actual variable name in each file:
- `apps/hotel/src/app/(frontend)/[locale]/book/actions.ts` — uses `process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002'`
- `apps/hotel/src/app/(frontend)/[locale]/(customer)/account/actions.ts` — check which variable is used

Create the helper with the correct variable name for hotel:
```typescript
function requireServerUrl(): string {
  const url = process.env.NEXT_PUBLIC_SERVER_URL
  if (!url) throw new Error('NEXT_PUBLIC_SERVER_URL is not set')
  return url
}
```

- [ ] **Step 3: Create .dockerignore**

Copy salon's `.dockerignore` to `apps/hotel/.dockerignore`.

- [ ] **Step 4: Fix Users access control**

Same change as salon Task 7 — restrict `update` and `delete` to `req.user?.collection === 'users'`.

- [ ] **Step 5: Upgrade health check**

Same change as salon Task 8 — add DB query to health check.

- [ ] **Step 6: Add security headers to middleware**

Same pattern as salon Task 9 — chain security headers with intl middleware.

- [ ] **Step 7: Create rate-limit.ts and apply to endpoints**

Copy `apps/salon/src/lib/rate-limit.ts` to `apps/hotel/src/lib/rate-limit.ts`. Apply to seed, webhook, customer-session endpoints (same as salon Task 10).

- [ ] **Step 8: Add mimeTypes to Media upload config**

Same as salon Task 11.

- [ ] **Step 9: Fix password generation**

In `apps/hotel/src/app/(frontend)/[locale]/book/actions.ts` line 154, replace `data.password || data.email` with `data.password || crypto.randomBytes(16).toString('hex')`.

- [ ] **Step 10: Fix transaction safety in hooks**

In `apps/hotel/src/hooks/reservationNotifications.ts` line 41, add `req` to the `findByID` call.

- [ ] **Step 11: Add date validation (hotel-specific)**

In `apps/hotel/src/app/(frontend)/[locale]/book/actions.ts`, before reservation creation, add:

```typescript
const checkIn = new Date(data.checkInDate)
const checkOut = new Date(data.checkOutDate)
if (checkOut <= checkIn) throw new Error('Check-out must be after check-in')
if (checkIn < new Date(new Date().toISOString().split('T')[0])) {
  throw new Error('Check-in cannot be in the past')
}
```

- [ ] **Step 12: Install and configure Sentry**

```bash
cd apps/hotel && pnpm add @sentry/nextjs @payloadcms/plugin-sentry
```

Copy `sentry.client.config.ts` and `sentry.server.config.ts` from salon. Add `sentryPlugin` to payload.config.ts. Wrap next.config.mjs with `withSentryConfig`. Same pattern as salon Task 14.

- [ ] **Step 13: Fix S3 bucket name in .env.example (Issue #14)**

In `apps/hotel/.env.example`, ensure `S3_BUCKET=hotel-demo` (not `salon-demo`).

- [ ] **Step 14: Verify build**

```bash
cd /home/sam/projects/reservation-demo && pnpm build:hotel
```

- [ ] **Step 15: Commit**

```bash
git add apps/hotel/
git commit -m "fix(hotel): apply all production readiness fixes from salon reference"
```

---

### Task 17: Restaurant — Apply all salon fixes

**Files:**
- Same file list as hotel, plus:
- Create: `apps/restaurant/src/app/api/health/route.ts` (does not exist)
- Modify: `apps/restaurant/Dockerfile:29` (ARG name)

- [ ] **Step 1: Apply all shared fixes (steps 1-9, 12 from Task 16)**

Same changes as hotel: requireEnv, .dockerignore, Users access, security headers, rate limiting, Media mimeTypes, password generation, Sentry.

**Important env var note:** Restaurant uses `NEXT_PUBLIC_SITE_URL` in `book/actions.ts` (line 143) AND in `account/actions.ts` (line 97). Both need the localhost fallback removed. Don't miss `apps/restaurant/src/app/(frontend)/[locale]/(customer)/account/actions.ts`.

Note: Restaurant's `reservationNotifications.ts` already passes `req` to `findByID` — no fix needed there.

- [ ] **Step 2: Create health check endpoint (restaurant-specific)**

Create `apps/restaurant/src/app/api/health/route.ts` with the same content as salon's upgraded health check (Task 8).

- [ ] **Step 3: Fix Dockerfile build arg name (restaurant-specific)**

In `apps/restaurant/Dockerfile` line 29, the ARG `RESTAURANT_NEXT_PUBLIC_SERVER_URL` is mapped to `NEXT_PUBLIC_SERVER_URL` on line 31 — this is fine functionally. If you want consistency, update the OneDev buildspec to match. No code change needed in the Dockerfile itself since the ENV mapping handles it.

- [ ] **Step 4: Verify build**

```bash
cd /home/sam/projects/reservation-demo && pnpm build:restaurant
```

- [ ] **Step 5: Commit**

```bash
git add apps/restaurant/
git commit -m "fix(restaurant): apply all production readiness fixes + add health check"
```

---

### Task 18: Events — Apply all salon fixes

**Files:**
- Same file list as hotel, plus:
- Create: `apps/events/src/app/api/health/route.ts` (does not exist)

- [ ] **Step 1: Apply all shared fixes**

Same changes as hotel: requireEnv, .dockerignore, Users access, security headers, rate limiting, Media mimeTypes, Sentry.

**Important env var note:** Events uses `NEXT_PUBLIC_SITE_URL` in `book/actions.ts` (line 79) but `NEXT_PUBLIC_SERVER_URL` in `payload.config.ts` (line 170). Check each file for the correct variable name when creating the require helper. Both files need their fallbacks removed.

Note for password fix: Events uses nested structure at line 48:
```typescript
// Before: password: data.customer.password || data.customer.email,
password: data.customer.password || crypto.randomBytes(16).toString('hex'),
```

Note: Events' `reservationNotifications.ts` already passes `req` — no fix needed.

- [ ] **Step 2: Create health check endpoint (events-specific)**

Create `apps/events/src/app/api/health/route.ts` with the same content as salon's upgraded health check.

- [ ] **Step 3: Verify build**

```bash
cd /home/sam/projects/reservation-demo && pnpm build:events
```

- [ ] **Step 4: Commit**

```bash
git add apps/events/
git commit -m "fix(events): apply all production readiness fixes + add health check"
```

---

## Chunk 4: Phase 6 — Landing App Fixes

### Task 19: Landing — Environment validation (Issue #3)

**Files:**
- Modify: `apps/landing/src/payload.config.ts`

- [ ] **Step 1: Add requireEnv and apply to critical vars**

In `apps/landing/src/payload.config.ts`, add the same `requireEnv` helper. Apply to:
- `PAYLOAD_SECRET` (line 53)
- `DATABASE_URL` (line 58)

Note: Coolify and Turnstile vars are already validated at usage point in their respective modules, so `requireEnv` for those is optional but recommended.

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/payload.config.ts
git commit -m "fix(landing): require critical env vars at startup"
```

---

### Task 20: Landing — .dockerignore and security headers

**Files:**
- Create: `apps/landing/.dockerignore`
- Modify: `apps/landing/src/middleware.ts`

- [ ] **Step 1: Create .dockerignore**

Copy salon's `.dockerignore` to `apps/landing/.dockerignore`.

- [ ] **Step 2: Add security headers to middleware**

The landing middleware is more complex (sets `x-locale` header). Integrate security headers into the existing middleware at `apps/landing/src/middleware.ts`:

Integrate security headers into the existing middleware, preserving the working pathname-based locale detection:

```typescript
import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const securityHeaders: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.pexels.com https://*.payloadreserve.com",
    "font-src 'self' data:",
    "connect-src 'self' https://*.payloadreserve.com",
    "frame-src https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
  ].join('; '),
}

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request)

  // Preserve existing pathname-based locale detection
  const pathname = request.nextUrl.pathname
  const firstSegment = pathname.split('/')[1]
  const locale = (routing.locales as readonly string[]).includes(firstSegment)
    ? firstSegment
    : routing.defaultLocale
  response.headers.set('x-locale', locale)

  // Add security headers
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }

  return response
}

export const config = {
  matcher: ['/((?!docs|api|admin|_next|_vercel|media|favicon\\.ico|.*\\..*).*)'],
}
```

Note: CSP includes `https://challenges.cloudflare.com` for Turnstile iframe. The locale detection uses the existing pathname-based approach (not response headers).

- [ ] **Step 3: Commit**

```bash
git add apps/landing/.dockerignore apps/landing/src/middleware.ts
git commit -m "fix(landing): add .dockerignore and security headers middleware"
```

---

### Task 21: Landing — Sentry integration

**Files:**
- Modify: `apps/landing/package.json`
- Modify: `apps/landing/src/payload.config.ts`
- Create: `apps/landing/sentry.client.config.ts`
- Create: `apps/landing/sentry.server.config.ts`
- Modify: `apps/landing/next.config.ts`

- [ ] **Step 1: Install and configure Sentry**

Same pattern as salon Task 14. Install packages, create config files, add plugin, wrap next.config.

Note: Landing uses `next.config.ts` (not `.mjs`), so the wrapping syntax is slightly different:

```typescript
import { withSentryConfig } from '@sentry/nextjs'
// ... existing config ...
const payloadConfig = withPayload(withNextIntl(nextConfig))
export default withSentryConfig(payloadConfig, { silent: true, disableLogger: true })
```

- [ ] **Step 2: Commit**

```bash
git add apps/landing/package.json apps/landing/sentry.client.config.ts apps/landing/sentry.server.config.ts apps/landing/src/payload.config.ts apps/landing/next.config.ts
git commit -m "feat(landing): integrate Sentry error tracking"
```

---

### Task 21b: Landing — Health check upgrade (Spec 6.3)

**Files:**
- Modify: `apps/landing/src/app/api/health/route.ts` (if it exists, otherwise create it)

- [ ] **Step 1: Upgrade health check to verify DB + Coolify reachability**

```typescript
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  const checks: Record<string, string> = {}

  try {
    const payload = await getPayload({ config })
    await payload.find({ collection: 'demo-instances', limit: 1 })
    checks.db = 'connected'
  } catch {
    checks.db = 'disconnected'
  }

  // Optional: check Coolify API reachability
  const coolifyUrl = process.env.COOLIFY_API_URL
  if (coolifyUrl) {
    try {
      const res = await fetch(`${coolifyUrl}/api/v1/healthcheck`, {
        signal: AbortSignal.timeout(5000),
      })
      checks.coolify = res.ok ? 'reachable' : 'unreachable'
    } catch {
      checks.coolify = 'unreachable'
    }
  }

  const healthy = checks.db === 'connected'
  return NextResponse.json(
    { status: healthy ? 'ok' : 'error', uptime: Math.floor(process.uptime()), ...checks },
    { status: healthy ? 200 : 503 },
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/app/api/health/route.ts
git commit -m "fix(landing): upgrade health check with DB and Coolify connectivity"
```

---

### Task 22: Landing — CSRF/Origin validation (Issue #19)

**Files:**
- Modify: `apps/landing/src/app/api/demo/create/route.ts`

- [ ] **Step 1: Add Origin header check**

In `apps/landing/src/app/api/demo/create/route.ts`, add near the top of the POST handler (before rate limiting):

```typescript
// CSRF protection: block cross-origin browser requests
const origin = req.headers.get('origin')
const allowedOrigin = process.env.NEXT_PUBLIC_SERVER_URL
if (origin && allowedOrigin && !origin.startsWith(allowedOrigin)) {
  return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
}
```

Note: Requests with no Origin header (curl, server-side) pass through intentionally.

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/app/api/demo/create/route.ts
git commit -m "fix(landing): add CSRF origin validation to demo create endpoint"
```

---

### Task 23: Landing — Email failure handling (Issue #17)

**Files:**
- Modify: `apps/landing/src/lib/provision-demo.ts:314-316`
- Modify: Landing demo status type (if in `packages/types` or landing collections)

- [ ] **Step 1: Update email failure to set distinct status**

In `apps/landing/src/lib/provision-demo.ts`, find the email failure catch block (around line 314). Change from:

```typescript
} catch (err) {
  console.error(`[demo/${demoId}] email failed: ${(err as Error)?.message ?? 'Unknown error'}`)
}
```

To:

```typescript
} catch (err) {
  console.error(`[demo/${demoId}] email failed: ${(err as Error)?.message ?? 'Unknown error'}`)
  // Update status to indicate email failed — credentials must be shown inline
  await payload.update({
    collection: 'demo-instances',
    id: demoId,
    data: { status: 'ready_email_failed' as DemoStatus },
  })
}
```

- [ ] **Step 2: Add `ready_email_failed` to the status options**

Find the demo-instances collection config (or the DemoStatus type) and add `ready_email_failed` as a valid status value. Update the frontend status poller to handle this status by showing credentials inline.

- [ ] **Step 3: Commit**

```bash
git add apps/landing/
git commit -m "fix(landing): distinguish email failure from successful demo provisioning"
```

---

### Task 24: Landing — Orphaned resource cleanup (Issue #18)

**Files:**
- Modify: `apps/landing/src/app/api/demo/cleanup/route.ts`
- Modify: Landing demo-instances collection (add cleanupAttempts field)

- [ ] **Step 1: Add cleanupAttempts field to demo-instances collection**

Add a `cleanupAttempts` number field (default 0) and a `cleanup_failed` status option to the demo-instances collection.

- [ ] **Step 2: Update cleanup logic**

In `apps/landing/src/app/api/demo/cleanup/route.ts`, modify the cleanup loop:

```typescript
// On partial failure:
const attempts = (demo.cleanupAttempts || 0) + 1
if (attempts >= 3) {
  await payload.update({
    collection: 'demo-instances',
    id: demo.id,
    data: { status: 'cleanup_failed', cleanupAttempts: attempts },
  })
  console.error(`[cleanup] demo ${demo.id} failed 3+ times, marking as cleanup_failed`)
} else {
  await payload.update({
    collection: 'demo-instances',
    id: demo.id,
    data: { cleanupAttempts: attempts },
  })
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/landing/
git commit -m "fix(landing): track cleanup attempts and mark persistent failures"
```

---

### Task 25: Landing — Robots.txt & sitemap (Issue #21)

**Files:**
- Create: `apps/landing/public/robots.txt`
- Create: `apps/landing/src/app/sitemap.ts`

- [ ] **Step 1: Create robots.txt**

Create `apps/landing/public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://payloadreserve.com/sitemap.xml
```

- [ ] **Step 2: Create dynamic sitemap**

Create `apps/landing/src/app/sitemap.ts`:

```typescript
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadreserve.com'

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/en`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/fr`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/en/demo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/fr/demo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/en/demos/salon`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/demos/hotel`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/demos/restaurant`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/demos/events`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/landing/public/robots.txt apps/landing/src/app/sitemap.ts
git commit -m "feat(landing): add robots.txt and sitemap for SEO"
```

---

### Task 26: Landing — Verify build

- [ ] **Step 1: Build landing**

```bash
cd /home/sam/projects/reservation-demo && pnpm build:landing
```

- [ ] **Step 2: Fix any build errors and commit**

---

## Chunk 5: Phases 7-8 — Docs App & Cross-Cutting Infrastructure

### Task 27: Docs — .dockerignore and security headers

**Files:**
- Create: `apps/docs/.dockerignore`
- Create: `apps/docs/src/middleware.ts`

- [ ] **Step 1: Create .dockerignore**

Copy salon's `.dockerignore` to `apps/docs/.dockerignore`.

- [ ] **Step 2: Create security headers middleware**

Docs app has no existing middleware. Create `apps/docs/src/middleware.ts`:

```typescript
import { type NextRequest, NextResponse } from 'next/server'

const securityHeaders: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next|favicon\\.ico|.*\\..*).*)'],
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/docs/.dockerignore apps/docs/src/middleware.ts
git commit -m "fix(docs): add .dockerignore and security headers middleware"
```

---

### Task 28: Docs — Sentry (Issue #15)

**Files:**
- Modify: `apps/docs/package.json`
- Create: `apps/docs/sentry.client.config.ts`
- Create: `apps/docs/sentry.server.config.ts`
- Modify: `apps/docs/next.config.ts`

- [ ] **Step 1: Install Sentry**

```bash
cd apps/docs && pnpm add @sentry/nextjs
```

Note: No `@payloadcms/plugin-sentry` since docs has no Payload.

- [ ] **Step 2: Create Sentry config files**

Copy `sentry.client.config.ts` and `sentry.server.config.ts` from salon (same content).

- [ ] **Step 3: Wrap next.config.ts**

In `apps/docs/next.config.ts`:

```typescript
import { withSentryConfig } from '@sentry/nextjs'
// ... existing config ...
export default withSentryConfig(withMDX(nextConfig), { silent: true, disableLogger: true })
```

- [ ] **Step 4: Commit**

```bash
git add apps/docs/
git commit -m "feat(docs): integrate Sentry error tracking"
```

---

### Task 29: Docs — OneDev CI job (Issue #22)

**Files:**
- Modify: `.onedev-buildspec.yml`

- [ ] **Step 1: Add Build Docs Image job**

In `.onedev-buildspec.yml`, add a new job after the existing build jobs (following the same pattern). Add both a "Build Docs Image" (on main push) and "Release Docs Image" (on tag) job:

```yaml
- name: Build Docs Image
  steps:
  - !BuildImageStep
    name: build and push
    tags: |
      onedev.payloadreserve.com/payloadreserve-demos/docs:@build_number@
      onedev.payloadreserve.com/payloadreserve-demos/docs:latest
    publish: true
    buildContext: .
    dockerfile: apps/docs/Dockerfile
    registryLogins:
    - registryUrl: onedev.payloadreserve.com
      userName: '@job_token@'
      password: '@secret:ONEDEV_PASSWORD@'
  triggers:
  - !BranchUpdateTrigger
    branches: main
  retryCondition: never
  maxRetries: 3
  retryDelay: 30
  timeout: 3600
```

And the release version:

```yaml
- name: Release Docs Image
  steps:
  - !BuildImageStep
    name: build and push
    tags: |
      onedev.payloadreserve.com/payloadreserve-demos/docs:@tag@
      onedev.payloadreserve.com/payloadreserve-demos/docs:latest
    publish: true
    buildContext: .
    dockerfile: apps/docs/Dockerfile
    registryLogins:
    - registryUrl: onedev.payloadreserve.com
      userName: '@job_token@'
      password: '@secret:ONEDEV_PASSWORD@'
  triggers:
  - !TagCreateTrigger {}
  retryCondition: never
  maxRetries: 3
  retryDelay: 30
  timeout: 3600
```

- [ ] **Step 2: Commit**

```bash
git add .onedev-buildspec.yml
git commit -m "ci: add docs app build and release jobs to OneDev"
```

---

### Task 30: Coolify SDK retry logic (Issue #12)

**Files:**
- Modify: `packages/coolify-sdk/package.json`
- Modify: `packages/coolify-sdk/src/client.ts:12-35`

- [ ] **Step 1: Install p-retry**

```bash
cd packages/coolify-sdk && pnpm add p-retry
```

- [ ] **Step 2: Refactor request method with retry wrapper**

In `packages/coolify-sdk/src/client.ts`, rename the existing `request` method to `_doRequest` and create a new `request` that wraps it with retries:

```typescript
import pRetry from 'p-retry'

// Rename existing method:
private async _doRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  // ... existing implementation (lines 13-35) ...
}

// New retry wrapper:
private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
  return pRetry(
    () => this._doRequest<T>(method, path, body),
    { retries: 3, minTimeout: 1000, factor: 2, randomize: true },
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/coolify-sdk/
git commit -m "feat(coolify-sdk): add retry logic with exponential backoff"
```

---

### Task 31: CI/CD — Add tests to pipeline (Issue #23)

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Add test step to CI workflow**

In `.github/workflows/ci.yml`, add a test step after the build step:

```yaml
    - name: Run salon integration tests
      env:
        PAYLOAD_SECRET: ci-test-secret-not-real
        DATABASE_URL: mongodb://localhost:27017/test-salon-ci
        S3_PREFIX: test
      run: pnpm --filter=salon test:int
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add integration tests to GitHub Actions pipeline"
```

---

### Task 32: Turnstile bypass fix

**Files:**
- Modify: `apps/landing/src/lib/turnstile.ts:8-10`

- [ ] **Step 1: Remove development bypass**

In `apps/landing/src/lib/turnstile.ts`, remove the lines:

```typescript
// Remove these lines:
if (!secret) {
    if (process.env.NODE_ENV === 'development') return true
    return false
}
```

Replace with:

```typescript
if (!secret) return false
```

**Important:** The Turnstile secret is read from the `InfrastructureSetting` Payload global (a DB field), NOT from an env var. For local development, set the always-passes test key (`1x0000000000000000000000000000000AA`) in the Payload admin panel's Infrastructure Settings, or include it in the seed data. The `.env.example` `TURNSTILE_SECRET_KEY` entry is for reference only — the actual `turnstile.ts` reads from `settings?.turnstileSecretKey` which comes from the Payload DB.

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/lib/turnstile.ts
git commit -m "fix(landing): remove turnstile dev bypass, use test keys instead"
```

---

### Task 33: Backup strategy documentation (Issue #16)

**Files:**
- Create: `docs/backup-strategy.md`

- [ ] **Step 1: Create the backup strategy document**

Create `docs/backup-strategy.md`:

```markdown
# Backup & Disaster Recovery Strategy

## MongoDB Backups

### Daily Backups
Set up a cron job on the Hetzner VPS (or via Coolify scheduled task):

```bash
# Run daily at 2 AM UTC
0 2 * * * mongodump --uri="mongodb://user:pass@host:27017" --out=/backups/mongo/$(date +\%Y-\%m-\%d)
```

### Retention
- Keep 7 daily backups
- Keep 4 weekly backups (Sunday)
- Delete older backups automatically:

```bash
# Cleanup script (run daily after backup)
find /backups/mongo -maxdepth 1 -mtime +7 -type d -exec rm -rf {} \;
```

### Restore Procedure

```bash
mongorestore --uri="mongodb://user:pass@host:27017" --drop /backups/mongo/YYYY-MM-DD/
```

## S3/MinIO

### Enable Versioning
In MinIO console or via mc:
```bash
mc version enable myminio/bucket-name
```

### Recover Deleted Objects
```bash
mc ls --versions myminio/bucket-name/prefix/
mc cp --version-id=<id> myminio/bucket-name/file.jpg /tmp/recovered.jpg
```

## Application Rollback

### Via Coolify
1. Go to the app service in Coolify
2. Click "Deployments"
3. Select a previous deployment
4. Click "Redeploy"

### Via Docker Image Tags
Each git tag creates a versioned image. To rollback:
1. In Coolify, change the image tag to the previous version
2. Redeploy the service
```

- [ ] **Step 2: Commit**

```bash
git add -f docs/backup-strategy.md
git commit -m "docs: add backup and disaster recovery strategy"
```

---

### Task 34: Final verification

- [ ] **Step 1: Build all apps**

```bash
pnpm build
```

- [ ] **Step 2: Run salon tests**

```bash
cd apps/salon && pnpm test:int
```

- [ ] **Step 3: Verify git status is clean**

```bash
git status
```

- [ ] **Step 4: Tag a release**

```bash
git tag -a v1.0.0-rc1 -m "Production readiness fixes complete"
```

---

## Skipped Issues (Already Resolved)

### Issue #9: Landing rate limiting IP spoofable — NO ACTION NEEDED

The code at `apps/landing/src/app/api/demo/create/route.ts` lines 47-51 already uses the correct IP extraction order:
```typescript
const requestIp =
  req.headers.get('cf-connecting-ip') ??
  req.headers.get('x-real-ip') ??
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
  'unknown'
```
This was flagged in the original audit but the code was already correct. No changes needed.

### Issue #20: GraphQL Playground exposed — NO ACTION NEEDED

Payload CMS 3.x defaults `graphQL.disablePlaygroundInProduction` to `true`. The auto-generated route file must not be modified. No changes needed.
