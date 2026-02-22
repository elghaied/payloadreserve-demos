#!/usr/bin/env bash
# scripts/stripe-listen.sh
#
# Starts `stripe listen` for a demo app, captures the webhook signing secret
# from the CLI output, and writes it to the app's .env automatically.
#
# Usage: bash scripts/stripe-listen.sh <app> <port>
# Example: bash scripts/stripe-listen.sh salon 3000

APP="${1:-salon}"
PORT="${2:-3000}"
ENV_FILE="apps/$APP/.env"
ENDPOINT="localhost:$PORT/api/stripe-webhook"

if ! command -v stripe &>/dev/null; then
  echo "✗ Stripe CLI not found. Install it: https://stripe.com/docs/stripe-cli"
  exit 1
fi

echo "▶ Stripe webhook → http://$ENDPOINT"
echo "  Updating: $ENV_FILE"
echo ""

stripe listen --forward-to "$ENDPOINT" 2>&1 | while IFS= read -r line; do
  echo "$line"
  # The CLI prints the signing secret once on startup:
  # "Your webhook signing secret is whsec_xxx (^C to quit)"
  if [[ "$line" == *"whsec_"* ]]; then
    secret=$(echo "$line" | grep -oE 'whsec_[A-Za-z0-9]+')
    if [[ -n "$secret" ]]; then
      if grep -q "^STRIPE_WEBHOOK_SECRET=" "$ENV_FILE" 2>/dev/null; then
        sed -i "s|^STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=$secret|" "$ENV_FILE"
      else
        echo "STRIPE_WEBHOOK_SECRET=$secret" >> "$ENV_FILE"
      fi
      echo ""
      echo "✓ $ENV_FILE → STRIPE_WEBHOOK_SECRET=$secret"
      echo ""
    fi
  fi
done
