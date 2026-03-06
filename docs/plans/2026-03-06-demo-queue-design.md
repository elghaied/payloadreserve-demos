# Demo Request Queue System

## Problem

When all demo slots are full, users get a 503 error telling them to try again later. There's no way to "get in line."

## Solution

Queue pending requests and fulfill them automatically when slots free up. Users never get rejected -- they get an estimated availability time and receive credentials via email when their demo is ready.

## User-Facing Flow

### When slots available (unchanged)

Provision immediately, poll for status, show credentials on screen.

### When slots full

- Request saved as `pending`
- Response includes estimated availability time
- User sees: "Your demo has been registered! You'll receive an email with your credentials around **[estimated time]**. This may vary depending on availability."
- No polling -- user can close the tab

### When user already has a pending or active demo

Block with: "You've already requested a demo -- it'll be ready soon!"

## Estimated Time Calculation

1. Get all active demos sorted by `expiresAt` ASC
2. Count pending requests ahead in queue
3. User's queue position = pending ahead + 1
4. Estimated availability = the Nth earliest `expiresAt` where N = queue position

## Backend Changes

### `POST /api/demo/create` (modified)

- Remove 503 rejection when capacity full
- If capacity full: create DemoRequest with status `pending`, calculate and return estimated time
- New helper: `estimateAvailability(queuePosition)` -- queries active demos sorted by `expiresAt`, returns the Nth one
- Rate limit update: block if IP+email has a pending, provisioning, or active demo (not just 24h window)

### `POST /api/demo/cleanup` (extended)

- After cleaning expired demos, count available slots
- Query pending DemoRequests ordered by `createdAt` ASC (FIFO)
- For each available slot: provision the next pending request (reuse existing provisioning logic)
- Send credentials email on success

### `DemoRequests` collection (modified)

Add `pending` status. New flow: `pending` -> `submitted` -> `provisioning` -> `completed` | `failed`

## Frontend Changes

### `DemoRequestForm.tsx` (modified)

Handle new response shape when queued (estimated time instead of demoId/statusToken). Show queue confirmation screen instead of transitioning to poller.

### New component: `QueueConfirmation.tsx`

- Estimated availability time
- "You'll receive an email" message
- Link back to homepage

### `ErrorScreen.tsx` (modified)

Update duplicate-request detection for the new "already requested" message.

## Rate Limiting

- Old: block if IP+email has demo in last 24h
- New: block if IP+email has a pending, provisioning, or active demo
