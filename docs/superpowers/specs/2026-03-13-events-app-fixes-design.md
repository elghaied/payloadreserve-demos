# Events App Fixes — Design Spec

**Date:** 2026-03-13
**App:** `apps/events/` (Eclat performing arts venue)
**Reference:** `apps/salon/` (Lumiere Salon — reference implementation)

## Problem

The events app has three categories of issues:

1. **French routes** — route paths use French names (`/programme`, `/espaces`, `/artistes`, `/saison`, `/compte`) instead of English
2. **Missing auth flow** — no password field in booking wizard, no login/logout in header, no login/register pages
3. **No payment or email** — Stripe plugin configured but not wired into booking; email hooks exist but are bypassed by `skipReservationHooks: true`

## Solution Overview

Port proven patterns from the salon reference implementation, adapting for the events app's theme and 4-step booking wizard structure.

---

## 1. Route Renaming

### Route mapping

| Current (French) | New (English) | Type |
|---|---|---|
| `[locale]/programme/` | `[locale]/events/` | Event listing |
| `[locale]/programme/[slug]/` | `[locale]/events/[slug]/` | Event detail |
| `[locale]/espaces/` | `[locale]/venues/` | Venue listing |
| `[locale]/espaces/[slug]/` | `[locale]/venues/[slug]/` | Venue detail |
| `[locale]/artistes/` | `[locale]/artists/` | Artists listing |
| `[locale]/saison/` | `[locale]/season/` | Season page |
| `[locale]/compte/` | `[locale]/account/` | Account dashboard |

### Directory renames

| From | To |
|---|---|
| `src/app/(frontend)/[locale]/programme/` | `src/app/(frontend)/[locale]/events/` |
| `src/app/(frontend)/[locale]/espaces/` | `src/app/(frontend)/[locale]/venues/` |
| `src/app/(frontend)/[locale]/artistes/` | `src/app/(frontend)/[locale]/artists/` |
| `src/app/(frontend)/[locale]/saison/` | `src/app/(frontend)/[locale]/season/` |
| `src/app/(frontend)/[locale]/compte/` | `src/app/(frontend)/[locale]/account/` |

Note: `loading.tsx` files in these directories move with their parent directory.

### Component directory renames (optional but recommended for consistency)

| From | To |
|---|---|
| `src/components/programme/` | `src/components/events/` |
| `src/components/espaces/` | `src/components/venues/` |
| `src/components/artistes/` | `src/components/artists/` |

### Files with hardcoded French route paths (must update links)

Beyond the Header, these files contain hardcoded French paths that must be updated:

- `src/components/homepage/VenuesSection.tsx` — links to `/espaces/`
- `src/components/homepage/AnnouncementsSection.tsx` — links to `/programme/`
- `src/components/espaces/VenueCard.tsx` → `src/components/venues/VenueCard.tsx` — links to `/espaces/`
- `src/components/programme/EventCard.tsx` → `src/components/events/EventCard.tsx` — links to `/programme/`
- `src/components/programme/EventList.tsx` → `src/components/events/EventList.tsx` — links to `/programme/`
- `src/components/programme/CalendarView.tsx` → `src/components/events/CalendarView.tsx` — links to `/programme/`
- `src/app/(frontend)/[locale]/saison/page.tsx` → season page — links to `/programme`
- `src/app/(frontend)/[locale]/espaces/[slug]/page.tsx` → venue detail — imports from `@/components/espaces/` and `@/components/programme/`
- `src/seed/data/homepage.ts` — hardcoded `ctaLink: '/en/programme'` and `'/fr/programme'`
- `src/seed/data/announcements.ts` — hardcoded `ctaLink: '/programme'`

### i18n translation key updates

Current nav keys: `programme`, `espaces`, `artistes`, `saison`
New nav keys: `events`, `venues`, `artists`, `season`

Update in both `en.json` and `fr.json`:
- English: "Events", "Venues", "Artists", "Season"
- French: "Programme", "Espaces", "Artistes", "Saison" (French UI labels preserved, only URL paths change)

---

## 2. Authentication Flow

### Critical prerequisite: Cookie-based auth

The events app currently uses Payload's `payload.login()` server action for auth, which returns a token but does NOT set browser cookies. The salon uses REST API `fetch('/api/customers/login', { credentials: 'include' })` which sets an HTTP-only cookie. This cookie-based approach is required for:
- The `customer-session` endpoint to read auth from headers
- Server-side auth checks in account layout via `payload.auth({ headers })`
- The booking wizard to detect logged-in users

**All login/register flows must use REST API fetch with `credentials: 'include'`, not server actions.**

### New routes

**`/[locale]/login/page.tsx`**
- Email + password form
- Uses `fetch('/api/customers/login', { credentials: 'include' })` — NOT a server action
- On success: full-page reload to `/${locale}/account` (remounts header, re-fetches auth)
- Error handling for invalid credentials

**`/[locale]/register/page.tsx`**
- Fields: firstName, lastName, email, password (min 6 chars), phone
- Creates customer via `fetch('POST /api/customers', { credentials: 'include' })`
- Auto-logs in after creation via `fetch('/api/customers/login', { credentials: 'include' })`
- Redirects to `/${locale}/account`

### New API endpoint

**`/api/customer-session/route.ts`** (outside `(payload)` route group — plain Next.js API route)
- GET handler that checks `req.user` from Payload auth headers
- Returns `{ user }` if authenticated AND `req.user.collection === 'customers'`
- Returns `{ user: null }` otherwise (not authenticated, or admin user)
- Safe replacement for `/api/customers/me` (avoids 404 errors)

### Header changes (`src/components/layout/Header.tsx`)

- On mount, fetch `/api/customer-session` to check auth state
- When NOT authenticated: show **Login** button (links to `/${locale}/login`)
- When authenticated: show **Account** button (links to `/${locale}/account`) + **Logout** button
- Keep existing: Book Now button, Language Toggle

### Booking wizard changes (Step 3 — TicketInfoStep)

- If user is logged in (detected via `/api/customer-session`): auto-populate firstName, lastName, email, phone from session; hide password field
- If user is NOT logged in: add required **password** field (min 6 chars) below existing fields
- Add `password` to the `CustomerInfo` type in `TicketInfoStep.tsx`
- Thread password through `BookingWizard` state into `createBooking` server action
- Update `canProceedFromStep` validation for step 3 to check password is non-empty and >= 6 chars when user is not logged in
- Remove `password: 'temp-' + Date.now()` hack from `createBooking` server action
- Pass actual password from form when creating new customer

### Account page

- Route renamed from `/compte` to `/account` (Section 1)
- Add `layout.tsx` with server-side auth check via `payload.auth({ headers })` — redirects to `/login` if not authenticated (salon pattern)
- Remove inline login/register tabs from `AccountView.tsx`
- Keep existing booking dashboard (upcoming/past bookings with cancel)
- Wire cancellation to use proper hooks (no `skipReservationHooks`)
- Add `overrideAccess: false` and pass authenticated `user` to `cancelBooking` for proper access control

---

## 3. Payment Integration (Stripe)

### Environment variables

Add `NEXT_PUBLIC_SITE_URL` to `.env.example` — required for constructing Stripe success/cancel redirect URLs. Falls back to `http://localhost:3000` in development.

### Booking action changes (`src/app/(frontend)/[locale]/book/actions.ts`)

The `createBooking` server action needs these changes:
- Read authenticated user via `payload.auth({ headers })` to detect logged-in customers
- Check `user.collection === 'customers'` to avoid cross-collection reference bugs
- Accept `password` parameter for new customer creation
- Remove `skipReservationHooks: true` from context

After booking is created:

```
if (STRIPE_SECRET_KEY is set AND eventType.price > 0):
  → Create Stripe checkout session:
    - line_items: [{ name: event name, unit_amount: price_in_cents, currency: 'eur', quantity: ticketQuantity }]
    - metadata: { reservationId: booking.id }
    - success_url: ${NEXT_PUBLIC_SITE_URL}/${locale}/book/success?reservation={id}&session_id={CHECKOUT_SESSION_ID}
    - cancel_url: ${NEXT_PUBLIC_SITE_URL}/${locale}/book/cancel?reservation={id}
  → Booking stays in "pending" status
  → Return { checkoutUrl }
  → Frontend redirects via window.location.href

else (no Stripe or free event):
  → Set booking status to "confirmed" directly
  → Return { checkoutUrl: null }
  → Show confirmation in wizard
```

Note: currency is `'eur'` (events app uses euros), NOT `'cad'` (salon uses CAD).

### New helper functions in `actions.ts`

**`confirmBookingViaStripe(bookingId, sessionId)`**
- Called by success page as webhook fallback
- Fetches Stripe checkout session via Stripe API
- Validates `session.metadata.reservationId === bookingId`
- If payment successful: updates booking to "confirmed"
- Idempotency guard: skips if already confirmed

**`getBookingConfirmation(bookingId)`**
- Fetches booking with `depth: 2` for display on success page
- Returns populated booking with event type, venue, customer details

### New routes

**`/[locale]/book/success/page.tsx`**
- Receives `?reservation=<id>&session_id=<sessionId>` from Stripe redirect
- Calls `getBookingConfirmation(reservationId)` to fetch booking details
- Checks if booking already confirmed (webhook may have fired first)
- If still pending + has session_id: calls `confirmBookingViaStripe()` to verify payment directly
- Shows confirmation with booking details

**`/[locale]/book/cancel/page.tsx`**
- Payment was cancelled at Stripe checkout
- Cancels the pending reservation (frees the time slot) — matches salon behavior
- Shows message with options: book again or return to homepage

### New API endpoint

**`/api/stripe-webhook/route.ts`** (outside `(payload)` route group)
- Listens for `checkout.session.completed` event
- Verifies webhook signature using `STRIPE_WEBHOOK_SECRET`
- Extracts `reservationId` from `session.metadata`
- Updates booking from "pending" → "confirmed"
- Idempotency guard: skips if already confirmed (handles Stripe retries)

---

## 4. Email Notifications Fix

### Root cause

The `createBooking` server action in `actions.ts` passes `context: { skipReservationHooks: true }` when creating/updating bookings. This prevents the `afterBookingConfirm` and `afterBookingCancel` hooks from firing.

### Fix

- Remove `skipReservationHooks: true` from the booking creation context
- For Stripe flow: email fires when webhook (or success page fallback) confirms the booking
- For free events: email fires when booking is confirmed directly
- For cancellation: remove `skipReservationHooks` from `cancelBooking` action — let `afterBookingCancel` hook send cancellation email

### Existing infrastructure (no changes needed)

- `src/email/templates/confirmation.ts` — bilingual confirmation template
- `src/email/templates/cancellation.ts` — bilingual cancellation template
- `src/hooks/reservationNotifications.ts` — `notifyAfterConfirm` and `notifyAfterCancel` hooks
- `payload.config.ts` — hooks already wired: `afterBookingConfirm: [notifyAfterConfirm]`, `afterBookingCancel: [notifyAfterCancel]`
- `nodemailerAdapter` — already configured

---

## Files to Create

| File | Purpose |
|---|---|
| `src/app/(frontend)/[locale]/login/page.tsx` | Customer login page |
| `src/app/(frontend)/[locale]/register/page.tsx` | Customer registration page |
| `src/app/(frontend)/[locale]/account/layout.tsx` | Server-side auth guard, redirects to /login if unauthenticated |
| `src/app/(frontend)/[locale]/book/success/page.tsx` | Stripe success redirect |
| `src/app/(frontend)/[locale]/book/cancel/page.tsx` | Stripe cancel redirect |
| `src/app/api/customer-session/route.ts` | Customer session check endpoint |
| `src/app/api/stripe-webhook/route.ts` | Stripe webhook handler |

## Files to Modify

| File | Changes |
|---|---|
| `src/components/layout/Header.tsx` | Add login/logout/account buttons, update nav links to English |
| `src/components/booking/BookingWizard.tsx` | Add password field, auto-populate if logged in, add password to CustomerInfo type, update step 3 validation |
| `src/app/(frontend)/[locale]/book/actions.ts` | Wire Stripe checkout, add auth detection, accept password param, add confirmBookingViaStripe + getBookingConfirmation helpers, remove skipReservationHooks, use EUR currency |
| `src/app/(frontend)/[locale]/compte/actions.ts` | Move to account path, remove skipReservationHooks from cancel, add overrideAccess: false |
| `src/app/(frontend)/[locale]/compte/page.tsx` | Move to account path, remove inline login/register tabs |
| `src/components/homepage/VenuesSection.tsx` | Update `/espaces/` links to `/venues/` |
| `src/components/homepage/AnnouncementsSection.tsx` | Update `/programme/` links to `/events/` |
| `src/components/programme/EventCard.tsx` | Update `/programme/` links to `/events/` (after move to components/events/) |
| `src/components/programme/EventList.tsx` | Update links (after move to components/events/) |
| `src/components/programme/CalendarView.tsx` | Update links (after move to components/events/) |
| `src/components/espaces/VenueCard.tsx` | Update links (after move to components/venues/) |
| `src/app/(frontend)/[locale]/saison/page.tsx` | Update links to `/events` (after move to season/) |
| `src/app/(frontend)/[locale]/espaces/[slug]/page.tsx` | Update imports from components/espaces/ and components/programme/ |
| `src/seed/data/homepage.ts` | Update hardcoded ctaLink `/en/programme` → `/en/events`, `/fr/programme` → `/fr/events` |
| `src/seed/data/announcements.ts` | Update hardcoded ctaLink `/programme` → `/events` |
| `src/messages/en.json` | Update nav keys (events/venues/artists/season), add login/register/payment translations |
| `src/messages/fr.json` | Update nav keys, add login/register/payment translations |
| `.env.example` | Add `NEXT_PUBLIC_SITE_URL` |

## Directories to Rename

| From | To |
|---|---|
| `src/app/(frontend)/[locale]/programme/` | `src/app/(frontend)/[locale]/events/` |
| `src/app/(frontend)/[locale]/espaces/` | `src/app/(frontend)/[locale]/venues/` |
| `src/app/(frontend)/[locale]/artistes/` | `src/app/(frontend)/[locale]/artists/` |
| `src/app/(frontend)/[locale]/saison/` | `src/app/(frontend)/[locale]/season/` |
| `src/app/(frontend)/[locale]/compte/` | `src/app/(frontend)/[locale]/account/` |
| `src/components/programme/` | `src/components/events/` |
| `src/components/espaces/` | `src/components/venues/` |
| `src/components/artistes/` | `src/components/artists/` |

---

## Out of Scope

- Additional email templates (reminder, abandoned payment, welcome) — salon has these but not needed for MVP
- Account profile page — salon has `/account/profile` but events can add later
- Reservation detail page (`/account/reservations/[id]`) — events account page shows bookings inline with cancel button, sufficient for now
- TestCardBanner component — nice-to-have, can add later
- CompletePaymentButton for pending reservations in account — can add later
