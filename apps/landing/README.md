# payload-reserve Landing — Ephemeral Demo Provisioning

> **Live:** [payloadreserve.com](https://payloadreserve.com)

The marketing site and **ephemeral demo provisioning system** for `payload-reserve`.

Visitors can request a private, time-limited instance of any demo app (salon, hotel, restaurant, events). The landing app communicates with the **Coolify API** to spin up Docker containers on demand, seeds them with sample data, and sends credentials by email.

Part of the [`payload-reserve-demos`](../../README.md) monorepo.

---

## What This App Does

This is **not** a static marketing page. It is a full provisioning platform that:

1. **Creates ephemeral demo environments** — each visitor gets their own isolated instance
2. **Manages capacity** — queues requests when active demo count exceeds limits
3. **Auto-cleans up** — destroys containers, databases, and storage after TTL expiration
4. **Tracks everything** — demo instances, requests, and infrastructure config in Payload CMS

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| CMS / API | Payload CMS 3.x |
| Database | MongoDB (via `@payloadcms/db-mongodb`) |
| i18n | `next-intl` v3 (English + French) |
| Email | Resend + React Email |
| CAPTCHA | Cloudflare Turnstile |
| Orchestration | Coolify API (via `@payload-reserve-demos/coolify-sdk`) |
| Styling | Tailwind CSS v4 |

---

## Ephemeral Demo Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│  1. REQUEST                                                     │
│     Visitor submits: name, email, demo type, Turnstile token    │
│     → POST /api/demo/create                                     │
│     → Rate-limited per IP + email                               │
├─────────────────────────────────────────────────────────────────┤
│  2. CAPACITY CHECK                                              │
│     Active demos < maxActiveDemos?                              │
│     ├─ YES → Immediate provisioning                             │
│     └─ NO  → Queued with estimated availability time            │
├─────────────────────────────────────────────────────────────────┤
│  3. PROVISION (Coolify API)                                     │
│     → Create Docker service from demo image                     │
│     → Inject env vars: DATABASE_URL, PAYLOAD_SECRET,            │
│       ADMIN_EMAIL, ADMIN_PASSWORD, SEED_SECRET,                 │
│       S3_*, STRIPE_*, RESEND_*                                  │
│     → Start container                                           │
├─────────────────────────────────────────────────────────────────┤
│  4. HEALTH POLL                                                 │
│     → GET {demoUrl}/api/health every 10s (up to 60 attempts)    │
│     → Every 5th iteration: check Coolify service status         │
├─────────────────────────────────────────────────────────────────┤
│  5. SEED                                                        │
│     → POST {demoUrl}/api/seed                                   │
│       Authorization: Bearer {demoSeedSecret}                    │
│     → Populates sample data (services, resources, schedules)    │
├─────────────────────────────────────────────────────────────────┤
│  6. READY                                                       │
│     → Status updated to "ready"                                 │
│     → Email sent with: demo URL, admin URL, credentials         │
│     → Frontend poller shows credentials + direct links          │
├─────────────────────────────────────────────────────────────────┤
│  7. CLEANUP (after TTL expiration, default 24h)                 │
│     → POST /api/demo/cleanup (Bearer token auth)                │
│     → Delete Coolify service                                    │
│     → Drop MongoDB database                                     │
│     → Delete S3 prefix                                          │
│     → Process queued requests if slots available                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
apps/landing/src/
├── app/
│   ├── [locale]/                       # Localized marketing pages
│   │   ├── page.tsx                    # Homepage (fetches from Payload globals)
│   │   ├── demo/page.tsx              # Demo request form
│   │   └── demos/[type]/page.tsx      # Per-demo detail pages
│   ├── api/
│   │   └── demo/
│   │       ├── create/route.ts        # POST — request a new ephemeral demo
│   │       ├── status/[id]/route.ts   # GET  — poll provisioning status
│   │       └── cleanup/route.ts       # POST — expire old demos, process queue
│   └── (payload)/                     # Payload admin panel
├── collections/
│   ├── DemoInstances.ts               # Active/expired demo environments
│   ├── DemoRequests.ts                # Visitor requests (pending/completed/failed)
│   ├── Demos.ts                       # Demo showcase content (name, emoji, features, screenshots)
│   ├── Media.ts                       # Image uploads
│   └── Users.ts                       # Admin users
├── globals/
│   ├── HomePage.ts                    # Homepage content (Hero, Features, Demos, CTA, etc.)
│   ├── Navigation.ts                  # Site navigation
│   ├── Footer.ts                      # Footer content
│   ├── SiteSettings.ts               # SEO, meta, locale config
│   └── InfrastructureSettings.ts      # Coolify, Docker images, MongoDB, S3, Stripe, Resend, demo config
├── components/
│   ├── DemoRequestForm.tsx            # Client component — form + state machine
│   ├── DemoStatusPoller.tsx           # Client component — polls /api/demo/status
│   ├── CredentialsSuccess.tsx         # Shows demo URL + admin credentials
│   ├── QueueConfirmation.tsx          # Shows queue position + estimated time
│   ├── Hero.tsx                       # Homepage hero section
│   └── ...                            # Other marketing page components
├── lib/
│   └── provision-demo.ts             # Core provisioning engine (provisionAndDeploy, pollAndSeed)
├── i18n/                              # next-intl config + message files
├── payload.config.ts                  # Payload config
└── payload-types.ts                   # Auto-generated types
```

---

## Key Data Models

### `demo-instances` Collection

Tracks every ephemeral demo environment:

| Field | Description |
|---|---|
| `demoId` | Unique 16-char nanoid |
| `type` | `salon` \| `hotel` \| `restaurant` \| `events` |
| `subdomain` | `demo-<id>.payloadreserve.com` |
| `dbName` | `payloadreserve-demo-<id>` |
| `s3Prefix` | `<type>/demo-<id>` |
| `coolifyServiceId` | Coolify UUID |
| `status` | `provisioning` \| `ready` \| `ready_email_failed` \| `expired` \| `failed` \| `cleanup_failed` |
| `expiresAt` | Auto-cleanup timestamp |
| `statusTokenHash` | SHA256 — for secure polling |
| `adminPasswordHash` | bcrypt — stored, never exposed |

### `InfrastructureSettings` Global

All infrastructure config managed from the admin panel:

| Tab | Contents |
|---|---|
| **Coolify** | Project UUID, Server UUID, Destination UUID |
| **Docker Images** | Image name + tag per demo type |
| **MongoDB** | Shared host, root credentials |
| **S3 Storage** | Endpoint, bucket, credentials |
| **Resend** | API key, from address |
| **Stripe** | Secret key, webhook secret, publishable key |
| **Demo Config** | Base domain, protocol, TTL hours, max active demos, cleanup secret |

---

## Security

- **Credentials**: Admin passwords bcrypt-hashed, status tokens SHA256-hashed, seed secrets random hex — nothing stored in plaintext
- **Rate limiting**: One active/pending demo per IP + email
- **CAPTCHA**: Cloudflare Turnstile verification on every request
- **Cleanup auth**: Constant-time comparison of bearer token + 60-second MongoDB-backed cooldown
- **Isolation**: Each demo gets its own database, S3 prefix, and cryptographic secrets

---

## Commands

```bash
# From monorepo root
pnpm dev:landing          # Start dev server (port 3001)
pnpm build:landing        # Production build

# From apps/landing/
pnpm dev                  # Start dev server
pnpm build                # Production build
pnpm typecheck            # Type-check
pnpm generate:types       # Regenerate payload-types.ts
pnpm generate:importmap   # Regenerate admin import map
```

---

## URLs

| URL | Description |
|---|---|
| `http://localhost:3001` | Homepage (defaults to `/en`) |
| `http://localhost:3001/fr` | French locale |
| `http://localhost:3001/demo` | Demo request form |
| `http://localhost:3001/demos/salon` | Salon demo detail page |
| `http://localhost:3001/admin` | Payload admin panel |
| `http://localhost:3001/api/demo/create` | Demo provisioning endpoint |
| `http://localhost:3001/api/demo/status/:id` | Demo status polling endpoint |
| `http://localhost:3001/api/demo/cleanup` | Cleanup + queue processing endpoint |
