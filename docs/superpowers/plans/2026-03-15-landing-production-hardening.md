# Landing App Production Hardening Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the landing app (`apps/landing/`) for production deployment — error handling, distributed cleanup state, Sentry observability, CF Access enforcement, and SEO.

**Architecture:** Incremental hardening — each task is independently deployable. No new dependencies. Uses existing Payload globals for distributed state, Sentry for observability, and Next.js metadata API for SEO.

**Tech Stack:** Next.js 15, Payload CMS 3.x, Sentry (`@sentry/nextjs`), Tailwind CSS, MongoDB (via Payload)

**Spec:** `docs/superpowers/specs/2026-03-15-landing-production-hardening-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/app/(frontend)/[locale]/error.tsx` | Client-side error boundary for unhandled frontend errors |
| Create | `src/app/(frontend)/[locale]/not-found.tsx` | 404 page for frontend routes |
| Modify | `src/globals/InfrastructureSettings.ts` | Add `lastCleanupAt` date field |
| Modify | `src/app/api/demo/cleanup/route.ts` | Replace in-memory cooldown with MongoDB-backed state |
| Modify | `sentry.client.config.ts` | DSN warning, 100% sampling, error replays |
| Modify | `sentry.server.config.ts` | DSN warning, 100% sampling |
| Modify | `src/app/api/demo/create/route.ts` | Add Sentry breadcrumbs and context |
| Modify | `src/app/api/demo/cleanup/route.ts` | Add Sentry breadcrumbs (same file as Task 2) |
| Modify | `src/app/api/demo/status/[id]/route.ts` | Add Sentry captureException |
| Modify | `src/middleware.ts` | Add CF Access production warning |
| Create | `src/utilities/seo.ts` | `buildAlternates()` hreflang/canonical helper |
| Modify | `src/app/(frontend)/[locale]/page.tsx` | Add `generateMetadata` with alternates |
| Modify | `src/app/(frontend)/[locale]/demo/page.tsx` | Add alternates to existing metadata |
| Modify | `src/app/(frontend)/[locale]/demos/[type]/page.tsx` | Add alternates to existing metadata |

---

## Chunk 1: Error Boundary + Distributed Cleanup State

### Task 1: Create Global Error Boundary

**Files:**
- Create: `apps/landing/src/app/(frontend)/[locale]/error.tsx`
- Create: `apps/landing/src/app/(frontend)/[locale]/not-found.tsx`

- [ ] **Step 1: Create `error.tsx`**

Create `apps/landing/src/app/(frontend)/[locale]/error.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="font-display text-3xl text-[#1C1917] dark:text-stone-50 mb-3">
          Something went wrong
        </h1>
        <p className="text-[#78716C] dark:text-stone-400 text-sm mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-violet-700 hover:bg-violet-600 text-white shadow-sm shadow-violet-400/20"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Create `not-found.tsx`**

Create `apps/landing/src/app/(frontend)/[locale]/not-found.tsx`:

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="font-display text-3xl text-[#1C1917] dark:text-stone-50 mb-3">
          Page not found
        </h1>
        <p className="text-[#78716C] dark:text-stone-400 text-sm mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-violet-700 hover:bg-violet-600 text-white shadow-sm shadow-violet-400/20"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Verify dev server starts without errors**

Run: `cd apps/landing && pnpm dev`

Expected: Server starts. Navigate to a non-existent route (e.g., `/en/does-not-exist`) — should show the not-found page with nav/footer from the layout.

- [ ] **Step 4: Commit**

```bash
git add apps/landing/src/app/\(frontend\)/\[locale\]/error.tsx apps/landing/src/app/\(frontend\)/\[locale\]/not-found.tsx
git commit -m "feat(landing): add global error boundary and 404 page"
```

---

### Task 2: Distributed Cleanup Cooldown via MongoDB

**Files:**
- Modify: `apps/landing/src/globals/InfrastructureSettings.ts` (line 198, before closing `]` of fields array)
- Modify: `apps/landing/src/app/api/demo/cleanup/route.ts` (lines 10-11, 13-20)

- [ ] **Step 1: Add `lastCleanupAt` field to InfrastructureSettings**

In `apps/landing/src/globals/InfrastructureSettings.ts`, add a new field after the closing `}` of the `type: 'tabs'` block (after line 198, before the `]` on line 199):

```typescript
    // After the tabs field (line 198), add:
    {
      name: 'lastCleanupAt',
      type: 'date',
      admin: { hidden: true },
    },
```

The `fields` array should now end with:
```typescript
      ],  // end of tabs
    },
    {
      name: 'lastCleanupAt',
      type: 'date',
      admin: { hidden: true },
    },
  ],  // end of fields
```

- [ ] **Step 2: Regenerate Payload types**

Run from monorepo root:
```bash
pnpm --filter=landing generate:types
```

Expected: `apps/landing/src/payload-types.ts` updates with `lastCleanupAt?: string | null` in the `InfrastructureSetting` type.

- [ ] **Step 3: Update cleanup route to use MongoDB-backed cooldown**

In `apps/landing/src/app/api/demo/cleanup/route.ts`:

Remove lines 10-11 (the module-level variables):
```typescript
// DELETE these two lines:
let lastCleanupAt = 0
const CLEANUP_COOLDOWN_MS = 60_000
```

Replace the cooldown check and reorder so auth runs before the cooldown write. The new `POST` function start:

```typescript
export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })
  const settings = await getInfraSettings(payload)
  // Note: getInfraSettings() uses context: { includeSecrets: true } to bypass
  // the afterRead masking hook, so settings.cleanupSecret has the real value.

  // Auth check FIRST — prevent unauthenticated callers from triggering cooldown writes
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  const secret = settings.cleanupSecret || ''
  if (!token || !secret || token.length !== secret.length ||
      !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(secret))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Distributed cooldown — stored in MongoDB via InfrastructureSettings global
  const lastCleanup = settings.lastCleanupAt ? new Date(settings.lastCleanupAt).getTime() : 0
  if (Date.now() - lastCleanup < 60_000) {
    return NextResponse.json(
      { error: 'Cleanup already ran recently. Try again later.' },
      { status: 429 },
    )
  }

  // Optimistic lock — update timestamp before doing work
  await payload.updateGlobal({
    slug: 'infrastructure-settings',
    data: { lastCleanupAt: new Date().toISOString() },
  })

  // ... rest of existing code (expired query, cleanup loop, queue processing) unchanged ...
```

Note: The `getPayload` and `getInfraSettings` calls move before both auth and cooldown. The auth check (previously after cooldown) now runs first so unauthenticated requests can't trigger the MongoDB cooldown write.

- [ ] **Step 4: Verify the cleanup endpoint still works**

Run: `cd apps/landing && pnpm dev`

Test with curl:
```bash
curl -X POST http://localhost:3001/api/demo/cleanup \
  -H "Authorization: Bearer <your-cleanup-secret>"
```

Expected: First call succeeds (or returns auth error if no secret configured). Second call within 60s returns `429`.

- [ ] **Step 5: Commit**

```bash
git add apps/landing/src/globals/InfrastructureSettings.ts apps/landing/src/app/api/demo/cleanup/route.ts apps/landing/src/payload-types.ts
git commit -m "fix(landing): replace in-memory cleanup cooldown with MongoDB-backed state"
```

---

## Chunk 2: Sentry Hardening

### Task 3: Sentry Config Updates

**Files:**
- Modify: `apps/landing/sentry.client.config.ts`
- Modify: `apps/landing/sentry.server.config.ts`

- [ ] **Step 1: Update `sentry.client.config.ts`**

Replace the entire contents of `apps/landing/sentry.client.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs'

if (!process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
  console.warn('[sentry] NEXT_PUBLIC_SENTRY_DSN is not set — error tracking disabled in production')
}

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  })
}
```

- [ ] **Step 2: Update `sentry.server.config.ts`**

Replace the entire contents of `apps/landing/sentry.server.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs'

if (!process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
  console.warn('[sentry] NEXT_PUBLIC_SENTRY_DSN is not set — error tracking disabled in production')
}

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
  })
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/landing/sentry.client.config.ts apps/landing/sentry.server.config.ts
git commit -m "feat(landing): harden Sentry config — mandatory DSN warning, 100% sampling, error replays"
```

---

### Task 4: Sentry Breadcrumbs on API Routes

**Files:**
- Modify: `apps/landing/src/app/api/demo/create/route.ts`
- Modify: `apps/landing/src/app/api/demo/cleanup/route.ts`
- Modify: `apps/landing/src/app/api/demo/status/[id]/route.ts`

- [ ] **Step 1: Add Sentry to `demo/create/route.ts`**

In `apps/landing/src/app/api/demo/create/route.ts`:

Add import at top:
```typescript
import * as Sentry from '@sentry/nextjs'
```

Additions in file order:

After the Turnstile check passes (after line 52), add breadcrumb:
```typescript
  Sentry.addBreadcrumb({ message: 'Turnstile passed', category: 'demo' })
```

After the `requestIp` extraction (after line 58), add Sentry context:
```typescript
  Sentry.setContext('demo', { demoType, email, requestIp })
```

In the provisioning try/catch block (lines 106-114), update the catch to capture the exception:
```typescript
    } catch (err) {
      Sentry.captureException(err)
      return NextResponse.json({ error: 'Failed to provision demo container' }, { status: 500 })
    }
```

After successful provisioning (after line 111, before `return`), add:
```typescript
      Sentry.addBreadcrumb({ message: 'Demo provisioned', category: 'demo', data: { demoType, demoId: result.demoId } })
```

After queuing (after line 123, before `return`), add:
```typescript
  Sentry.addBreadcrumb({ message: 'Demo queued', category: 'demo', data: { demoType, email } })
```

- [ ] **Step 2: Add Sentry to `demo/cleanup/route.ts`**

In `apps/landing/src/app/api/demo/cleanup/route.ts`:

Add import at top:
```typescript
import * as Sentry from '@sentry/nextjs'
```

In the per-demo cleanup error handling (around line 66, inside the `if (anyFailed)` block), after the existing `console.error`, add:
```typescript
          if (r.status === 'rejected') {
            const err = r.reason instanceof Error ? r.reason : new Error(String(r.reason))
            Sentry.captureException(err, { tags: { demoId: demo.demoId, cleanupStep: String(i) } })
          }
```

Before the final `return NextResponse.json(...)` (line 132), add:
```typescript
  Sentry.addBreadcrumb({ message: 'Cleanup complete', category: 'demo', data: { expired: expiredCount, failed: failedCount, queued: queuedCount } })
```

- [ ] **Step 3: Add Sentry to `demo/status/[id]/route.ts`**

In `apps/landing/src/app/api/demo/status/[id]/route.ts`:

Add import at top:
```typescript
import * as Sentry from '@sentry/nextjs'
```

Wrap the main function body in a try/catch to capture unexpected errors. The token mismatch (returning 404) is expected and should NOT be captured. Only capture truly unexpected exceptions:

After the existing code, wrap everything from line 15 (`const payload = ...`) through the final return in a try/catch:

```typescript
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const statusToken = req.nextUrl.searchParams.get('token')

  if (!statusToken) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const payload = await getPayload({ config })
    // ... all existing logic stays the same ...
    return NextResponse.json({ status: demo.status, demoUrl, expiresAt: demo.expiresAt })
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Verify dev server starts and type-checks**

Run: `cd apps/landing && npx tsc --noEmit`

Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add apps/landing/src/app/api/demo/create/route.ts apps/landing/src/app/api/demo/cleanup/route.ts apps/landing/src/app/api/demo/status/\[id\]/route.ts
git commit -m "feat(landing): add Sentry breadcrumbs and error capture to API routes"
```

---

## Chunk 3: CF Access Warning + Hreflang SEO

### Task 5: CF Access Production Warning

**Files:**
- Modify: `apps/landing/src/middleware.ts` (add warning before line 41)

- [ ] **Step 1: Add CF Access production warning to middleware**

In `apps/landing/src/middleware.ts`:

Add a module-level flag after the `securityHeaders` object (after line 26):
```typescript
let cfAccessWarned = false
```

Inside the `middleware` function, before the `/api/` check (before line 41), add:
```typescript
  if (process.env.NODE_ENV === 'production' && !isCfAccessEnabled() && !cfAccessWarned) {
    console.warn('[security] CF Access is not configured — API routes are unprotected')
    cfAccessWarned = true
  }
```

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/middleware.ts
git commit -m "feat(landing): warn when CF Access is disabled in production"
```

---

### Task 6: Hreflang + Canonical URLs

**Files:**
- Create: `apps/landing/src/utilities/seo.ts`
- Modify: `apps/landing/src/app/(frontend)/[locale]/page.tsx` (add `generateMetadata`)
- Modify: `apps/landing/src/app/(frontend)/[locale]/demo/page.tsx` (add `alternates` to existing metadata)
- Modify: `apps/landing/src/app/(frontend)/[locale]/demos/[type]/page.tsx` (add `alternates` to existing metadata)

- [ ] **Step 1: Create `buildAlternates` utility**

Create `apps/landing/src/utilities/seo.ts`:

```typescript
import type { Metadata } from 'next'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || ''

export function buildAlternates(locale: string, path: string): Metadata['alternates'] {
  const cleanPath = path === '/' ? '' : path
  return {
    canonical: `${SERVER_URL}/${locale}${cleanPath}`,
    languages: {
      en: `${SERVER_URL}/en${cleanPath}`,
      fr: `${SERVER_URL}/fr${cleanPath}`,
      'x-default': `${SERVER_URL}/en${cleanPath}`,
    },
  }
}
```

- [ ] **Step 2: Add `generateMetadata` to homepage**

In `apps/landing/src/app/(frontend)/[locale]/page.tsx`:

Add imports at the top:
```typescript
import type { Metadata } from 'next'
import { buildAlternates } from '@/utilities/seo'
```

Add `generateMetadata` export before the default export (before line 18):
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    alternates: buildAlternates(locale, '/'),
  }
}
```

- [ ] **Step 3: Add alternates to demo request page**

In `apps/landing/src/app/(frontend)/[locale]/demo/page.tsx`:

Add import:
```typescript
import { buildAlternates } from '@/utilities/seo'
```

In the existing `generateMetadata` (line 10-18), add `alternates` to the return:
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'demoRequestPage.meta' })

  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(locale, '/demo'),
  }
}
```

- [ ] **Step 4: Add alternates to demo detail page**

In `apps/landing/src/app/(frontend)/[locale]/demos/[type]/page.tsx`:

Add import:
```typescript
import { buildAlternates } from '@/utilities/seo'
```

In the existing `generateMetadata` (line 15-35), add `alternates` to the return:
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type } = await params

  const loc = locale as Config['locale']
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'demos',
    where: { slug: { equals: type } },
    locale: loc,
    limit: 1,
    depth: 1,
  })

  const demo = result.docs[0]
  if (!demo) return {}

  return {
    title: `${demo.name} Demo - payload-reserve`,
    description: demo.detailDescription ?? demo.description,
    alternates: buildAlternates(locale, `/demos/${type}`),
  }
}
```

- [ ] **Step 5: Verify type-check passes**

Run: `cd apps/landing && npx tsc --noEmit`

Expected: No type errors.

- [ ] **Step 6: Commit**

```bash
git add apps/landing/src/utilities/seo.ts apps/landing/src/app/\(frontend\)/\[locale\]/page.tsx apps/landing/src/app/\(frontend\)/\[locale\]/demo/page.tsx apps/landing/src/app/\(frontend\)/\[locale\]/demos/\[type\]/page.tsx
git commit -m "feat(landing): add hreflang and canonical URL tags to all pages"
```

---

## Post-Implementation

After all tasks are complete:

1. Run full type-check: `cd apps/landing && npx tsc --noEmit`
2. Run dev server and verify:
   - Error boundary: navigate to `/en/nonexistent` → see not-found page
   - Hreflang: view page source on `/en` → see `<link rel="alternate" hreflang="fr" ...>` tags
   - Cleanup cooldown: inspect `InfrastructureSettings` in admin → `lastCleanupAt` field exists (hidden but in DB)
3. Build: `pnpm build:landing` — should succeed
