# Commands Cheatsheet

## The short answer

| Situation | Command |
|---|---|
| Start the app for local development (Docker) | `pnpm docker:salon` |
| Populate the DB with demo data | Click **🌱 Seed demo data** in `/admin`, or `curl -X POST http://localhost:3000/api/seed -H 'X-Seed-Secret: <value>'` |
| Start without Docker (need external Mongo/S3) | `pnpm dev:salon` |

---

## Daily workflow (Docker)

```
pnpm docker:salon    ← start everything (run once, leave it running)
```

Then open `/admin` and click **🌱 Seed demo data** to populate the database.

`pnpm docker:salon` stays running in your terminal — it keeps Stripe webhook forwarding alive. Kill it with `Ctrl+C` to stop. The containers themselves keep running; next time just `pnpm docker:salon` again.

---

## Seeding demo data

Seeding is handled by a `POST /api/seed` endpoint built into the app itself — no separate Docker container needed.

**Two ways to seed:**

1. **Admin dashboard button** — visit `/admin`, log in, and click **🌱 Seed demo data** at the top of the dashboard. Uses your admin session cookie.

2. **HTTP request with secret key** — useful for external automation or a demo generator app:
   ```bash
   curl -X POST http://localhost:3000/api/seed \
     -H 'X-Seed-Secret: your-seed-secret'
   ```
   Set `SEED_SECRET` in `.env` to enable this.

3. **Local CLI** — still works for local dev without Docker:
   ```bash
   cd apps/salon && pnpm seed
   ```

---

## All commands

### From monorepo root

| Command | What it does |
|---|---|
| `pnpm docker:salon` | Grabs a fresh Stripe webhook secret, writes it to `.env`, then starts the **dev** Docker stack (`docker-compose.dev.yml`). Stays running to forward Stripe events. Use this for day-to-day Docker dev. |
| `bash scripts/stripe-listen.sh salon 3000` | Stripe webhook forwarder for **local** (non-Docker) dev. Captures the signing secret and writes it to `.env`, then keeps forwarding. Use alongside `pnpm dev:salon`. |
| `pnpm dev:salon` | Start the salon Next.js dev server locally via Turbo (no Docker). Requires MongoDB and S3/MinIO already running externally. |
| `pnpm build:salon` | Production build via Turbo. |
| `pnpm build` | Production build for all apps. |
| `pnpm lint` | Lint all apps. |
| `pnpm generate:types` | Regenerate `payload-types.ts` after any schema change. |
| `pnpm generate:importmap` | Regenerate import maps after adding/modifying admin components. |

### From `apps/salon/`

| Command | What it does |
|---|---|
| `pnpm dev` | Start dev server (same as `pnpm dev:salon` from root). |
| `pnpm devsafe` | Delete `.next` cache, then start dev. Use when you hit stale-cache weirdness. |
| `pnpm seed` | Run seed script **locally** (uses `tsx` directly). Needs a running MongoDB reachable via `DATABASE_URL` in `.env`. |
| `pnpm build` | Production build. |
| `pnpm start` | Start the built production server. |
| `pnpm test` | Run all tests (integration + e2e). |
| `pnpm test:int` | Vitest integration tests only. |
| `pnpm test:e2e` | Playwright e2e tests only. |
| `pnpm lint` | Lint salon only. |
| `pnpm generate:types` | Regenerate types for salon. |
| `pnpm generate:importmap` | Regenerate import map for salon. |
| `npx tsc --noEmit` | Type-check without emitting files. |

---

## Which compose file does what

| File | Used by | Purpose |
|---|---|---|
| `apps/salon/docker-compose.dev.yml` | `pnpm docker:salon` | Dev stack — build context is monorepo root, used for local development |
| `apps/salon/docker-compose.yml` | Coolify | Production-style stack |

---

## After schema changes

```bash
pnpm generate:types        # always run this after editing any collection/global
pnpm generate:importmap    # run this too if you added/changed an admin component
```
