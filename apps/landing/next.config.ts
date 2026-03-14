import { withPayload } from "@payloadcms/next/withPayload";
import { withSentryConfig } from '@sentry/nextjs'
import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: '../../',
  experimental: {
    mdxRs: false,
  },
  images: {
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
export default withSentryConfig(payloadConfig, { silent: true, disableLogger: true })
