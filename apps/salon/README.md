# Lumière Salon — `payload-reserve` Demo

A full-stack booking app built with **Payload CMS 3.x** + **Next.js 15** (App Router).
It is the reference implementation for the [`payload-reserve`](https://www.npmjs.com/package/payload-reserve) plugin and lives inside the `payload-reserve-demos` monorepo.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| CMS / API | Payload CMS 3.x |
| Database | MongoDB (via `@payloadcms/db-mongodb`) |
| Plugin | `payload-reserve` v1.1.0 |
| Payments | Stripe Checkout |
| Email | Nodemailer (SMTP) |
| i18n | `next-intl` (English + French) |
| Styling | Tailwind CSS v4 |
| Testing | Vitest (integration) + Playwright (e2e) |

---

## Prerequisites

- **Node.js** `>=20.9.0`
- **pnpm** `>=10`
- **MongoDB** running locally on `mongodb://127.0.0.1`
- **Stripe CLI** installed → [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

---

## First-Time Setup

```bash
# 1. Install dependencies (run from monorepo root)
pnpm install

# 2. Copy the env file and fill in your values
cp apps/salon/.env.example apps/salon/.env

# 3. Seed the database (services, specialists, schedules, sample data)
cd apps/salon && pnpm seed
```

### Required environment variables (`apps/salon/.env`)

```env
# MongoDB
DATABASE_URL=mongodb://127.0.0.1/payloadreserve-salon-demo

# Payload
PAYLOAD_SECRET=any-random-secret-string

# Stripe (test keys from dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # ← filled automatically by stripe-listen.sh (see below)

# Email (optional — leave blank to skip sending emails)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=salon@lumiere-salon.com
SMTP_FROM_NAME=Lumière Salon

# App URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Starting the Dev Environment

### Recommended: VS Code Tasks (two terminals)

Press **`Ctrl+Shift+B`** (or `Ctrl+Shift+P` → "Tasks: Run Task" → `dev:salon`).

This opens **two terminal panels in parallel**:

| Terminal | Command | What it does |
|---|---|---|
| **salon: next dev** | `pnpm dev:salon` | Starts the Next.js + Payload dev server on port 3000 |
| **salon: stripe listen** | `bash scripts/stripe-listen.sh salon 3000` | Forwards Stripe webhooks to localhost and auto-updates `.env` |

### Manual (two separate terminals)

```bash
# Terminal 1 — from monorepo root
pnpm dev:salon

# Terminal 2 — from monorepo root
bash scripts/stripe-listen.sh salon 3000
```

> **Important:** both processes must be running at the same time when testing payments.
> Stopping `stripe listen` means Stripe events never reach the app and reservations stay `pending`.

---

## How `scripts/stripe-listen.sh` Works

The Stripe CLI generates a **new webhook signing secret every time** `stripe listen` starts.
Without the correct secret, the webhook handler rejects all incoming events (signature mismatch → 400).

The script solves this automatically:

1. Runs `stripe listen --forward-to localhost:3000/api/stripe-webhook`
2. Parses the `whsec_xxx` secret the CLI prints on its first line of output
3. Writes `STRIPE_WEBHOOK_SECRET=whsec_xxx` into `apps/salon/.env`
4. Next.js dev server detects the `.env` change and restarts within seconds

After that the full payment flow works end-to-end:

```
User pays → Stripe → CLI tunnel → POST /api/stripe-webhook → status: confirmed
```

---

## All Commands

### From monorepo root

```bash
pnpm dev:salon           # Start salon dev server (turbo)
pnpm build:salon         # Production build
pnpm build               # Build all apps
pnpm lint                # Lint all apps
pnpm generate:types      # Regenerate payload-types.ts (run after schema changes)
pnpm generate:importmap  # Regenerate admin import map (run after adding admin components)
```

### From `apps/salon/`

```bash
pnpm dev          # Start dev server
pnpm devsafe      # Wipe .next cache then start dev (use when hot-reload breaks)
pnpm seed         # Seed database with services, specialists, schedules
pnpm test         # Run all tests (integration + e2e)
pnpm test:int     # Vitest integration tests only
pnpm test:e2e     # Playwright e2e tests only
npx tsc --noEmit  # Type-check without building
```

---

## Project Structure

```
apps/salon/src/
├── app/
│   ├── (frontend)/[locale]/     # Public-facing pages (book, account, cancel, success)
│   │   └── book/
│   │       ├── actions.ts       # Server actions: create reservation, Stripe checkout, slots
│   │       ├── cancel/          # Cancel page (pending reservations only)
│   │       └── success/         # Post-payment confirmation page
│   ├── (payload)/               # Payload admin panel + REST/GraphQL API routes
│   └── api/stripe-webhook/      # POST handler for Stripe checkout.session.completed
├── collections/                 # Payload collection configs (Users, Media, Gallery, …)
├── email/templates/             # HTML email templates (confirmation, cancellation, abandonedPayment)
├── globals/                     # Payload globals (Homepage, SiteSettings)
├── hooks/
│   └── reservationNotifications.ts  # Plugin callbacks → send emails on confirm/cancel
├── i18n/                        # next-intl routing + request config
├── seed/                        # Seed scripts and static data
├── tasks/
│   ├── cancelStaleReservations.ts   # Payload job: cancels unpaid pending reservations after 30 min
│   └── notifyAbandonedPayments.ts   # Payload job: emails customers who haven't completed payment
├── payload.config.ts            # Main Payload config — plugin, collections, email, jobs
└── payload-types.ts             # Auto-generated — DO NOT edit manually
```

### Path aliases (in `tsconfig.json`)

| Alias | Resolves to |
|---|---|
| `@/*` | `./src/*` |
| `@payload-config` | `./src/payload.config.ts` |

---

## How the Booking Flow Works

```
1. User selects service + specialist + date/time
2. createReservation() creates a Reservation with status: "pending"
3. Stripe Checkout session is created (metadata: { reservationId })
4. User pays with test card 4242 4242 4242 4242
5. Stripe fires checkout.session.completed webhook
6. /api/stripe-webhook updates Reservation to status: "confirmed"
7. Success page shows confirmation
```

### `payload-reserve` plugin collections (auto-created)

| Slug | Description |
|---|---|
| `services` | Treatments/services with price, duration, category |
| `specialists` | Staff members linked to services they offer |
| `schedules` | Weekly availability per specialist |
| `reservations` | Booking records with status, startTime, customer, service, resource |
| `customers` | Customers (separate from admin `users`) |

---

## Background Jobs

Two Payload jobs run on a schedule to handle abandoned checkouts:

| Job | Schedule | What it does |
|---|---|---|
| `notifyAbandonedPayments` | Every 5 min | Emails customers whose reservation has been `pending` for 5+ minutes without payment |
| `cancelStaleReservations` | Every 15 min | Cancels reservations still `pending` after 30 minutes |

The abandoned payment reminder uses a `paymentReminderSent` flag on the reservation (added via `extraReservationFields`) to guarantee exactly one email per reservation, regardless of server restarts or cron timing.

Defined in: `src/tasks/`

---

## Email Notifications

Emails are sent via Nodemailer. Hook callbacks in `src/hooks/reservationNotifications.ts` fire on:

| Event | Email sent |
|---|---|
| Booking confirmed (paid) | "Booking confirmed" |
| Booking cancelled | "Cancellation" |

The abandoned payment reminder is handled separately by the `notifyAbandonedPayments` job (`src/tasks/notifyAbandonedPayments.ts`).

Leave SMTP env vars blank in development to skip email sending silently.

---

## After Schema Changes

Always run these two commands after modifying any collection/global config:

```bash
# From monorepo root:
pnpm generate:types       # Updates src/payload-types.ts
pnpm generate:importmap   # Updates admin import map (only needed for admin UI components)
```

---

## URLs

| URL | Description |
|---|---|
| `http://localhost:3000` | Frontend (defaults to `/en`) |
| `http://localhost:3000/fr` | French locale |
| `http://localhost:3000/admin` | Payload admin panel |
| `http://localhost:3000/api` | Payload REST API |
