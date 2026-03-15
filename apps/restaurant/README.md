# Le Jardin Dore — `payload-reserve` Demo

> **Live:** [restaurant.payloadreserve.com](https://restaurant.payloadreserve.com)

A restaurant reservation app built with **Payload CMS 3.x** + **Next.js 15** (App Router).
Demonstrates **party-size bookings**, custom reservation fields, and short-notice cancellation — a fine dining experience where guests choose dining experiences in specific spaces.

Part of the [`payload-reserve-demos`](../../README.md) monorepo.

---

## What This Demo Shows

| Concept | Implementation |
|---|---|
| **Custom reservation fields** | `partySize` (1–20) added via `extraReservationFields` |
| **Short cancellation window** | 4-hour notice period (same-day bookings friendly) |
| **Table turnover buffer** | 15-minute gap between seatings for cleanup |
| **Rich content collections** | Full menu, wine list, chef team, and dining spaces |
| **Space-based booking** | 5 distinct dining areas with different capacities and ambiance |

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
cp apps/restaurant/.env.example apps/restaurant/.env   # Fill in your values
cd apps/restaurant && pnpm seed                         # Seed sample data
pnpm dev:restaurant                                     # From root, or: cd apps/restaurant && pnpm dev
```

---

## Project Structure

```
apps/restaurant/src/
├── app/
│   ├── (frontend)/[locale]/        # Public-facing pages
│   │   └── book/                   # Booking flow (experience → space → date/time → party size)
│   ├── (payload)/                  # Payload admin panel + REST/GraphQL API routes
│   └── api/stripe-webhook/         # Stripe checkout.session.completed handler
├── collections/
│   ├── Users.ts                    # Admin users
│   ├── Media.ts                    # Image uploads
│   ├── Menu.ts                     # Menu items (5 sections: starters, seafood, mains, cheese, desserts)
│   ├── Team.ts                     # Chef & kitchen staff profiles
│   ├── WineList.ts                 # Wine pairings by section
│   ├── Spaces.ts                   # 5 dining areas (intimate, classic, family, private, terrace)
│   ├── Announcements.ts            # Specials and seasonal events
│   └── Testimonials.ts             # Guest reviews
├── globals/                        # Homepage, SiteSettings
├── seed/
│   ├── index.ts                    # Main seed script
│   ├── dining-experiences.ts       # 5 experiences ($55–$200, 90–180 min)
│   ├── tables.ts                   # Tables per space with capacities
│   ├── schedules.ts                # Table/space availability
│   ├── menu.ts                     # Full 5-course French menu
│   ├── wine-list.ts                # Wine pairings
│   ├── team.ts                     # Chef Laurent, Sophie, Pierre
│   ├── spaces.ts                   # 5 dining spaces
│   ├── testimonials.ts             # Sample reviews
│   └── images.ts                   # Restaurant interior, dishes, staff
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
    services: 'dining-experiences',
    resources: 'tables',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  defaultBufferTime: 15, // minutes — table turnover
  cancellationNoticePeriod: 4, // hours — same-day friendly
  extraReservationFields: [
    {
      name: 'partySize',
      type: 'number',
      min: 1,
      max: 20,
      defaultValue: 2,
    },
  ],
})
```

## `payload-reserve` Collections

| Slug | Description |
|---|---|
| `dining-experiences` | Dining options with price, duration, and description |
| `tables` | Tables/spaces linked to dining experiences |
| `schedules` | Availability per table/space |
| `reservations` | Booking records with `partySize` custom field |
| `customers` | Guest records (separate from admin users) |

---

## Seed Data

### Dining Experiences

| Experience | Price | Duration |
|---|---|---|
| Classic Lunch | $55 | 90 min |
| Tasting Menu | $120 | 150 min |
| Chef's Table | $150 | 180 min |
| Wine Pairing Dinner | $140 | 150 min |
| Private Dining | $200 | 180 min |

### Dining Spaces

| Space | Ambiance |
|---|---|
| Le Coin Intime | Intimate (2–4 guests) |
| La Salle Classique | Classic fine dining |
| Le Salon Familial | Family-friendly |
| Le Salon Prive | Private dining room |
| La Terrasse | Outdoor terrace |

### Team

- **Chef Laurent Beaumont** — Head Chef
- **Sophie Marchand** — Sous Chef
- **Pierre Delacroix** — Pastry Chef

---

## Commands

```bash
# From monorepo root
pnpm dev:restaurant          # Start dev server
pnpm build:restaurant        # Production build

# From apps/restaurant/
pnpm dev                     # Start dev server
pnpm devsafe                 # Wipe .next cache + dev
pnpm seed                    # Seed database
pnpm test                    # Run all tests
pnpm test:int                # Vitest integration tests
pnpm test:e2e                # Playwright e2e tests
```

---

## URLs

| URL | Description |
|---|---|
| `http://localhost:3003` | Frontend (defaults to `/en`) |
| `http://localhost:3003/fr` | French locale |
| `http://localhost:3003/admin` | Payload admin panel |
| `http://localhost:3003/api` | Payload REST API |
