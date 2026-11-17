import { withPayload } from "@payloadcms/next/withPayload";
import { withSentryConfig } from '@sentry/nextjs'
import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: '../../',
  serverExternalPackages: ['require-in-the-middle'],
  images: {
    // Payload >= 3.90 appends ?prefix=... to storage URLs; Next 16 rejects local images with a
    // query string unless a pattern allows it. The prefix differs per demo instance, so any query.
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/**', search: '' }],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
    ],
  },
}

const payloadConfig = withPayload(withNextIntl(nextConfig))
export default withSentryConfig(payloadConfig, {
  silent: true,
  webpack: { treeshake: { removeDebugLogging: true } },
})
