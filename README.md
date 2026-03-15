<p align="center">
  <img src="https://img.shields.io/badge/Payload_CMS-3.x-blue?style=flat-square" alt="Payload CMS 3.x" />
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe" alt="Stripe" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb" alt="MongoDB" />
</p>

<h1 align="center">payload-reserve demos</h1>

<p align="center">
  Production-grade booking systems built with <a href="https://github.com/elghaied/payload-reserve"><code>payload-reserve</code></a> — one plugin, four industries.
</p>

<p align="center">
  <a href="https://payloadreserve.com"><strong>Website</strong></a> &nbsp;&middot;&nbsp;
  <a href="https://docs.payloadreserve.com"><strong>Docs</strong></a> &nbsp;&middot;&nbsp;
  <a href="https://github.com/elghaied/payload-reserve"><strong>Plugin Repo</strong></a> &nbsp;&middot;&nbsp;
  <a href="https://payloadreserve.com/demo"><strong>Try a Live Demo</strong></a>
</p>

---

## Live Demos

Each demo is a fully themed, standalone booking app — same plugin, completely different business logic.

<table>
<tr>
<td align="center" width="25%">
<h3>Salon</h3>
<a href="https://salon.payloadreserve.com">salon.payloadreserve.com</a><br/><br/>
<strong>Lumiere Salon</strong> — Specialist-based appointments. Customers book services with individual stylists who each have their own weekly schedule.<br/><br/>
<code>1:1 resource booking</code> <code>per-specialist schedules</code> <code>5min buffer</code> <code>abandoned payment reminders</code>
</td>
<td align="center" width="25%">
<h3>Hotel</h3>
<a href="https://hotel.payloadreserve.com">hotel.payloadreserve.com</a><br/><br/>
<strong>Grand Hotel</strong> — Multi-night stays with quantity-based room inventory. 5 room types from $189 to $1,299/night with housekeeping buffers.<br/><br/>
<code>date-range booking</code> <code>room pools (2–40 units)</code> <code>flexible duration</code> <code>4–6h turnover buffer</code>
</td>
<td align="center" width="25%">
<h3>Restaurant</h3>
<a href="https://restaurant.payloadreserve.com">restaurant.payloadreserve.com</a><br/><br/>
<strong>Le Jardin Dore</strong> — Fine dining with party-size reservations across 5 dining spaces. Full menu, wine list, and chef team showcase.<br/><br/>
<code>party size (1–20)</code> <code>extra reservation fields</code> <code>15min turnover</code> <code>4h cancellation</code>
</td>
<td align="center" width="25%">
<h3>Events</h3>
<a href="https://events.payloadreserve.com">events.payloadreserve.com</a><br/><br/>
<strong>Eclat Festival</strong> — Cultural events across 5 venues (50–500 seats). Ticket quantities for concerts, theater, exhibitions, and more.<br/><br/>
<code>ticket quantities</code> <code>venue-event restrictions</code> <code>per-reservation capacity</code> <code>seasonal programming</code>
</td>
</tr>
</table>

### What Each Demo Proves

| Capability | Salon | Hotel | Restaurant | Events |
|---|:---:|:---:|:---:|:---:|
| Fixed time slots | ✅ | | ✅ | ✅ |
| Flexible date ranges | | ✅ | | |
| Quantity-based capacity | | ✅ | | ✅ |
| Custom reservation fields | | | `partySize` | `ticketQuantity` |
| Resource-specific schedules | ✅ | | | |
| Resource-event restrictions | | | | ✅ |
| Abandoned payment jobs | ✅ | | | |
| Buffer time | 5 min | 4–6 hrs | 15 min | 30 min |
| Cancellation notice | 24h | 48h | 4h | 48h |
| Stripe payments | ✅ | ✅ | ✅ | ✅ |
| EN/FR i18n | ✅ | ✅ | ✅ | ✅ |

---

## Try It — Ephemeral Private Demos

Visit **[payloadreserve.com/demo](https://payloadreserve.com/demo)** to spin up your own private instance of any demo app — no setup required.

The [landing app](./apps/landing) provisions **isolated, time-limited demo environments** on demand via the [Coolify](https://coolify.io) API:

1. Pick a demo type and submit the form (CAPTCHA-protected)
2. A Docker container is created with its own database, S3 storage, and secrets
3. The app is health-polled, seeded with sample data, and marked ready
4. You receive an email with your admin URL, credentials, and a direct link
5. The environment auto-destructs after 24 hours (database dropped, storage cleaned, container deleted)

If all slots are full, requests are queued and provisioned as slots free up.

---

## Quick Start

```bash
git clone https://github.com/elghaied/payloadreserve-demos.git
cd payloadreserve-demos
pnpm install

# Pick a demo
pnpm dev:salon        # port 3000
pnpm dev:hotel        # port 3002
pnpm dev:restaurant   # port 3003
pnpm dev:events       # port 3004
pnpm dev:landing      # port 3001
pnpm dev:docs         # port 3002
```

Each app needs a `.env` file — copy from `.env.example` and fill in your MongoDB URI, Payload secret, and Stripe keys. See each app's README for full setup instructions.

### Clone a Single Demo

Don't need the whole monorepo? Sparse-checkout just the app you want:

```bash
git clone --filter=blob:none --sparse https://github.com/elghaied/payloadreserve-demos.git
cd payloadreserve-demos
git sparse-checkout set apps/salon packages/    # swap "salon" for hotel, restaurant, or events
pnpm install
```

---

## Monorepo Structure

```
payloadreserve-demos/
├── apps/
│   ├── salon/            Specialist appointments         → salon.payloadreserve.com
│   ├── hotel/            Multi-night room booking        → hotel.payloadreserve.com
│   ├── restaurant/       Table reservations              → restaurant.payloadreserve.com
│   ├── events/           Venue ticketing                 → events.payloadreserve.com
│   ├── landing/          Demo provisioning + marketing   → payloadreserve.com
│   └── docs/             Plugin documentation            → docs.payloadreserve.com
├── packages/
│   ├── tsconfig/         Shared TypeScript config
│   ├── seed-utils/       Image upload + admin user helpers
│   ├── types/            Shared types (Demo, DemoStatus, DemoType)
│   ├── coolify-sdk/      Coolify API client for provisioning
│   └── email-templates/  React Email templates
├── turbo.json
└── pnpm-workspace.yaml
```

Built with [Turborepo](https://turbo.build) — `pnpm build` builds everything, `pnpm dev:<app>` runs a single app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **CMS & API** | [Payload CMS](https://payloadcms.com) 3.x |
| **Framework** | [Next.js](https://nextjs.org) 15 (App Router) |
| **UI** | React 19, [Tailwind CSS](https://tailwindcss.com) 4 |
| **Language** | TypeScript 5.7 |
| **Database** | MongoDB (via `@payloadcms/db-mongodb`) |
| **Payments** | [Stripe](https://stripe.com) Checkout |
| **Email** | [Resend](https://resend.com) + [React Email](https://react.email) |
| **Monitoring** | [Sentry](https://sentry.io) |
| **Storage** | S3-compatible (via `@payloadcms/storage-s3`) |
| **i18n** | [next-intl](https://next-intl-docs.vercel.app) (English + French) |
| **Build** | [Turborepo](https://turbo.build) + pnpm workspaces |
| **Deployment** | [Coolify](https://coolify.io) on Hetzner VPS (Docker per app) |
| **Docs** | [Fumadocs](https://fumadocs.vercel.app) |

---

## Deployment

Each app ships as a standalone Docker image, deployed to [Coolify](https://coolify.io) on a Hetzner VPS.

- One Coolify service per app, each with its own env vars
- Separate MongoDB database per app
- S3-compatible storage for media uploads
- Subdomains managed via Coolify + DNS

---

## Requirements

- **Node.js** `^18.20.2 || >=20.9.0`
- **pnpm** `^9 || ^10`
- **MongoDB** instance per app

---

## License

MIT
