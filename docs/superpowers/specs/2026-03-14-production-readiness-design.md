# Production Readiness — Fix All 23 Issues

**Date:** 2026-03-14
**Status:** Approved
**Scope:** All apps (salon, hotel, restaurant, events, landing, docs) + infrastructure

## Context

A comprehensive production readiness audit identified 23 issues across the monorepo. This spec defines the fix plan using a salon-first reference implementation approach, then replicating to each app sequentially.

## Decisions Made During Brainstorming

| Decision | Choice |
|----------|--------|
| External actions | Include code + step-by-step external service instructions |
| Git history | `git filter-repo` + force-push to GitHub and OneDev |
| Fix order | Salon first (reference), then replicate app-by-app |
| Monitoring | Sentry.io free tier + `@payloadcms/plugin-sentry` |
| Rate limiting | In-memory store (per-instance, resets on restart) |
| Security headers | Next.js middleware in each app |
| Coolify SDK retries | `p-retry` wrapped in SDK (transparent to consumers) |
| Upload limit | 5MB across all demo apps |

---

## Phase 1: Git History Scrub & Secret Rotation

**Scope:** Cross-cutting (one-time, done first)
**Issues covered:** #1

### 1.1 Remove secrets from git history

1. Install `git-filter-repo` if not present
2. Inventory committed secret files:
   - `.env` (root)
   - `apps/salon/.env`
   - `apps/landing/.env.local`
   - `apps/hotel/.env`
   - `apps/restaurant/.env`
   - `apps/events/.env`
3. Run `git filter-repo --path <file> --invert-paths` for each file
4. Force-push to both remotes:
   - GitHub: `git push origin --force --all && git push origin --force --tags`
   - OneDev: `git push onedev --force --all && git push onedev --force --tags`

### 1.2 Update `.gitignore`

Ensure these patterns are present at the root level:
```
.env
.env.*
.env.local
.env.production
.env.staging
!.env.example
```

### 1.3 Rotate all leaked credentials

| Service | Action | Where |
|---------|--------|-------|
| Stripe | Regenerate test API keys + webhook secrets | Stripe Dashboard → API Keys |
| Gmail | Revoke app password, generate new one | Google Account → Security → App Passwords |
| Coolify | Regenerate API token | Coolify UI → Settings → API Tokens |
| Cloudflare | Rotate Turnstile site key + secret key | Cloudflare Dashboard → Turnstile |
| Payload | Generate new 64-char random secrets per app | `openssl rand -hex 32` per app |
| Cleanup secret | Generate new random secret | `openssl rand -hex 32` |
| SEED_SECRET | Generate new random secret per app | `openssl rand -hex 32` per app |

### 1.4 Update `.env.example` files

Every app's `.env.example` must list every variable with descriptions, grouped by category. No real values.

### 1.5 Create `docs/env-vars.md`

Reference document listing all env vars per app with descriptions, required/optional status, and example format.

---

## Phase 2: Salon App — Reference Implementation

**Scope:** `apps/salon/`
**Issues covered:** #2, #3, #5, #6, #7, #8, #10, #11, #15, #20

### 2a. Environment & Startup Validation (Issue #3)

Create a `requireEnv()` helper that throws on missing value. Apply to:
- `PAYLOAD_SECRET`
- `DATABASE_URL`
- `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`

Validate `NEXT_PUBLIC_SITE_URL` is set (remove `|| 'http://localhost:3000'` fallback).

Validate SMTP vars are all-or-nothing: if `SMTP_HOST` is set, require `SMTP_FROM`, `SMTP_USER`, `SMTP_PASS`.

### 2b. `.dockerignore` (Issue #2)

Create `apps/salon/.dockerignore`:
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

### 2c. Users Collection Access Control (Issue #5)

In `src/collections/Users.ts`, restrict:
```typescript
update: ({ req }) => req.user?.collection === 'users',
delete: ({ req }) => req.user?.collection === 'users',
```

Keep `read: ({ req }) => !!req.user` and `create: () => false`.

### 2d. Health Check Endpoint (Issue #6)

Upgrade `src/app/api/health/route.ts` to:
- Query DB: `payload.find({ collection: 'users', limit: 1 })`
- Return `{ status: 'ok', uptime: process.uptime(), db: 'connected' }`
- Return 503 with `{ status: 'error', db: 'disconnected' }` on failure

### 2e. Security Headers Middleware (Issue #7)

Create or extend `src/middleware.ts` to set on all responses:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 0`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` — permissive for Payload admin + frontend, block unsafe-inline where possible
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Must integrate with existing `next-intl` middleware (chain them).

### 2f. Rate Limiting (Issue #8)

Create `src/lib/rate-limit.ts`:
- In-memory `Map<string, { count: number, resetAt: number }>` with TTL cleanup
- Export `rateLimit(key: string, limit: number, windowMs: number): { success: boolean, remaining: number }`
- Cleanup stale entries on a 60s interval

Apply to:
- `/api/seed`: 1 req/min per IP
- `/api/stripe-webhook`: 60 req/min per IP
- `/api/customer-session`: 10 req/min per IP

### 2g. File Upload Limits (Issue #10)

In `src/collections/Media.ts`, add to upload config:
```typescript
upload: {
  mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  staticDir: undefined, // uses S3
  filesizeLimit: 5 * 1024 * 1024, // 5MB
}
```

### 2h. Password Generation Fix (Issue #11)

In `src/app/(frontend)/[locale]/book/actions.ts`, replace:
```typescript
// Before
password: data.password || data.email
// After
password: data.password || crypto.randomBytes(16).toString('hex')
```

The generated password is included in the confirmation email already sent on booking.

### 2i. GraphQL Playground Disable (Issue #20)

In `src/app/(payload)/api/graphql-playground/route.ts`, wrap with environment check:
```typescript
if (process.env.NODE_ENV === 'production') {
  return NextResponse.json({ error: 'Not available' }, { status: 404 })
}
```

### 2j. Sentry Integration (Issue #15)

1. Install `@payloadcms/plugin-sentry`, `@sentry/nextjs`
2. Add to `payload.config.ts`:
   ```typescript
   sentryPlugin({ dsn: process.env.SENTRY_DSN })
   ```
3. Create `sentry.client.config.ts` and `sentry.server.config.ts`
4. Wrap `next.config.mjs` with `withSentryConfig()`
5. Add `SENTRY_DSN` to `.env.example`

---

## Phase 3: Hotel Replication

**Scope:** `apps/hotel/`
**Issues covered:** Same as Phase 2 + #14, transaction safety, date validation

### 3.1 Apply all salon fixes (2a–2j)

Copy patterns from salon for: env validation, `.dockerignore`, Users access control, health check, security headers, rate limiting, upload limits, password generation, GraphQL playground, Sentry.

### 3.2 Hotel-specific: S3 bucket name (Issue #14)

Fix `.env.example` to show correct bucket name. The actual `.env` is already removed from git (Phase 1), so this is just the example file.

### 3.3 Hotel-specific: Transaction safety

In `src/hooks/reservationNotifications.ts`, add `req` to nested `payload.findByID()`:
```typescript
const populatedReservation = await req.payload.findByID({
  collection: 'reservations',
  id: reservation.id,
  depth: 1,
  req, // Add this
})
```

### 3.4 Hotel-specific: Date validation

In `src/app/(frontend)/[locale]/book/actions.ts`, add validation before creating reservation:
```typescript
const start = new Date(data.checkInDate)
const end = new Date(data.checkOutDate)
const now = new Date()
if (end <= start) throw new Error('Check-out must be after check-in')
if (start < new Date(now.toISOString().split('T')[0])) throw new Error('Check-in cannot be in the past')
```

---

## Phase 4: Restaurant Replication

**Scope:** `apps/restaurant/`
**Issues covered:** Same as Phase 2 + missing health check, Dockerfile arg fix

### 4.1 Apply all salon fixes (2a–2j)

### 4.2 Restaurant-specific: Add health check endpoint

Create `src/app/api/health/route.ts` (does not exist yet) matching salon's pattern.

### 4.3 Restaurant-specific: Dockerfile arg name

In `Dockerfile`, rename `RESTAURANT_NEXT_PUBLIC_SERVER_URL` → `NEXT_PUBLIC_SERVER_URL` to match all other apps. Update OneDev buildspec if it references the old name.

---

## Phase 5: Events Replication

**Scope:** `apps/events/`
**Issues covered:** Same as Phase 2 + missing health check

### 5.1 Apply all salon fixes (2a–2j)

### 5.2 Events-specific: Add health check endpoint

Create `src/app/api/health/route.ts` (does not exist yet) matching salon's pattern.

---

## Phase 6: Landing App Fixes

**Scope:** `apps/landing/`
**Issues covered:** #2, #3, #7, #9, #13, #15, #17, #18, #19, #21

### 6.1 Environment validation (Issue #3)

Apply `requireEnv()` to: `PAYLOAD_SECRET`, `DATABASE_URL`, `COOLIFY_API_URL`, `COOLIFY_API_KEY`, `COOLIFY_PROJECT_UUID`, `COOLIFY_SERVER_UUID`, `TURNSTILE_SECRET_KEY`.

### 6.2 `.dockerignore` (Issue #2)

Same pattern as salon.

### 6.3 Health check upgrade

Upgrade existing `/api/health` to check DB + Coolify API reachability (HEAD request to Coolify base URL).

### 6.4 Security headers middleware (Issue #7)

Same pattern as salon.

### 6.5 Sentry integration (Issue #15)

Same pattern as salon.

### 6.6 Rate limiting IP extraction fix (Issue #9)

In `src/app/api/demo/create/route.ts`, update IP extraction order:
```typescript
const ip =
  req.headers.get('cf-connecting-ip') ||
  req.headers.get('x-real-ip') ||
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  'unknown'
```

### 6.7 CSRF/Origin validation (Issue #19)

In `src/app/api/demo/create/route.ts`, add Origin header check:
```typescript
const origin = req.headers.get('origin')
const allowed = process.env.NEXT_PUBLIC_SITE_URL
if (origin && allowed && !origin.startsWith(allowed)) {
  return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
}
```

### 6.8 Email failure handling (Issue #17)

In `src/lib/provision-demo.ts`, when email send fails:
- Update demo status to `ready_email_failed` instead of `ready`
- Add `ready_email_failed` to the DemoStatus type
- Frontend status poller shows credentials inline when this status is detected

### 6.9 Orphaned resource cleanup (Issue #18)

In cleanup logic:
- Only mark demo as `expired` when ALL cleanup steps succeed
- Add `cleanupAttempts` field to demo collection (number, default 0)
- Add `cleanup_failed` status for demos that fail 3+ consecutive cleanup attempts
- Increment `cleanupAttempts` on each partial failure

### 6.10 `.env.example` completeness (Issue #13)

Update to include every variable grouped by category:
- Core (PAYLOAD_SECRET, DATABASE_URL, NEXT_PUBLIC_SITE_URL)
- SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_FROM_NAME)
- S3 (S3_ENDPOINT, S3_BUCKET, S3_PREFIX, S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION)
- Coolify (COOLIFY_API_URL, COOLIFY_API_KEY, COOLIFY_PROJECT_UUID, COOLIFY_SERVER_UUID)
- Demo Config (DEMO_TTL_HOURS, MAX_ACTIVE_DEMOS, DEMO_PROTOCOL, DEMO_DOMAIN)
- Turnstile (NEXT_PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY)
- Stripe (STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY)
- MongoDB (MONGO_ROOT_USER, MONGO_ROOT_PASS, MONGO_HOST)
- Admin (ADMIN_EMAIL, ADMIN_PASSWORD, SEED_SECRET, CLEANUP_SECRET)

### 6.11 Robots.txt & Sitemap (Issue #21)

- Create `public/robots.txt`: disallow `/api`, `/admin`, allow everything else, reference sitemap
- Create `src/app/sitemap.ts`: dynamic sitemap for marketing pages (`/`, `/demo`, `/demos/*`)

---

## Phase 7: Docs App

**Scope:** `apps/docs/`
**Issues covered:** #2, #7, #15, #22

### 7.1 `.dockerignore`

Same pattern.

### 7.2 Security headers middleware

Same pattern (no i18n to integrate with — simpler).

### 7.3 Sentry

`@sentry/nextjs` only (no Payload plugin since docs has no Payload).

### 7.4 OneDev CI job (Issue #22)

Add to `.onedev-buildspec.yml`:
- "Build Docs Image" job (triggered on main push)
- "Release Docs Image" job (triggered on git tag)
- Same pattern as the other 5 app jobs, targeting `apps/docs/Dockerfile`

---

## Phase 8: Cross-Cutting Infrastructure

**Issues covered:** #12, #16, #23, Turnstile bypass fix

### 8a. Coolify SDK Retry Logic (Issue #12)

In `packages/coolify-sdk`:
1. Install `p-retry`
2. Wrap the internal `request()` method:
   ```typescript
   import pRetry from 'p-retry'

   private async request<T>(method, path, body?): Promise<T> {
     return pRetry(
       () => this._doRequest(method, path, body),
       { retries: 3, minTimeout: 1000, factor: 2, randomize: true }
     )
   }
   ```
3. Consumers (landing app) need no changes — retries are transparent

### 8b. CI/CD — Add Tests to Pipeline (Issue #23)

Update `.github/workflows/ci.yml`:
- After build step, run `pnpm --filter=salon test:int` (salon has integration tests)
- MongoDB service container is already configured
- Add `PAYLOAD_SECRET` and `DATABASE_URL` env vars for test runner

### 8c. Backup Documentation (Issue #16)

Create `docs/backup-strategy.md`:
- MongoDB: `mongodump` daily schedule, 7-day retention, `mongorestore` procedure
- S3/MinIO: enable versioning, document object recovery
- Application: Coolify rollback procedure (redeploy previous image tag)
- This is documentation only — actual cron jobs are configured in Coolify/VPS

### 8d. Turnstile Bypass Fix

In `apps/landing/src/lib/turnstile.ts`:
- Remove `if (process.env.NODE_ENV === 'development') return true`
- Use Cloudflare's always-passes test key (`1x0000000000000000000000000000000AA`) in `.env.example` for development

---

## Issue Coverage Matrix

| # | Issue | Phase |
|---|-------|-------|
| 1 | Secrets committed to git | 1 |
| 2 | No `.dockerignore` | 2b, 3.1, 4.1, 5.1, 6.2, 7.1 |
| 3 | Empty string env fallbacks | 2a, 3.1, 4.1, 5.1, 6.1 |
| 4 | `NEXT_PUBLIC_SITE_URL` localhost fallback | 2a, 3.1, 4.1, 5.1 |
| 5 | Users collection access control | 2c, 3.1, 4.1, 5.1 |
| 6 | Missing health check endpoints | 2d, 3.1, 4.2, 5.2 |
| 7 | No security headers | 2e, 3.1, 4.1, 5.1, 6.4, 7.2 |
| 8 | No rate limiting on demo apps | 2f, 3.1, 4.1, 5.1 |
| 9 | Landing rate limiting IP spoofable | 6.6 |
| 10 | No file upload size limits | 2g, 3.1, 4.1, 5.1 |
| 11 | Password defaults to email | 2h, 3.1, 4.1, 5.1 |
| 12 | Coolify SDK no retry logic | 8a |
| 13 | `.env.example` incomplete | 1.4, 6.10 |
| 14 | Hotel S3 bucket copy-paste error | 3.2 |
| 15 | No monitoring/observability | 2j, 3.1, 4.1, 5.1, 6.5, 7.3 |
| 16 | No backup strategy | 8c |
| 17 | Landing email failure silent | 6.8 |
| 18 | Orphaned resource cleanup | 6.9 |
| 19 | No CSRF on demo creation | 6.7 |
| 20 | GraphQL Playground exposed | 2i, 3.1, 4.1, 5.1 |
| 21 | No robots.txt/sitemap | 6.11 |
| 22 | No OneDev docs build job | 7.4 |
| 23 | CI runs no tests | 8b |
