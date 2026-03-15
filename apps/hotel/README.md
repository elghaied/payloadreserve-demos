# Grand Hotel — `payload-reserve` Demo

> **Live:** [hotel.payloadreserve.com](https://hotel.payloadreserve.com)

A hotel booking app built with **Payload CMS 3.x** + **Next.js 15** (App Router).
Demonstrates **quantity-based, flexible-duration booking** — multiple rooms of the same type, multi-night stays with date-range selection.

Part of the [`payload-reserve-demos`](../../README.md) monorepo.

---

## What This Demo Shows

| Concept | Implementation |
|---|---|
| **Quantity-based capacity** | Each room type has a pool of rooms (e.g., 40 Classic, 2 Presidential) |
| **Flexible-duration booking** | Guests pick check-in/check-out dates — not fixed time slots |
| **Housekeeping buffers** | 4–6 hour buffer after checkout before next guest |
| **Long cancellation window** | 48-hour cancellation notice period |
| **No inter-booking buffer** | `defaultBufferTime: 0` — rooms handle turnover via per-resource buffer |

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
cp apps/hotel/.env.example apps/hotel/.env   # Fill in your values
cd apps/hotel && pnpm seed                    # Seed sample data
pnpm dev:hotel                                # From root, or: cd apps/hotel && pnpm dev
```

---

## Project Structure

```
apps/hotel/src/
├── app/
│   ├── (frontend)/[locale]/        # Public-facing pages
│   │   └── book/                   # Booking flow (room selection → dates → payment)
│   ├── (payload)/                  # Payload admin panel + REST/GraphQL API routes
│   └── api/stripe-webhook/         # Stripe checkout.session.completed handler
├── collections/
│   ├── Users.ts                    # Admin users
│   ├── Media.ts                    # Image uploads
│   ├── Amenities.ts                # Hotel amenities (Pool, Spa, Restaurant, Fitness)
│   ├── Testimonials.ts             # Guest reviews
│   └── Gallery.ts                  # Hotel photo gallery
├── globals/                        # Homepage, SiteSettings
├── seed/
│   ├── index.ts                    # Main seed script
│   ├── room-types.ts               # 5 room types ($189–$1,299/night)
│   ├── rooms.ts                    # Room instances with quantities
│   ├── schedules.ts                # Room availability schedules
│   ├── amenities.ts                # Pool, Spa, Restaurant, Fitness Center
│   ├── testimonials.ts             # Sample guest reviews
│   └── images.ts                   # Hotel exterior, lobby, room photos
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
    services: 'room-types',
    resources: 'rooms',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  defaultBufferTime: 0,
  cancellationNoticePeriod: 48, // hours
})
```

## `payload-reserve` Collections

| Slug | Description |
|---|---|
| `room-types` | Room categories with price, duration (1 night = 1440 min), flexible duration |
| `rooms` | Individual rooms or room pools linked to room types |
| `schedules` | Availability windows per room/room type |
| `reservations` | Booking records (guest, room type, check-in/out, status) |
| `customers` | Guest records (separate from admin users) |

---

## Seed Data

| Room Type | Price/Night | Quantity | Buffer After |
|---|---|---|---|
| Classic Room | $189 | 40 | 4 hours |
| Superior Room | $279 | 25 | 4 hours |
| Deluxe Suite | $449 | 15 | 5 hours |
| Executive Suite | $749 | 5 | 5 hours |
| Presidential Suite | $1,299 | 2 | 6 hours |

Amenities: Pool, Spa & Wellness, Restaurant, Fitness Center

---

## Commands

```bash
# From monorepo root
pnpm dev:hotel          # Start dev server
pnpm build:hotel        # Production build

# From apps/hotel/
pnpm dev                # Start dev server
pnpm devsafe            # Wipe .next cache + dev
pnpm seed               # Seed database
pnpm lint               # Lint
```

---

## URLs

| URL | Description |
|---|---|
| `http://localhost:3002` | Frontend (defaults to `/en`) |
| `http://localhost:3002/fr` | French locale |
| `http://localhost:3002/admin` | Payload admin panel |
| `http://localhost:3002/api` | Payload REST API |
