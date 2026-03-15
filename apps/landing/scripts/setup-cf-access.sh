#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────
# Cloudflare Access Setup Guide for payload-reserve.com
# Prints step-by-step instructions for Cloudflare dashboard config.
# ─────────────────────────────────────────────────────────────────

DOMAIN="${1:-payload-reserve.com}"
TEAM="${2:-<your-team-name>}"

cat <<GUIDE
╔══════════════════════════════════════════════════════════════════╗
║  Cloudflare Access Setup Guide — $DOMAIN
╚══════════════════════════════════════════════════════════════════╝

This guide configures Cloudflare Access to protect:
  • /admin/* — entire Payload CMS admin panel
  • /api/*   — all API routes (except 3 public endpoints)

Public routes that remain open (no auth required):
  • POST /api/demo/create     — demo request form (Turnstile protected)
  • GET  /api/demo/status/:id — demo status polling (token protected)
  • GET  /api/health           — uptime monitoring

═══════════════════════════════════════════════════════════════════
STEP 1: Add Domain to Cloudflare
═══════════════════════════════════════════════════════════════════

1. Log into https://dash.cloudflare.com
2. Click "Add a Site" → enter: $DOMAIN
3. Select the Free plan (sufficient for Access)
4. Cloudflare will scan existing DNS records
5. Update your domain registrar's nameservers to the ones Cloudflare provides
6. Wait for nameserver propagation (usually 5–30 minutes)

═══════════════════════════════════════════════════════════════════
STEP 2: Configure DNS
═══════════════════════════════════════════════════════════════════

1. Go to DNS → Records
2. Ensure your A record points to your Hetzner VPS IP
3. IMPORTANT: Enable Proxy mode (orange cloud icon ☁️)
   — This routes traffic through Cloudflare's network
4. Set SSL/TLS mode to "Full (Strict)"
   — Your Coolify/Traefik stack already provides a valid cert

═══════════════════════════════════════════════════════════════════
STEP 3: Configure Zero Trust — Access Application
═══════════════════════════════════════════════════════════════════

1. Go to https://one.dash.cloudflare.com
2. Navigate to: Access → Applications → "Add an application"
3. Choose: "Self-hosted"

Application settings:
  • Application name: "payload-reserve Admin"
  • Session duration: 24 hours
  • Application domain: $DOMAIN
  • Path: /admin

Click "Add another include path":
  • Path: /api

4. Under "Policies", click "Add a policy":
  • Policy name: "Allow Admin Emails"
  • Action: Allow
  • Include rule: "Emails ending in" → @yourdomain.com
    (or use "One-time PIN" for personal projects)

5. Save the application

═══════════════════════════════════════════════════════════════════
STEP 4: Get Application AUD and Team Domain
═══════════════════════════════════════════════════════════════════

1. After saving, click on the application you just created
2. Find the "Application Audience (AUD) Tag" — copy it
3. Your team domain is shown in the URL bar:
   https://<TEAM-NAME>.cloudflareaccess.com
   The team name is: $TEAM

═══════════════════════════════════════════════════════════════════
STEP 5: Set Environment Variables
═══════════════════════════════════════════════════════════════════

Add these to your Coolify service env vars (or .env):

  CF_ACCESS_TEAM_DOMAIN=$TEAM
  CF_ACCESS_POLICY_AUD=<paste-your-AUD-tag-here>

Then redeploy the landing app.

═══════════════════════════════════════════════════════════════════
STEP 6: Verify It Works
═══════════════════════════════════════════════════════════════════

# Should return 403 (protected):
curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/users

# Should return 200 (public):
curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/health

# Should redirect to CF login page:
curl -s -o /dev/null -w "%{http_code}" -L https://$DOMAIN/admin

# Should work with CF Access cookie (after logging in via browser):
# Open https://$DOMAIN/admin in your browser → authenticate via CF → admin loads

═══════════════════════════════════════════════════════════════════
DONE! Your Payload CMS is now protected by Cloudflare Access.
═══════════════════════════════════════════════════════════════════
GUIDE
