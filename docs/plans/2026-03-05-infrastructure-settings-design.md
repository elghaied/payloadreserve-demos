# Infrastructure Settings Global — Design

**Date:** 2026-03-05
**App:** apps/landing
**Goal:** Move infrastructure env vars into a Payload CMS global so admins can update config (Coolify UUIDs, Docker images, SMTP, S3, Stripe, MongoDB, demo config) without redeploying.

## Decision Summary

- **Single global** `infrastructure-settings` with 7 tabs
- **All config including secrets** stored in Payload
- **Secret fields** use write-only masked display (custom admin component)
- **Fresh read** from Payload local API on every API request (no caching)
- **Env-var fallback** during migration, removed once stable

## Global Schema

**Slug:** `infrastructure-settings`
**Access:** Authenticated admin users only
**Localization:** None

### Tab: Coolify

| Field | Type | Notes |
|-------|------|-------|
| `coolifyApiUrl` | text | Required |
| `coolifyApiKey` | text, secret | Required |
| `coolifyProjectUuid` | text | Required |
| `coolifyServerUuid` | text | Required |
| `coolifyDestinationUuid` | text | Required |

### Tab: Docker Images

Four groups (salon, hotel, restaurant, events), each containing:

| Field | Type | Notes |
|-------|------|-------|
| `{type}ImageName` | text | e.g. `onedev.payloadreserve.com/payloadreserve-demos/salon` |
| `{type}ImageTag` | text | Default: `"latest"` |

### Tab: MongoDB

| Field | Type | Notes |
|-------|------|-------|
| `mongoHost` | text | Required. Docker network hostname |
| `mongoRootUsername` | text, secret | Required |
| `mongoRootPassword` | text, secret | Required |

### Tab: SMTP

| Field | Type | Notes |
|-------|------|-------|
| `smtpHost` | text | |
| `smtpPort` | number | Default: 587 |
| `smtpUser` | text | |
| `smtpPass` | text, secret | |
| `smtpFrom` | email | |
| `smtpFromName` | text | Default: `"payload-reserve"` |

### Tab: S3 Storage

| Field | Type | Notes |
|-------|------|-------|
| `s3Endpoint` | text | Required |
| `s3AccessKey` | text, secret | Required |
| `s3SecretKey` | text, secret | Required |
| `s3Region` | text | Default: `"us-east-1"` |
| `s3Bucket` | text | Required |
| `s3Prefix` | text | Default: `"media"` |
| `s3ForcePathStyle` | checkbox | Default: true |

### Tab: Stripe

| Field | Type | Notes |
|-------|------|-------|
| `stripeSecretKey` | text, secret | |
| `stripeWebhookSecret` | text, secret | |
| `stripePublishableKey` | text | |

### Tab: Demo Config

| Field | Type | Notes |
|-------|------|-------|
| `demoBaseDomain` | text | Default: `"payloadreserve.com"` |
| `demoProtocol` | select | Options: `https`, `http`. Default: `https` |
| `demoTtlHours` | number | Default: 24 |
| `maxActiveDemos` | number | Default: 20 |
| `cleanupSecret` | text, secret | Required |
| `turnstileSecretKey` | text, secret | |
| `turnstileSiteKey` | text | |

## Secret Field Pattern

Custom admin component `SecretField`:
- Shows `••••••••` when a value exists, empty placeholder when not
- Click to reveal an input to set/update the value
- Uses `hidden: true` on the Payload field so the value is excluded from normal API responses
- API routes use `showHiddenFields: true` via local API to read actual values

## Helper Function

```typescript
// src/lib/infra-settings.ts
import type { Payload } from 'payload'
import type { InfrastructureSetting } from '@/payload-types'

export async function getInfraSettings(payload: Payload): Promise<InfrastructureSetting> {
  return payload.findGlobal({
    slug: 'infrastructure-settings',
    showHiddenFields: true,
  })
}
```

## Migration Strategy

1. Create global and register in payload.config.ts
2. Update API routes and lib functions to read from `getInfraSettings()` with env-var fallback
3. Populate settings via admin UI or seed script
4. Remove env-var fallbacks once stable

## Env Vars That Stay

These are required at startup before Payload is available:
- `DATABASE_URL` — Payload startup
- `PAYLOAD_SECRET` — Payload startup
- `NEXT_PUBLIC_SERVER_URL` — Next.js build-time
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Client-side bundle
- `NODE_ENV` — Runtime

## Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/globals/InfrastructureSettings.ts` | Global config definition |
| Create | `src/components/admin/SecretField.tsx` | Custom masked input component |
| Create | `src/lib/infra-settings.ts` | Helper to fetch settings with `showHiddenFields` |
| Modify | `src/payload.config.ts` | Register the new global |
| Modify | `src/app/api/demo/create/route.ts` | Use `getInfraSettings()` instead of `process.env` |
| Modify | `src/app/api/demo/cleanup/route.ts` | Use `getInfraSettings()` instead of `process.env` |
| Modify | `src/lib/cleanup-utils.ts` | Accept settings param instead of reading env |
| Modify | `src/lib/mailer.ts` | Accept settings param instead of reading env |
| Modify | `src/lib/turnstile.ts` | Accept settings param instead of reading env |
| Run | `pnpm generate:types` | Regenerate types after global creation |
| Run | `pnpm generate:importmap` | Regenerate importmap for admin component |
