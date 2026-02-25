# Build context: monorepo root (../../ relative to this file)
# docker build -f apps/landing/Dockerfile .

FROM node:22.17.0-alpine AS base
RUN apk add --no-cache libc6-compat

# ── Install dependencies ──────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/tsconfig/package.json       ./packages/tsconfig/
COPY packages/types/package.json          ./packages/types/
COPY packages/coolify-sdk/package.json    ./packages/coolify-sdk/
COPY packages/email-templates/package.json ./packages/email-templates/
COPY apps/landing/package.json            ./apps/landing/

RUN corepack enable pnpm && pnpm install --frozen-lockfile

# ── Build ─────────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/ ./

COPY turbo.json           ./
COPY packages/tsconfig/   ./packages/tsconfig/
COPY packages/types/      ./packages/types/
COPY packages/coolify-sdk/ ./packages/coolify-sdk/
COPY packages/email-templates/ ./packages/email-templates/
COPY apps/landing/        ./apps/landing/

ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_SERVER_URL="${NEXT_PUBLIC_SERVER_URL}"
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY="${NEXT_PUBLIC_TURNSTILE_SITE_KEY}"

RUN corepack enable pnpm && pnpm --filter=landing run build

# ── Runner ────────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

COPY --from=builder /app/apps/landing/public ./apps/landing/public

RUN mkdir -p apps/landing/.next && chown nextjs:nodejs apps/landing/.next

# standalone output mirrors monorepo root structure
COPY --from=builder --chown=nextjs:nodejs /app/apps/landing/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/landing/.next/static     ./apps/landing/.next/static

USER nextjs

EXPOSE 3001
ENV PORT=3001

CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node apps/landing/server.js"]
