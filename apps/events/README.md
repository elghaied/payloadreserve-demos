# Eclat Festival — `payload-reserve` Demo

> **Live:** [events.payloadreserve.com](https://events.payloadreserve.com)

An event ticketing app built with **Payload CMS 3.x** + **Next.js 15** (App Router).
Demonstrates **per-reservation capacity mode** — customers purchase ticket quantities for events at specific venues, with venue-event type restrictions and seasonal programming.

Part of the [`payload-reserve-demos`](../../README.md) monorepo.

---

## What This Demo Shows

| Concept | Implementation |
|---|---|
| **Per-reservation capacity** | Each booking deducts ticket quantity from venue seat count |
| **Custom reservation fields** | `ticketQuantity` (1–10) added via `extraReservationFields` |
| **Venue-event restrictions** | Certain event types only available at compatible venues |
| **Setup/cleanup buffers** | 30-minute buffer between events for staging |
| **Long cancellation window** | 48-hour cancellation notice period |
| **Seasonal programming** | Events organized by seasons (Spring, Summer, Autumn, Winter) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| CMS / API | Payload CMS 3.x |
| Database | MongoDB (via `@payloadcms/db-mongodb`) |
| Plugin | `payload-reserve` |
| Payments | Stripe Checkout |
| i18n | `next-intl` (English + French) |
| Styling | Tailwind CSS v4 |
| Testing | Vitest (integration) + Playwright (e2e) |

---

## Prerequisites

- **Node.js** `>=20.9.0`
- **pnpm** `>=10`
- **MongoDB** running locally
- **Stripe CLI** installed (for webhook forwarding)

---

## Quick Start

```bash
# From monorepo root
pnpm install
cp apps/events/.env.example apps/events/.env   # Fill in your values
cd apps/events && pnpm seed                     # Seed sample data
pnpm dev:events                                 # From root, or: cd apps/events && pnpm dev
```

---

## Project Structure

```
apps/events/src/
├── app/
│   ├── (frontend)/[locale]/        # Public-facing pages
│   │   └── book/                   # Booking flow (event type → venue → date/time → tickets)
│   ├── (payload)/                  # Payload admin panel + REST/GraphQL API routes
│   └── api/stripe-webhook/         # Stripe checkout.session.completed handler
├── collections/
│   ├── Users.ts                    # Admin users
│   ├── Media.ts                    # Image uploads
│   ├── Artists.ts                  # Performer/director/artist profiles (6 artists)
│   ├── Seasons.ts                  # Festival calendar (Spring, Summer, Autumn, Winter)
│   ├── Announcements.ts            # Featured shows and upcoming events
│   └── Testimonials.ts             # Festival reviews
├── globals/                        # Homepage, SiteSettings
├── seed/
│   ├── index.ts                    # Main seed script
│   ├── event-types.ts              # 6 event types ($12–$40, 90–180 min)
│   ├── venues.ts                   # 5 venues (50–500 seats)
│   ├── schedules.ts                # Venue availability
│   ├── artists.ts                  # 6 artists (pianist, actor, visual artist, filmmaker, dancer, historian)
│   ├── seasons.ts                  # 4 seasonal programs
│   ├── announcements.ts            # Featured events
│   ├── testimonials.ts             # Sample reviews
│   └── images.ts                   # Venue and artist photos
├── tasks/
│   └── cancelStaleReservations.ts  # Auto-cancel unpaid bookings
├── i18n/                           # next-intl routing config
├── payload.config.ts               # Main config — plugin, collections, jobs
└── payload-types.ts                # Auto-generated types
```

---

## Plugin Configuration

```ts
payloadReserve({
  slugs: {
    services: 'event-types',
    resources: 'venues',
    schedules: 'schedules',
    reservations: 'bookings',
  },
  defaultBufferTime: 30, // minutes — setup/cleanup between events
  cancellationNoticePeriod: 48, // hours
  extraReservationFields: [
    {
      name: 'ticketQuantity',
      type: 'number',
      min: 1,
      max: 10,
      defaultValue: 1,
    },
  ],
})
```

## `payload-reserve` Collections

| Slug | Description |
|---|---|
| `event-types` | Event categories with price, duration, and description |
| `venues` | Performance spaces with seat capacity and event-type restrictions |
| `schedules` | Venue availability windows |
| `bookings` | Ticket reservations with `ticketQuantity` custom field |
| `customers` | Attendee records (separate from admin users) |

---

## Seed Data

### Event Types

| Type | Price | Duration |
|---|---|---|
| Concert | $35 | 120 min |
| Theater | $40 | 150 min |
| Exhibition | $15 | 90 min |
| Film Screening | $12 | 120 min |
| Workshop | $25 | 90 min |
| Dance | $30 | 120 min |

### Venues

| Venue | Capacity | Supported Events |
|---|---|---|
| Grande Salle | 500 | Concert, Theater, Dance |
| Salon Noir | 100 | Theater, Film, Workshop |
| Galerie Lumiere | 80 | Exhibition, Workshop |
| Studio Eclat | 50 | Film, Workshop |
| La Terrasse | 200 | Concert, Film, Dance |

### Artists

- **Lucien Marais** — Pianist
- **Camille Beaufort** — Actor/Director
- **Yuki Tanaka** — Visual Artist
- **Reda Benali** — Filmmaker
- **Eloise Dupont** — Dancer
- **Marc-Antoine Levy** — Historian

---

## Commands

```bash
# From monorepo root
pnpm dev:events          # Start dev server
pnpm build:events        # Production build

# From apps/events/
pnpm dev                 # Start dev server
pnpm devsafe             # Wipe .next cache + dev
pnpm seed                # Seed database
pnpm test                # Run all tests
pnpm test:int            # Vitest integration tests
pnpm test:e2e            # Playwright e2e tests
```

---

## URLs

| URL | Description |
|---|---|
| `http://localhost:3004` | Frontend (defaults to `/en`) |
| `http://localhost:3004/fr` | French locale |
| `http://localhost:3004/admin` | Payload admin panel |
| `http://localhost:3004/api` | Payload REST API |
