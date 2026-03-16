# Build context: monorepo root (../../ relative to this file)
# docker build -f apps/docs/Dockerfile .

FROM node:22.17.0-alpine AS base
RUN apk add --no-cache libc6-compat

# ── Install dependencies ──────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY apps/docs/package.json         ./apps/docs/

RUN corepack enable pnpm && pnpm install --frozen-lockfile

# ── Build ─────────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/ ./

COPY turbo.json         ./
COPY packages/tsconfig/ ./packages/tsconfig/
COPY apps/docs/         ./apps/docs/

RUN corepack enable pnpm && pnpm --filter=docs run build

# ── Runner ────────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

COPY --from=builder /app/apps/docs/public ./apps/docs/public

RUN mkdir -p apps/docs/.next && chown nextjs:nodejs apps/docs/.next

# standalone output mirrors monorepo root structure
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/static     ./apps/docs/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node apps/docs/server.js"]
