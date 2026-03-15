# Landing App Production Hardening

**Date:** 2026-03-15
**Status:** Approved
**Scope:** `apps/landing/` only
**Builds on:** `2026-03-14-production-readiness-design.md` (cross-app fixes)

## Context

A fresh production readiness audit of `apps/landing/` identified remaining gaps not covered by the earlier cross-app spec. This spec addresses operational hardening specific to the landing app's demo provisioning infrastructure, error handling, observability, and SEO.

## Decisions Made During Brainstorming

| Decision | Choice |
|----------|--------|
| Deployment timeline | Full production hardening pass |
| Secret rotation | Not needed — `.env.local` only has dev/local secrets |
| Rate limiting | Cloudflare WAF rules (edge) + MongoDB for app-level state |
| Testing | Deferred to later sprint |
| Logging | Lean on Sentry exclusively (no Pino/Winston) |
| Error boundary style | Minimal — generic "Something went wrong" + retry button |
| Hreflang/SEO | Add hreflang + canonical tags via utility |
| `force-dynamic` | Keep as-is — correct for GH Actions build + internal MongoDB |

---

## Section 1: Global Error Boundary

**Files:** New `src/app/(frontend)/[locale]/error.tsx`, new `src/app/(frontend)/[locale]/not-found.tsx`

### 1.1 `error.tsx`

A `'use client'` component that catches unhandled errors in the `[locale]` route tree.

- Renders a centered card: "Something went wrong" heading, brief message, "Try again" button
- "Try again" calls `reset()` (provided by Next.js error boundary props)
- `useEffect` calls `Sentry.captureException(error)` on mount
- Styled with Tailwind classes matching the existing design system (Outfit font, violet accent)
- No i18n — error boundaries can't reliably access locale context
- No nav/footer — the error boundary sits inside the layout, so those still render

### 1.2 `not-found.tsx`

A server component for 404s on frontend routes.

- Renders a centered card: "Page not found" heading, link back to home (`/`)
- No i18n dependency — hardcoded English (404 pages are simple enough)
- Matches `error.tsx` styling for consistency

---

## Section 2: Distributed Cleanup State

**Files:** Modified `src/globals/InfrastructureSettings.ts`, modified `src/app/api/demo/cleanup/route.ts`

### Problem

`cleanup/route.ts` line 10 uses a module-level `let lastCleanupAt = 0` for cooldown. This resets on every deploy and doesn't work with multiple instances.

### Fix

1. Add a `lastCleanupAt` date field to the `InfrastructureSettings` global:
   ```typescript
   {
     name: 'lastCleanupAt',
     type: 'date',
     admin: { hidden: true },
   }
   ```

2. In `cleanup/route.ts`:
   - Remove `let lastCleanupAt = 0` and `const CLEANUP_COOLDOWN_MS`
   - After fetching `settings`, read `settings.lastCleanupAt`
   - Compare against 60s cooldown: `if (Date.now() - new Date(settings.lastCleanupAt).getTime() < 60_000)`
   - Before starting cleanup work, update the global: `await payload.updateGlobal({ slug: 'infrastructure-settings', data: { lastCleanupAt: new Date().toISOString() } })`
   - This acts as an optimistic lock — first request to update wins, concurrent requests see the updated timestamp

3. Regenerate types after adding the field.

---

## Section 3: Sentry Hardening

**Files:** Modified `sentry.client.config.ts`, modified `sentry.server.config.ts`, modified API route files

### 3a. Mandatory DSN warning

In both `sentry.client.config.ts` and `sentry.server.config.ts`:
```typescript
if (!process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
  console.warn('[sentry] NEXT_PUBLIC_SENTRY_DSN is not set — error tracking disabled in production')
}
```

Keep the existing `if (process.env.NEXT_PUBLIC_SENTRY_DSN)` guard so Sentry is still optional in dev.

### 3b. Increase trace sample rate

Change `tracesSampleRate` from `0.1` to `1.0` in both config files. This is a low-traffic marketing site — 100% sampling gives full visibility with negligible cost.

### 3c. Enable error replays on client

In `sentry.client.config.ts`, change `replaysOnErrorSampleRate` from `0` to `1.0`. This captures a session replay only when an error occurs — zero cost in the normal case, invaluable for debugging.

### 3d. Sentry breadcrumbs on API routes

Add `Sentry.addBreadcrumb()` and `Sentry.captureException()` to these routes:

**`demo/create/route.ts`:**
- Breadcrumb after Turnstile verification: `{ message: 'Turnstile passed', category: 'demo' }`
- Breadcrumb on provisioning: `{ message: 'Demo provisioned', data: { demoType, demoId } }`
- Breadcrumb on queuing: `{ message: 'Demo queued', data: { demoType, email } }`
- `Sentry.captureException()` on provisioning failure (currently returns 500 but error is not reported to Sentry)
- `Sentry.setContext('demo', { demoType, email, requestIp })` at the start

**`demo/cleanup/route.ts`:**
- Breadcrumb with cleanup summary: `{ message: 'Cleanup complete', data: { expired, failed, queued } }`
- `Sentry.captureException()` on individual demo cleanup failures (in addition to existing `console.error`)

**`demo/status/[id]/route.ts`:**
- `Sentry.captureException()` on unexpected errors (token mismatch is expected, not captured)

**`health/route.ts`:**
- No Sentry changes — health checks should not generate noise

---

## Section 4: Cloudflare Rate Limiting + CF Access Enforcement

### 4a. CF Access production warning

In `src/middleware.ts`, add a one-time warning when CF Access is disabled in production:

```typescript
let cfAccessWarned = false

// Inside the middleware function, before the /api/ check:
if (process.env.NODE_ENV === 'production' && !isCfAccessEnabled() && !cfAccessWarned) {
  console.warn('[security] CF Access is not configured — API routes are unprotected')
  cfAccessWarned = true
}
```

This is a module-level flag — logs once per process, not per request.

### 4b. Cloudflare WAF rate limiting rules (deployment checklist)

These are configured in the Cloudflare dashboard, not in app code. Document as a deployment checklist:

| Route | Limit | Window | Action |
|-------|-------|--------|--------|
| `POST /api/demo/create` | 5 requests | 1 minute | Block (429) |
| `GET /api/health` | 30 requests | 1 minute | Block (429) |
| `GET /api/demo/status/*` | 60 requests | 1 minute | Block (429) |
| `POST /api/seed` | 2 requests | 1 minute | Block (429) |
| `POST /api/demo/cleanup` | 5 requests | 1 minute | Block (429) |

All rules are per-IP. Use Cloudflare's "Rate Limiting Rules" under Security > WAF.

---

## Section 5: Hreflang + Canonical URLs

**Files:** New `src/utilities/seo.ts`, modified page-level `generateMetadata` in `[locale]/page.tsx`, `demo/page.tsx`, `demos/[type]/page.tsx`

### 5.1 Utility function

Create `src/utilities/seo.ts`:

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

### 5.2 Apply to each page's `generateMetadata`

Each page calls `buildAlternates(locale, '<path>')` and merges into its returned metadata:

| Page | Path argument | Notes |
|------|---------------|-------|
| `[locale]/page.tsx` (homepage) | `'/'` | **New** `generateMetadata` — this page has no existing one. The layout already provides `title`/`description` via `siteSettings.defaultMeta`, so the page-level function only needs to return `alternates`. Next.js merges page metadata over layout metadata. |
| `[locale]/demo/page.tsx` | `'/demo'` | Merge into existing `generateMetadata` |
| `[locale]/demos/[type]/page.tsx` | `'/demos/${type}'` | Merge into existing `generateMetadata` |

Example in homepage (new function):
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    alternates: buildAlternates(locale, '/'),
  }
}
```

---

## Deployment Checklist

Before going live, verify:

- [ ] `NEXT_PUBLIC_SERVER_URL` is set in Coolify env vars (used by hreflang, CSRF origin check)
- [ ] `NEXT_PUBLIC_SENTRY_DSN` is set in Coolify env vars
- [ ] `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_POLICY_AUD` are set in Coolify env vars
- [ ] Cloudflare WAF rate limiting rules are configured per Section 4b
- [ ] Cloudflare Access application is set up for `/admin` and `/api` paths
- [ ] Run `pnpm generate:types` after InfrastructureSettings field addition
- [ ] Seed the database via `/api/seed` after first deploy
- [ ] Verify `/api/health` returns `{ status: 'ok' }` after deploy

---

## Out of Scope (Deferred)

| Item | Reason |
|------|--------|
| Test suite (Vitest + Playwright) | Later sprint — operational hardening first |
| Structured logging (Pino/Winston) | Relying on Sentry for observability |
| Audit logging | Not critical for marketing site |
| Distributed in-app rate limiting | Handled at Cloudflare edge |
| `force-dynamic` removal | Correct for GH Actions build + internal MongoDB architecture |
