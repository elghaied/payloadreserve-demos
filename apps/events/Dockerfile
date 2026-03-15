# Build context: monorepo root (../../ relative to this file)
# docker build -f apps/events/Dockerfile .

FROM node:22.17.0-alpine AS base
RUN apk add --no-cache libc6-compat

# ── Install dependencies ──────────────────────────────────────────────────────
# Copy only manifests first so this layer is cached until deps change.
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/tsconfig/package.json   ./packages/tsconfig/
COPY packages/seed-utils/package.json ./packages/seed-utils/
COPY apps/events/package.json         ./apps/events/

RUN corepack enable pnpm && pnpm install --frozen-lockfile

# ── Build ─────────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

# Copy installed node_modules from deps stage, then overlay real source.
COPY --from=deps /app/ ./

COPY turbo.json        ./
COPY packages/         ./packages/
COPY apps/events/      ./apps/events/

ARG EVENTS_NEXT_PUBLIC_SERVER_URL
ARG S3_ENDPOINT
ENV NEXT_PUBLIC_SERVER_URL="${EVENTS_NEXT_PUBLIC_SERVER_URL}"
ENV S3_ENDPOINT="${S3_ENDPOINT}"

# Dummy values so Payload config can load during build (no DB connection happens).
# Set inline (not ENV) to avoid baking secrets into image layers.
RUN corepack enable pnpm \
    && export PAYLOAD_SECRET="build-time-placeholder-secret-not-used" \
    && export DATABASE_URL="mongodb://placeholder:27017/placeholder" \
    && pnpm --filter=events run generate:types \
    && pnpm --filter=events run generate:importmap \
    && pnpm --filter=events run build

# ── Runner ────────────────────────────────────────────────────────────────────
# outputFileTracingRoot is set to the monorepo root, so Next.js mirrors the
# monorepo directory structure inside .next/standalone/:
#   .next/standalone/apps/events/server.js   ← entry point
#   .next/standalone/node_modules/           ← shared deps
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

RUN mkdir -p apps/events/.next && chown nextjs:nodejs apps/events/.next

# standalone output (mirrors monorepo root structure)
COPY --from=builder --chown=nextjs:nodejs /app/apps/events/.next/standalone ./
# static assets must sit at the path server.js expects
COPY --from=builder --chown=nextjs:nodejs /app/apps/events/.next/static     ./apps/events/.next/static
COPY --from=builder /app/apps/events/public ./apps/events/public

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node apps/events/server.js"]
