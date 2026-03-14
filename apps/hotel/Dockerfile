# Build context: monorepo root (../../ relative to this file)
# docker build -f apps/hotel/Dockerfile .
# docker-compose: context: ../..

FROM node:22.17.0-alpine AS base
RUN apk add --no-cache libc6-compat

# -- Install dependencies -------------------------------------------------------
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/tsconfig/package.json   ./packages/tsconfig/
COPY packages/seed-utils/package.json ./packages/seed-utils/
COPY apps/hotel/package.json          ./apps/hotel/

RUN corepack enable pnpm && pnpm install --frozen-lockfile

# -- Build -----------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/ ./

COPY turbo.json        ./
COPY packages/         ./packages/
COPY apps/hotel/       ./apps/hotel/

ARG NEXT_PUBLIC_SERVER_URL
ARG S3_ENDPOINT
ENV NEXT_PUBLIC_SERVER_URL="${NEXT_PUBLIC_SERVER_URL}"
ENV S3_ENDPOINT="${S3_ENDPOINT}"

# Dummy values so Payload config can load during build (no DB connection happens).
ENV PAYLOAD_SECRET="build-time-placeholder-secret-not-used"
ENV DATABASE_URL="mongodb://placeholder:27017/placeholder"

RUN corepack enable pnpm \
    && pnpm --filter=hotel run generate:types \
    && pnpm --filter=hotel run generate:importmap \
    && pnpm --filter=hotel run build

# -- Runner -----------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

COPY --from=builder /app/apps/hotel/public ./apps/hotel/public

RUN mkdir -p apps/hotel/.next && chown nextjs:nodejs apps/hotel/.next

COPY --from=builder --chown=nextjs:nodejs /app/apps/hotel/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/hotel/.next/static     ./apps/hotel/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node apps/hotel/server.js"]
