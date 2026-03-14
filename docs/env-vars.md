# Environment Variables Reference

All apps are deployed as Docker containers on Coolify. Each app requires its own `.env` file. See the per-app `.env.example` for copy-paste starting points.

---

## Demo Apps (salon, hotel, restaurant, events)

All four demo apps share the same env var schema. App-specific differences (bucket names, default email addresses, ports) are noted inline.

### Core

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SERVER_URL` | Required | — | Public URL for the app (e.g. `https://salon.payload-reserve.com`) |
| `PAYLOAD_SECRET` | Required | — | Secret used for Payload auth and encryption. Generate with `openssl rand -hex 32` |
| `DATABASE_URL` | Required | — | MongoDB connection string (e.g. `mongodb://user:pass@host:27017/salon-demo?authSource=admin`) |

### Admin

| Variable | Required | Default | Description |
|---|---|---|---|
| `ADMIN_EMAIL` | Required | — | Email address for the auto-created admin user |
| `ADMIN_PASSWORD` | Required (first run) | — | Password for the auto-created admin user. Only used on the first run to seed the admin account |
| `SEED_SECRET` | Required | — | Bearer token that protects the `POST /api/seed` endpoint |

### S3 Storage

All demo apps require S3-compatible object storage. Use MinIO for self-hosted or any S3-compatible provider.

| Variable | Required | Default | Description |
|---|---|---|---|
| `S3_ENDPOINT` | Required | — | MinIO or S3-compatible endpoint URL (e.g. `http://minio.internal:9000`) |
| `S3_BUCKET` | Required | — | Bucket name. App-specific: `salon-demo`, `hotel-demo`, `restaurant-demo`, `events-demo` |
| `S3_PREFIX` | Required | `media` | Key prefix for all uploads |
| `S3_ACCESS_KEY` | Required | — | S3 access key ID |
| `S3_SECRET_KEY` | Required | — | S3 secret access key |
| `S3_REGION` | Optional | `us-east-1` | S3 region. Use `auto` for Cloudflare R2 |
| `S3_FORCE_PATH_STYLE` | Optional | `true` | Set `true` for MinIO (path-style URLs). Set `false` for AWS S3 (virtual-hosted-style) |

### SMTP (Email)

Email features are disabled when `SMTP_HOST` is unset. The three `SMTP_*` credentials below are required only when `SMTP_HOST` is set.

| Variable | Required | Default | Description |
|---|---|---|---|
| `SMTP_HOST` | Optional | — | SMTP server hostname. Leave unset to disable all outbound email |
| `SMTP_PORT` | Optional | `587` | SMTP server port |
| `SMTP_USER` | Required if `SMTP_HOST` set | — | SMTP username / login |
| `SMTP_PASS` | Required if `SMTP_HOST` set | — | SMTP password |
| `SMTP_FROM` | Required if `SMTP_HOST` set | — | From address for outbound email (e.g. `noreply@yoursalon.com`) |
| `SMTP_FROM_NAME` | Optional | — | Display name shown in the From field (e.g. `Lumière Salon`) |

### Stripe (Payments)

Payment features are disabled when these vars are unset.

| Variable | Required | Default | Description |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | Optional | — | Stripe secret key (`sk_live_…` or `sk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | Optional | — | Stripe webhook signing secret (`whsec_…`) for verifying webhook payloads |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | — | Stripe publishable key exposed to the browser (`pk_live_…` or `pk_test_…`) |

### Sentry (Error Tracking)

Error tracking is disabled when these vars are unset.

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | — | Sentry DSN exposed to the browser for client-side error capture |
| `SENTRY_AUTH_TOKEN` | Optional | — | Sentry auth token used during build to upload source maps |

---

## Landing App (apps/landing)

The landing app (`payload-reserve.com`) is a Payload CMS + Next.js app that also provisions live demo instances via the Coolify API. It has additional env vars beyond the shared set above.

> **Note:** Demo provisioning config (Coolify API credentials for container creation, demo container S3/SMTP settings, Turnstile secret, cleanup secret, etc.) that was previously managed via env vars is now configured through **Admin Panel > Settings > Infrastructure Settings** in Payload. Only the vars below need to be set in `.env` / Coolify.

### Core

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SERVER_URL` | Required | — | Public URL of the landing app (e.g. `https://payloadreserve.com`) |
| `PAYLOAD_SECRET` | Required | — | Payload auth/encryption secret. Generate with `openssl rand -hex 32` |
| `DATABASE_URL` | Required | — | MongoDB connection string for the landing app's own database |

### Admin

| Variable | Required | Default | Description |
|---|---|---|---|
| `ADMIN_EMAIL` | Optional | — | Email for the auto-created admin user (used during seed) |
| `ADMIN_PASSWORD` | Optional | — | Password for the auto-created admin user (used during seed) |
| `SEED_SECRET` | Optional | — | Bearer token protecting `POST /api/seed` |

### S3 Storage

The landing app's own S3 bucket for Payload media (screenshots, logos, etc.). This is separate from demo container storage, which is configured in Infrastructure Settings.

| Variable | Required | Default | Description |
|---|---|---|---|
| `S3_ENDPOINT` | Required | — | MinIO or S3-compatible endpoint URL |
| `S3_BUCKET` | Required | `landing-media` | Bucket name for the landing app's own media |
| `S3_PREFIX` | Required | `media` | Key prefix for all uploads |
| `S3_ACCESS_KEY` | Required | — | S3 access key ID |
| `S3_SECRET_KEY` | Required | — | S3 secret access key |
| `S3_REGION` | Optional | `us-east-1` | S3 region |
| `S3_FORCE_PATH_STYLE` | Optional | `true` | Set `true` for MinIO, `false` for AWS S3 |

### SMTP (Email)

Used for Payload admin emails (password resets, notifications). Demo credential emails use the SMTP config from Infrastructure Settings (which can be a different account).

| Variable | Required | Default | Description |
|---|---|---|---|
| `SMTP_HOST` | Optional | — | SMTP server hostname |
| `SMTP_PORT` | Optional | `587` | SMTP server port |
| `SMTP_USER` | Required if `SMTP_HOST` set | — | SMTP username |
| `SMTP_PASS` | Required if `SMTP_HOST` set | — | SMTP password |
| `SMTP_FROM` | Required if `SMTP_HOST` set | — | From address for Payload admin emails |
| `SMTP_FROM_NAME` | Optional | `payload-reserve` | Display name shown in the From field |

### Coolify (Demo Provisioning)

Server-side only — never expose to the browser. Used to provision and destroy demo containers.

| Variable | Required | Default | Description |
|---|---|---|---|
| `COOLIFY_API_URL` | Required | — | Base URL of the Coolify API (e.g. `https://coolify.example.com/api`) |
| `COOLIFY_API_KEY` | Required | — | Coolify API token with permission to create/destroy services |
| `COOLIFY_PROJECT_UUID` | Required | — | UUID of the Coolify project where demo containers are created |
| `COOLIFY_SERVER_UUID` | Required | — | UUID of the Coolify server that hosts demo containers |

### Demo Lifecycle

| Variable | Required | Default | Description |
|---|---|---|---|
| `DEMO_TTL_HOURS` | Optional | `24` | How long (in hours) a provisioned demo stays alive before cleanup |
| `MAX_ACTIVE_DEMOS` | Optional | `20` | Maximum number of concurrently active demo instances |
| `DEMO_PROTOCOL` | Optional | `https` | Protocol for demo subdomain URLs (`http` or `https`) |
| `DEMO_DOMAIN` | Optional | — | Base domain for demo subdomains (e.g. `demo.payloadreserve.com`) |

### Cloudflare Turnstile (Bot Protection)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Required | — | Turnstile site key exposed to the browser for the widget |
| `TURNSTILE_SECRET_KEY` | Required | — | Turnstile secret key used server-side to verify challenge responses |

### MongoDB Cleanup

Used by the `POST /api/demo/cleanup` route to drop demo databases after TTL expiry.

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGO_ROOT_USER` | Required | — | MongoDB root username (for dropping demo databases) |
| `MONGO_ROOT_PASS` | Required | — | MongoDB root password |
| `MONGO_HOST` | Required | — | MongoDB host (e.g. `mongo.internal:27017`) |
| `CLEANUP_SECRET` | Required | — | Bearer token required to call `POST /api/demo/cleanup` |

---

## Quick-start Checklist

For a new demo app deployment on Coolify:

1. Copy `apps/<name>/.env.example` to a new Coolify environment variable block
2. Fill in all **Required** vars
3. Generate secrets: `openssl rand -hex 32` for `PAYLOAD_SECRET` and `SEED_SECRET`
4. Create a dedicated MongoDB database and update `DATABASE_URL`
5. Create a dedicated S3 bucket and update `S3_BUCKET`
6. Set `NEXT_PUBLIC_SERVER_URL` to the app's public subdomain
7. Optionally configure SMTP, Stripe, and Sentry
8. Deploy and call `POST /api/seed` with `Authorization: Bearer <SEED_SECRET>` to seed initial data
