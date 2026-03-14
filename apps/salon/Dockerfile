# Build context: monorepo root (../../ relative to this file)
# docker build -f apps/salon/Dockerfile .
# docker-compose: context: ../..

FROM node:22.17.0-alpine AS base
RUN apk add --no-cache libc6-compat

# ── Install dependencies ──────────────────────────────────────────────────────
# Copy only manifests first so this layer is cached until deps change.
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/tsconfig/package.json   ./packages/tsconfig/
COPY packages/seed-utils/package.json ./packages/seed-utils/
COPY apps/salon/package.json          ./apps/salon/

RUN corepack enable pnpm && pnpm install --frozen-lockfile

# ── Build ─────────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

# Copy installed node_modules from deps stage, then overlay real source.
COPY --from=deps /app/ ./

COPY turbo.json        ./
COPY packages/         ./packages/
COPY apps/salon/       ./apps/salon/

ARG SALON_NEXT_PUBLIC_SERVER_URL
ARG S3_ENDPOINT
ENV NEXT_PUBLIC_SERVER_URL="${SALON_NEXT_PUBLIC_SERVER_URL}"
ENV S3_ENDPOINT="${S3_ENDPOINT}"

# Dummy values so Payload config can load during build (no DB connection happens).
ENV PAYLOAD_SECRET="build-time-placeholder-secret-not-used"
ENV DATABASE_URL="mongodb://placeholder:27017/placeholder"

RUN corepack enable pnpm \
    && pnpm --filter=salon run generate:types \
    && pnpm --filter=salon run generate:importmap \
    && pnpm --filter=salon run build

# ── Runner ────────────────────────────────────────────────────────────────────
# outputFileTracingRoot is set to the monorepo root, so Next.js mirrors the
# monorepo directory structure inside .next/standalone/:
#   .next/standalone/apps/salon/server.js   ← entry point
#   .next/standalone/node_modules/          ← shared deps
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

COPY --from=builder /app/apps/salon/public ./apps/salon/public

RUN mkdir -p apps/salon/.next && chown nextjs:nodejs apps/salon/.next

# standalone output (mirrors monorepo root structure)
COPY --from=builder --chown=nextjs:nodejs /app/apps/salon/.next/standalone ./
# static assets must sit at the path server.js expects
COPY --from=builder --chown=nextjs:nodejs /app/apps/salon/.next/static     ./apps/salon/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node apps/salon/server.js"]
