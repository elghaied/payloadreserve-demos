# payload-reserve Demos

A pnpm monorepo showcasing multiple real-world use cases of the [`payload-reserve`](https://github.com/your-org/payload-reserve) plugin for [Payload CMS 3.x](https://payloadcms.com).

## Apps

| App | Subdomain | Description |
|-----|-----------|-------------|
| [salon](./apps/salon) | salon.payload-reserve.com | Beauty salon with specialists, per-specialist schedules, buffer time, i18n |
| hotel _(coming soon)_ | hotel.payload-reserve.com | Hotel rooms, multi-night stays, check-in/check-out |
| restaurant _(coming soon)_ | restaurant.payload-reserve.com | Party-size capacity, time slots, walk-in vs reservation |
| events _(coming soon)_ | events.payload-reserve.com | Fixed-capacity events, one-time schedules |

## Packages

| Package | Description |
|---------|-------------|
| [@payload-reserve-demos/tsconfig](./packages/tsconfig) | Shared TypeScript base config |
| [@payload-reserve-demos/seed-utils](./packages/seed-utils) | Shared seeding helpers (image upload, admin user creation) |

## Getting Started

```bash
# Install all dependencies
pnpm install

# Run the salon demo
pnpm dev:salon

# Build all apps
pnpm build

# Run a specific app directly
cd apps/salon && pnpm dev
```

## Structure

```
payload-reserve-demos/
├── apps/
│   ├── salon/          → salon.payload-reserve.com
│   ├── hotel/          (coming soon)
│   ├── restaurant/     (coming soon)
│   └── events/         (coming soon)
├── packages/
│   ├── tsconfig/       shared TypeScript config
│   └── seed-utils/     shared seeding helpers
├── turbo.json          build/dev pipeline
└── pnpm-workspace.yaml
```

## Requirements

- Node.js `^18.20.2 || >=20.9.0`
- pnpm `^9 || ^10`
- MongoDB instance per app (separate `DATABASE_URL` per demo)
