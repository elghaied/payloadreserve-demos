# Éclat Events App — Frontend Design Spec

**Date:** 2026-03-13
**App:** `apps/events/`
**Stack:** Next.js 15 (App Router) + Payload CMS 3.x + Tailwind v4 + shadcn/ui + next-intl v4

---

## 0. Required Backend Schema Changes

Before frontend implementation, the following changes must be made to the events app backend:

### 0.1 Add `slug` field to Announcements collection
Add an auto-generated `slug` field (derived from `title`) to `src/collections/Announcements.ts`. This enables clean URLs for event detail pages (`/programme/jazz-au-jardin`).

### 0.2 Add `eventType` relationship to Announcements collection
Add a `relationship` field to `Announcements` linking to `event-types`. This allows announcement cards to display the correct event type color and enables the Programme page filtering.

### 0.3 Add `venue` relationship to Announcements collection
Add a `relationship` field to `Announcements` linking to `venues`. This enables venue filtering on the Programme page and displays venue info on event detail pages.

### 0.4 Update seed data
Update `src/seed/data/announcements.ts` to include the new `eventType` and `venue` relationships, and ensure slug values are generated. Update `src/seed/data/homepage.ts` to use the correct frontend route paths (`/programme`, `/reserver` instead of `/events`, `/book`).

### 0.5 Add `seats` field to venue descriptions or plugin config
The `payload-reserve` plugin's `quantity` field on venues represents concurrent booking capacity (set to `1` for all venues), NOT physical seat count. The seed data has a `seats` property (e.g., 500, 100, 80) but this is not an actual Payload field and is silently ignored.

**Resolution:** The venue `description` field already includes capacity text (e.g., "Seats 500 guests"). The frontend will parse and display seat count from the description where needed, or simply not display a structured seat count. All spec references to displaying "quantity as seat count" are replaced with description-based capacity info.

### 0.6 Clarify Announcement `type` select vs `eventType` relationship
The Announcements collection has an existing `type` select field (values: `concert-series`, `festival`, `exhibition-opening`, `special-screening`, `workshop-series`, `gala`). The new `eventType` relationship (Section 0.2) links to the `event-types` collection. These serve different purposes:
- `type` — editorial category for the announcement itself (kept for admin organization)
- `eventType` — links to the bookable event type (drives color display and booking flow)

Both fields are retained. The frontend uses ONLY the `eventType` relationship for color resolution and booking links. The `type` select field is ignored by the frontend.

### 0.7 Fix customer seed data
The seed orchestrator currently creates test customers in the `users` collection instead of the `customers` collection. This must be fixed so that seeded bookings correctly reference customer IDs.

### 0.8 Venue and event-type URL strategy
Venues and event-types are plugin-generated collections (from `payload-reserve`) without a `slug` field. The `name` field is localized.

**URL generation:** Use `slugify(venue.name)` to create URL-safe paths (e.g., "Grande Salle" → `/espaces/grande-salle`).

**Lookup strategy:** Do NOT use a lossy `deslugify()` round-trip. Instead, fetch all venues/event-types in the page's server component, build a slug map by applying `slugify()` to each name, and match against the URL param:

```typescript
const venues = await payload.find({ collection: 'venues', locale: loc })
const venue = venues.docs.find(v => slugify(v.name) === slug)
if (!venue) notFound()
```

**Locale consideration:** Since `name` is localized, the same venue may produce different slugs per locale. This is acceptable — links are always generated from the current locale's data, and lookups match against the current locale's names.

A `slugify()` utility in `src/lib/utils.ts` handles this (lowercase, replace spaces with hyphens, remove accents/special chars).

---

## 1. Visual Identity

**Direction:** Swiss Grid — bold black/white foundation with a 6-color event type system as the brand signature.

### Color System

| Token | Hex | Usage |
|---|---|---|
| `background` | `#ffffff` | Page background |
| `foreground` | `#000000` | Primary text, borders, fills |
| `muted` | `#666666` | Secondary text |
| `muted-light` | `#e5e5e5` | Dividers, subtle borders |
| `concert` | `#e53e3e` | Concert event type accent |
| `theater` | `#d69e2e` | Theater event type accent |
| `exhibition` | `#3182ce` | Exhibition event type accent |
| `film` | `#805ad5` | Film Screening event type accent |
| `workshop` | `#38a169` | Workshop event type accent |
| `dance` | `#dd6b20` | Dance Performance event type accent |

The 6-color stripe (one band per event type) is the recurring brand motif — appears in the header, footer, section dividers, booking wizard progress bar, and card accents.

### Typography

| Role | Font | Weight | Size | Style |
|---|---|---|---|---|
| Hero headline | Inter | Black (900) | 56-72px | Uppercase, letter-spacing -3px |
| Section heading | Inter | Black (900) | 32-40px | Uppercase, letter-spacing -1px |
| Card title | Inter | Bold (700) | 18-20px | Normal case |
| Body text | Inter | Regular (400) | 16px | Relaxed line-height (1.6) |
| Labels/meta | JetBrains Mono / system monospace | Regular | 9-11px | Uppercase, letter-spacing 2-3px |

Fonts loaded via `next/font` (built into Next.js 15, no additional package needed).

### Grid & Borders

- Heavy **3px black borders** creating compartments between sections
- Content lives in strict rectangular zones
- Cards use a thick **top-border** (or left-border) in their event type color
- Generous internal padding, tight external gutters
- CSS Grid for page-level layouts; flexbox acceptable within components and shadcn/ui internals

### Motion

- **Fade-in on scroll:** Intersection Observer with a small custom hook, 0.3s ease, subtle translate-y from 12px. Pure CSS transitions — no framer-motion dependency.
- **Hover states:** Cards lift with slight shadow, buttons invert black↔white
- **Page transitions:** Content fades in from bottom (0.2s ease)
- No parallax, no WebGL, no complex animations

---

## 2. Pages & Routing

All routes nested under `[locale]/` (`/en/...`, `/fr/...`).

| Route | Page | Description |
|---|---|---|
| `/` | Root redirect | Redirects to `/en` |
| `/[locale]` | Homepage | Hero + 8 content sections |
| `/[locale]/programme` | Programme | Filterable event listing (grid/list/calendar) |
| `/[locale]/programme/[slug]` | Event Detail | Single announcement by slug, with booking CTA |
| `/[locale]/espaces` | Venues | All 5 venues |
| `/[locale]/espaces/[slug]` | Venue Detail | Single venue (by slugified name) + upcoming events |
| `/[locale]/artistes` | Artists | Featured artist grid |
| `/[locale]/saison` | Season | Current season overview |
| `/[locale]/reserver` | Booking Wizard | 4-step booking flow |
| `/[locale]/compte` | Account | Customer login/register + bookings |

### Shared Layout

**Header:**
- Left: `ÉCLAT` logo in Inter Black
- Center: Nav links — `Programme · Espaces · Artistes · Saison`
- Right: `EN|FR` language toggle + `Réserver` button (black fill, white text)
- 3px black bottom border
- 6-color stripe (6px tall) directly below the border

**Footer:**
- 6-color stripe (6px tall) at the very top
- 3px black top border
- 3-column grid:
  - Column 1: Venue name, address, phone, email
  - Column 2: Box office hours (from `site-settings.boxOfficeHours`)
  - Column 3: Social links (Instagram, Facebook, YouTube) + policy links
- Copyright row at bottom

### SEO & Metadata

Every page exports `generateMetadata()` returning localized title, description, and OpenGraph tags. The `site-settings` global provides `venueName` and `tagline` for the base title template (e.g., "Programme — Éclat · Centre Culturel").

### Error Handling

- `not-found.tsx` at the `[locale]` layout level — styled 404 with link back to homepage
- `error.tsx` at the `[locale]` layout level — generic error boundary with retry button
- `loading.tsx` at page level where appropriate (programme, booking wizard)

---

## 3. Homepage Sections

All headings/body text come from the `homepage` global via Payload local API with `locale` parameter.

### 3.1 Hero
- **Layout:** Split grid — left 60% text, right 40% image
- **Left:** `heroTitle` as oversized Inter Black headline, `heroSubtitle` below, `heroCtaText` button linking to `heroCtaLink`
- **Right:** `heroBackgroundImage` — full bleed, object-cover
- **Border:** 3px black divider between left/right, 6-color stripe at bottom of section

### 3.2 About
- **Heading:** `aboutHeading`
- **Layout:** Two-column — left text, right image
- **Left:** `aboutBody` text + `aboutEstablished` displayed as a prominent date/badge (e.g., "Est. 2003")
- **Right:** `aboutImage` — cropped with 3px black border
- **Data:** `homepage` global (About tab fields)

### 3.3 What's On (Announcements)
- **Heading:** `announcementsHeading` + `announcementsSubtitle`
- **Content:** Horizontal scroll of announcement cards (only `active: true` + `featured: true`)
- **Card:** Image top, event type color bar (3px, from linked `eventType` relationship), title, date range, `ctaText` button
- **Data:** `announcements` collection with `eventType` relationship populated (depth: 1)

### 3.4 Programming (Event Types)
- **Heading:** `programmingHeading` + `programmingSubtitle`
- **Layout:** 3×2 grid of event type cards
- **Card:** Thick left-border in event type color, name, duration, price
- **Data:** `event-types` collection (all 6 active types)

### 3.5 Our Venues
- **Heading:** `venuesHeading` + `venuesSubtitle`
- **Layout:** Alternating image-left/image-right rows
- **Card:** Venue image, name, description excerpt (includes capacity info), supported event types as small colored dots
- **Data:** `venues` collection (all 5 venues) with `services` relationship populated

### 3.6 Artists
- **Heading:** `artistsHeading` + `artistsSubtitle`
- **Layout:** Horizontal row of featured artist cards
- **Card:** Photo (square crop), name, specialty badge
- **Data:** `artists` collection where `featured: true`

### 3.7 Testimonials
- **Heading:** `testimonialsHeading` + `testimonialsSubtitle`
- **Layout:** 3-column grid
- **Card:** Quote text (localized), star rating, author name, event type badge (colored, from linked `eventType` relationship)
- **Data:** `testimonials` collection where `featured: true`, with `eventType` populated

### 3.8 CTA Banner
- **Layout:** Full-width black background
- **Content:** `ctaHeading` (white text), `ctaBody`, `ctaButtonText` button (inverted — white fill, black text) linking to `ctaButtonLink`

---

## 4. Programme Page

### Filter Bar
- **Event type pills:** 6 colored pills, toggleable (multi-select). Each pill uses its event type color. Color resolved from the announcement's populated `eventType` relationship.
- **Venue dropdown:** Select from 5 venues (or "All venues"). Filters announcements by their `venue` relationship.
- **Date picker:** Calendar date picker or "This week / This month / All" quick filters
- All filters applied client-side (initial data fetched server-side, filtered in state)

### View Toggle
Three views selectable via toggle buttons in the filter bar:

**Grid view (default):**
- Cards in responsive grid (3 columns desktop, 2 tablet, 1 mobile)
- Card: image, type color bar (3px top border, from populated `eventType`), title, venue name (from populated `venue`), date, price (from populated `eventType.price`), small "Book" button

**List view:**
- Compact horizontal rows
- Row: date (monospace) | event type color dot | title | venue | price | "Réserver →" link

**Calendar view:**
- Month grid showing event density as colored dots per day
- Click a day to expand into a list of that day's events below the calendar
- Navigation arrows for month-to-month

### Data Source
- Primary: `announcements` collection with `depth: 2` to populate both `eventType` and `venue` relationships
- Event type provides: color, name, duration, price
- Venue provides: name, description
- Announcements without an `eventType` relationship fall back to a neutral gray accent

---

## 5. Event Detail Page

- **Route:** `/[locale]/programme/[slug]`
- **Data:** Single announcement fetched by `slug` field, with `eventType` and `venue` relationships populated (`depth: 2`)

### Layout
- **Hero:** Full-width image from announcement
- **Info bar:** Event type badge (colored, from populated `eventType`), date range, venue name (from populated `venue`) — all prominent, in a 3px-bordered box
- **Body:** `description` text (localized)
- **Artist section:** Show artists whose `specialty` matches the event type category. Mapping: `musician`→Concert, `actor`→Theater, `visual-artist`→Exhibition, `filmmaker`→Film Screening, `dancer`→Dance Performance, `speaker`→Workshop. Artists fetched with a separate query filtered by specialty.
- **Venue card:** Compact card showing the populated venue — image, name, description excerpt, link to venue detail page
- **Sticky bottom bar:** Fixed to bottom of viewport — "Réserver" button linking to `/reserver?eventType={eventTypeId}&venue={venueId}` (pre-selects in the booking wizard)

---

## 6. Venues Pages

### `/[locale]/espaces` — All Venues
- Grid of 5 venue cards (2-column desktop, 1-column mobile)
- Card: large image, venue name, description excerpt (includes capacity), supported event types as colored dots (from populated `services`), link to detail

### `/[locale]/espaces/[slug]` — Venue Detail
- **URL strategy:** Slug generated from venue name via `slugify()`. Fetched by loading all venues and matching `slugify(venue.name) === slug` (see Section 0.8).
- **Hero:** Venue image, full-width
- **Info grid:** Name, supported event types (colored badges from populated `services`), description (includes capacity info)
- **Schedule:** Weekly operating hours from the venue's linked schedule (fetched via `schedules` collection where `resource` equals this venue)
- **Upcoming at this venue:** List of upcoming announcements where `venue` equals this venue ID

---

## 7. Artists Page

- `/[locale]/artistes`
- Grid of artist cards (3-column desktop, 2 tablet, 1 mobile)
- **Card:** Square photo, name, specialty badge (colored — mapped to the related event type color via the specialty→event-type mapping in Section 5), bio excerpt (first ~100 chars of `bio`)
- Featured artists (`featured: true`) appear first and are visually larger
- `website` field shown as external link icon if present

### Artist Specialty → Event Type Color Mapping

| Artist Specialty | Related Event Type | Color |
|---|---|---|
| `musician` | Concert | `#e53e3e` |
| `actor` | Theater | `#d69e2e` |
| `visual-artist` | Exhibition | `#3182ce` |
| `filmmaker` | Film Screening | `#805ad5` |
| `dancer` | Dance Performance | `#dd6b20` |
| `speaker` | Workshop | `#38a169` |

This mapping lives alongside the event type color mapping in `src/lib/event-colors.ts`.

---

## 8. Season Page

- `/[locale]/saison`
- Current/upcoming season highlighted (determined by `startDate`/`endDate` vs current date)
- **Hero:** Season `featuredImage`, name, date range
- **Body:** Season `description` (localized)
- **Upcoming seasons:** Smaller cards for future seasons
- **Link to programme:** "Explore this season's events" button linking to `/programme` with date filter pre-set

---

## 9. Booking Wizard

- `/[locale]/reserver`
- 4-step wizard, each step is a full-page section (not a modal)
- Accepts optional query params `?eventType={id}&venue={id}` to pre-select steps 1 and 2

**Note:** The booking wizard operates on `event-types` (services) and `venues` (resources) from the `payload-reserve` plugin — not on announcements. Announcements are editorial/marketing entities. When a user clicks "Réserver" from an event detail page, the announcement's linked `eventType` and `venue` IDs are passed as query params to pre-fill the wizard.

### Progress Bar
- Horizontal bar at top of the wizard
- 4 segments, filled with the 6-color stripe gradient as steps are completed
- Current step has a bold label; completed steps show a checkmark

### Step 1: Select Event Type
- 6 cards in a 3×2 grid, each with the event type color as thick top border
- Shows: name, duration, price
- Click to select → advances to Step 2
- If `?eventType` query param present, pre-selected and can skip to Step 2

### Step 2: Select Venue & Time
- Venue cards filtered to those supporting the selected event type (via venue's `services` array)
- After selecting a venue, show a date picker
- After selecting a date, show available time slots from the venue's schedule
- Time slots displayed as buttons in a grid
- If `?venue` query param present, pre-selected

### Step 3: Tickets & Customer Info
- Ticket quantity selector (1-10, the `ticketQuantity` extra field)
- Price calculation displayed (event type price × quantity)
- If not logged in: login form or register form (customer collection auth)
- If logged in: pre-filled customer name/email with option to edit

### Step 4: Review & Confirm
- Summary of all selections: event type, venue, date, time, tickets, total price
- Cancellation policy note (from `site-settings.cancellationPolicy`)
- "Confirmer la Réservation" button
- On submit: creates booking via server action with `overrideAccess: false`
- Success: redirect to `/compte` with success message

---

## 10. Account Page

- `/[locale]/compte`
- Auth-guarded layout (redirect to login if not authenticated)

### Login/Register
- Tab interface: "Se Connecter" / "Créer un Compte"
- Login: email + password
- Register: firstName, lastName, email, phone, password
- Uses Payload customer collection auth

### Dashboard (after login)
- **Upcoming Bookings:** Cards showing event type (colored badge), venue, date, time, ticket count, status badge. Cancel button for bookings >48h away.
- **Past Bookings:** Compact list with status (completed, cancelled, no-show)
- **Cancel flow:** Confirmation dialog with cancellation policy reminder. If within 48h, show warning that cancellation is not allowed.

---

## 11. Technical Architecture

### Data Fetching Pattern

All pages use the Payload local API with locale parameter:

```typescript
const { locale } = await params
setRequestLocale(locale)
const loc = locale as 'en' | 'fr'
const payload = await getPayload({ config })

const [data1, data2] = await Promise.all([
  payload.findGlobal({ slug: 'homepage', locale: loc }),
  payload.find({
    collection: 'announcements',
    locale: loc,
    depth: 2, // populate eventType and venue relationships
    where: { active: { equals: true } },
  }),
])
```

### Component Architecture

- **Server Components** by default — all data fetching at page level, passed as typed props
- **`'use client'`** only for:
  - `Header` — mobile menu toggle state
  - `LanguageToggle` — locale switch interaction
  - `EventFilters` — filter state + view toggle on programme page
  - `CalendarView` — interactive month calendar
  - `BookingWizard` — multi-step form state
  - `AccountForms` — login/register form state
- Client components receive `locale` as prop for link generation

### i18n

- `next-intl` v4 with `en` (default) and `fr` locales
- `src/messages/en.json` and `src/messages/fr.json` — UI labels only (nav, buttons, filters, form labels, error messages)
- All editorial content (headings, descriptions, bios, policies) from Payload with `locale` parameter
- `setRequestLocale(locale)` in every page and layout
- Server components: `getTranslations({ locale, namespace })` for UI labels (matching existing codebase convention)
- Client components: `useTranslations(namespace)` hook within `NextIntlClientProvider`

### Server Actions

- `src/app/(frontend)/[locale]/reserver/actions.ts` — booking creation, availability checks
- `src/app/(frontend)/[locale]/compte/actions.ts` — customer auth (login, register, logout), fetch bookings, cancel booking
- All actions accept `locale` as parameter for Payload calls
- Booking creation uses `overrideAccess: false` with authenticated customer

### File Structure

```
src/
├── app/(frontend)/
│   ├── [locale]/
│   │   ├── layout.tsx              # NextIntlClientProvider, Header, Footer
│   │   ├── page.tsx                # Homepage
│   │   ├── not-found.tsx           # Styled 404
│   │   ├── error.tsx               # Error boundary
│   │   ├── programme/
│   │   │   ├── page.tsx            # Event listing
│   │   │   ├── loading.tsx         # Loading skeleton
│   │   │   └── [slug]/page.tsx     # Event detail
│   │   ├── espaces/
│   │   │   ├── page.tsx            # Venues grid
│   │   │   └── [slug]/page.tsx     # Venue detail
│   │   ├── artistes/page.tsx       # Artists grid
│   │   ├── saison/page.tsx         # Season overview
│   │   ├── reserver/
│   │   │   ├── page.tsx            # Booking wizard
│   │   │   ├── loading.tsx         # Loading skeleton
│   │   │   └── actions.ts          # Booking server actions
│   │   └── compte/
│   │       ├── page.tsx            # Account dashboard
│   │       ├── layout.tsx          # Auth guard layout
│   │       └── actions.ts          # Auth server actions
│   └── page.tsx                    # Root redirect → /en
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # 'use client' — nav + mobile menu + lang toggle
│   │   ├── Footer.tsx              # Server component — site settings data
│   │   └── LanguageToggle.tsx      # 'use client' — EN/FR switch
│   ├── homepage/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── AnnouncementsSection.tsx
│   │   ├── ProgrammingSection.tsx
│   │   ├── VenuesSection.tsx
│   │   ├── ArtistsSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── CtaBanner.tsx
│   ├── programme/
│   │   ├── EventCard.tsx
│   │   ├── EventFilters.tsx        # 'use client' — filter state
│   │   ├── EventGrid.tsx
│   │   ├── EventList.tsx
│   │   └── CalendarView.tsx        # 'use client' — interactive calendar
│   ├── espaces/
│   │   ├── VenueCard.tsx
│   │   └── VenueSchedule.tsx
│   ├── artistes/
│   │   └── ArtistCard.tsx
│   ├── booking/
│   │   ├── BookingWizard.tsx       # 'use client' — wizard state machine
│   │   ├── StepIndicator.tsx
│   │   ├── EventTypeStep.tsx
│   │   ├── VenueTimeStep.tsx
│   │   ├── TicketInfoStep.tsx
│   │   └── ReviewStep.tsx
│   └── ui/                         # shadcn components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── dialog.tsx
│       ├── select.tsx
│       ├── calendar.tsx
│       ├── tabs.tsx
│       └── ...
├── lib/
│   ├── utils.ts                    # cn() helper, slugify/deslugify, date formatters
│   ├── fonts.ts                    # Inter + JetBrains Mono via next/font
│   └── event-colors.ts            # Event type color map + artist specialty color map
├── hooks/
│   └── use-fade-in.ts             # Intersection Observer hook for scroll animations
├── i18n/
│   ├── routing.ts                  # Locale config (en, fr)
│   └── request.ts                  # Message loading
└── messages/
    ├── en.json                     # English UI labels
    └── fr.json                     # French UI labels
```

### Dependencies to Add

- `tailwindcss` v4
- shadcn/ui components (via `npx shadcn@latest init` + individual component installs)
- `lucide-react` for icons (used by shadcn)
- Fonts via `next/font` (built into Next.js 15, no extra package)
- `next-intl` v4 (already in package.json)

No `framer-motion` — scroll animations handled with CSS transitions + Intersection Observer hook.

### Event Type Color Mapping

The mapping from event-type `name` to colors (since event-types have no slug field, we match by name):

| Event Type Name | Color Token | Hex |
|---|---|---|
| Concert | `concert` | `#e53e3e` |
| Theater | `theater` | `#d69e2e` |
| Exhibition | `exhibition` | `#3182ce` |
| Film Screening | `film` | `#805ad5` |
| Workshop | `workshop` | `#38a169` |
| Dance Performance | `dance` | `#dd6b20` |

The `getEventTypeColor(name: string): string` function in `src/lib/event-colors.ts` performs a case-insensitive lookup and returns a fallback gray for unknown types.

---

## 12. Mobile Responsiveness

- **Breakpoints:** Follow Tailwind defaults — sm (640px), md (768px), lg (1024px), xl (1280px)
- **Header:** Hamburger menu on mobile, full nav on desktop
- **Homepage hero:** Stacks vertically on mobile (text on top, image below)
- **Grids:** 3-col → 2-col → 1-col as viewport shrinks
- **6-color stripe:** Always visible, scales proportionally
- **Booking wizard:** Full-width steps, progress bar remains horizontal on mobile (compact labels)
- **Sticky bottom bar:** On event detail, becomes fixed full-width on mobile
