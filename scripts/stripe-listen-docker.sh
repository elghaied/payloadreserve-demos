#!/usr/bin/env bash
# scripts/stripe-listen-docker.sh
#
# Captures the Stripe webhook signing secret FIRST, writes it to .env,
# then starts/restarts Docker Compose so the container picks it up at start time.
#
# Usage: bash scripts/stripe-listen-docker.sh <app> <port>
# Example: bash scripts/stripe-listen-docker.sh salon 3000

set -euo pipefail

APP="${1:-salon}"
PORT="${2:-3000}"
ENV_FILE="apps/$APP/.env"
COMPOSE_FILE="apps/$APP/docker-compose.dev.yml"
ENDPOINT="http://localhost:$PORT/api/stripe-webhook"

# ── Preflight checks ─────────────────────────────────────────────────────────

if ! command -v stripe &>/dev/null; then
  echo "✗ Stripe CLI not found. Install it: https://stripe.com/docs/stripe-cli"
  exit 1
fi

if ! docker compose version &>/dev/null; then
  echo "✗ 'docker compose' not found. Install Docker Desktop or Docker Engine >=20.10."
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "✗ Compose file not found: $COMPOSE_FILE"
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "✗ Env file not found: $ENV_FILE  (copy .env.example and fill it in)"
  exit 1
fi

# ── Start stripe listen in background ────────────────────────────────────────

TMPFILE="$(mktemp /tmp/stripe-listen-XXXXXX.log)"
STRIPE_PID=""

cleanup() {
  rm -f "$TMPFILE"
  if [[ -n "$STRIPE_PID" ]]; then
    kill "$STRIPE_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "▶ Starting stripe listen → $ENDPOINT"
stripe listen --forward-to "$ENDPOINT" >"$TMPFILE" 2>&1 &
STRIPE_PID=$!

# ── Poll for webhook secret (up to 30 s) ─────────────────────────────────────

SECRET=""
TIMEOUT=30
ELAPSED=0

echo "  Waiting for webhook signing secret..."
while [[ $ELAPSED -lt $TIMEOUT ]]; do
  SECRET=$(grep -oE 'whsec_[A-Za-z0-9]+' "$TMPFILE" 2>/dev/null | head -1 || true)
  if [[ -n "$SECRET" ]]; then
    break
  fi
  sleep 1
  (( ELAPSED++ )) || true
done

if [[ -z "$SECRET" ]]; then
  echo "✗ Timed out waiting for webhook secret. Is 'stripe login' complete?"
  echo "  Stripe output:"
  cat "$TMPFILE"
  exit 1
fi

echo "✓ Got secret: $SECRET"

# ── Write secret to .env ──────────────────────────────────────────────────────

if grep -q "^STRIPE_WEBHOOK_SECRET=" "$ENV_FILE" 2>/dev/null; then
  sed -i "s|^STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=$SECRET|" "$ENV_FILE"
else
  echo "STRIPE_WEBHOOK_SECRET=$SECRET" >>"$ENV_FILE"
fi

echo "✓ $ENV_FILE → STRIPE_WEBHOOK_SECRET=$SECRET"
echo ""

# ── Start or restart Docker Compose ──────────────────────────────────────────

COMPOSE_ARGS=(-f "$COMPOSE_FILE" --env-file "$ENV_FILE")

if docker compose "${COMPOSE_ARGS[@]}" ps --status running 2>/dev/null | grep -q "\bapp\b"; then
  echo "▶ App container is running — recreating to inject new env var..."
  docker compose "${COMPOSE_ARGS[@]}" up --no-deps --force-recreate -d app
else
  echo "▶ Starting all services..."
  docker compose "${COMPOSE_ARGS[@]}" up -d
fi

echo ""
echo "✓ Docker Compose up — app: http://localhost:$PORT"
echo "✓ Webhook active (stripe listen is running in background)"
echo ""
echo "Press Ctrl+C to stop stripe listen and exit."
echo "──────────────────────────────────────────────"

# ── Stream remaining stripe listen output ────────────────────────────────────

tail -f "$TMPFILE" &
TAIL_PID=$!

wait "$STRIPE_PID" || true
kill "$TAIL_PID" 2>/dev/null || true
